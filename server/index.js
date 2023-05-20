require('dotenv').config()
const express = require('express')
const dbConnect = require('./config')
const cors = require('cors')

const app = express()
const mysql = require('mysql')
app.use(express.json())
app.use(cors())

//PRODUCTS CRUD
//READ PRODUCTS
/**
 * Shows all the products from the database
 */
app.get('/api/products', (request, response) => {
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL ShowProducts()`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[0])
        })
    }
})

//CREATE PRODUCTS
/**
 * Inserts product into database
 */
app.post('/api/products', (request, response) => {
    const body = request.body
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL CreateProduct('${JSON.stringify(body)}');
        SELECT * FROM product WHERE product_id = LAST_INSERT_ID()`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[1])
        })
    }
})

//UPDATE PRODUCTS
/**
 * Updates product data
 */
app.put('/api/products/:id', (request, response) => {
    const body = request.body
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");;
        const sqlQuery = `CALL UpdateProduct(${request.params.id}, '${JSON.stringify(body)}');
        SELECT * FROM product WHERE product_id = ${request.params.id}`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[1])
        })
    }
})

//DELETE PRODUCTS
/**
 * Deletes product
 */
app.delete('/api/products/:id', (request, response) => {
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL DeleteProduct(${request.params.id})`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.status(204).end()
        })
    }
})

//CUSTOMER CRUD
//READ CUSTOMER
/**
 * Shows all the customers from the database
 */
app.get('/api/customers', (request, response) => {
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL ShowCustomers()`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[0])
        })
    }
})

//CREATE CUSTOMER
/**
 * Inserts customer into database
 */
app.post('/api/customers', (request, response) => {
    const body = request.body
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL CreateCustomer('${JSON.stringify(body)}');
        SELECT * FROM customer WHERE customer_id = LAST_INSERT_ID()`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[1])
        })
    }
})

//UPDATE CUSTOMER
/**
 * Updates customer data
 */
app.put('/api/customers/:id', (request, response) => {
    const body = request.body
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");;
        const sqlQuery = `CALL UpdateCustomer(${request.params.id}, '${JSON.stringify(body)}');
        SELECT * FROM customer WHERE customer_id = ${request.params.id}`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json(result[1])
        })
    }
})

//DELETE CUSTOMERS
/**
 * Deletes customer
 */
app.delete('/api/customers/:id', (request, response) => {
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `CALL DeleteCustomer(${request.params.id})`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.status(204).end()
        })
    }
})

//CREATE Invoice
/**
 * Inserts invoice, sales_transaction, trasaction_product into database
 */
app.post('/api/invoice', (request, response) => {
    const body = request.body
    const sqlConnection = mysql.createConnection(dbConnect.config)

    if(sqlConnection){
        console.log("Connected to database successfully.");
        const sqlQuery = `SET @t_id = 0;
        SET @tot = 0;
        CALL CreateInvoice('${JSON.stringify(body)}', @t_id);
        CALL ShowInvoice('${body.customer_name}', @t_id, @tot);
        SELECT @tot AS total`
        sqlConnection.query(sqlQuery, (error, result) => {
            if(error){
                response.json(error)
            }
            response.json({"table": result[3], "total": result[5]})
        })
    }
})



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log("Server Successfully Running..");
})