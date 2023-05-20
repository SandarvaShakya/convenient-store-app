import { useEffect, useState } from 'react';
import productService from './services/product'
import invoiceService from './services/invoice'
import './App.css';

function App() {
  //the options available for the select element
  const [productOptions, setProductOptions] = useState([])
  //the products that are clicked in the select element
  const [selectedProducts, setSelectedProducts] = useState([])
  //records the change that happens in the customer input field
  const [customerName, setCustomerName] = useState('')
  //records the change in payment id
  const [paymentId, setPaymentId] = useState('')
  //the invoice stores all the products when the create invoice button is clicked
  const [invoice, setInvoice] = useState([])

  // brings all the products form the database for options
  useEffect(() => {
    productService
      .getAll()
      .then(products => {
        setProductOptions(products)
      })
  }, [])

  //Adds product to the list
  const addProduct = (event) => {
    const product = {
      "product_name": event.target.value,
      "quantity": 1
    }
    setSelectedProducts([...selectedProducts, product])
  }

  //Increase the default quantity
  const increaseQuantity = (name) => {
    const productIndex = selectedProducts.findIndex(product => product.product_name === name);
    if (productIndex !== -1) {
      const updatedProduct = { ...selectedProducts[productIndex] };
      updatedProduct.quantity += 1;
      setSelectedProducts([
        ...selectedProducts.slice(0, productIndex),
        updatedProduct,
        ...selectedProducts.slice(productIndex + 1)
      ]);
    }
  }

  //Decrease the default quantity
  const decreaseQuantity = (name) => {
    const productIndex = selectedProducts.findIndex(product => product.product_name === name);
    if (productIndex !== -1 && selectedProducts[productIndex].quantity > 0) {
      const updatedProduct = { ...selectedProducts[productIndex] };
      updatedProduct.quantity -= 1;
      setSelectedProducts([
        ...selectedProducts.slice(0, productIndex),
        updatedProduct,
        ...selectedProducts.slice(productIndex + 1)
      ]);
    } 
  }

  //Generates the invoice where the rate, quantity and total are specified
  const createInvoice = (event) => {
    event.preventDefault()
    // format of the json to be sent in procedure
    const invoice_detail = {
      customer_name: customerName,
      payment_id: paymentId,
      product_detail: selectedProducts
    }

    // the createInvoice procedure is called through express
    invoiceService
    .create(invoice_detail)
    .then(result => {
      setInvoice(result)
    })
  }

  const checkout = () => {
    setInvoice([]);
    setSelectedProducts([]);
  }
  
  return (
    <div className="wrapper">
      <div className="container">
        <h1>Convienient Store</h1>
        <form onSubmit={createInvoice}>
          <div className="form--element">
            <label htmlFor="customer_name">Customer Name</label>
            <input type="text" name="customer_name" onChange={(event) => setCustomerName(event.target.value)}/>
          </div>
          {/* Options for payment id */}
          <div className="form--element">
            <label htmlFor="payment_id">Payment Method</label>
            <div className="select">
              <select name="payment_id" onChange={(event) => setPaymentId(event.target.value)} defaultValue="CASH">
                <option value="CASH">CASH</option>
                <option value="FONEPAY">FONEPAY</option>
              </select>
            </div>
          </div>
          {/* Options of all the products available in database */}
          <label htmlFor="products">Product</label>
          <select name="products" onChange={addProduct} className='products'>
            {productOptions.map((product, index) => {
              return <option key={index} value={product.product_name}>{product.product_name}</option>
            })}
          </select>
          <button type="submit">Create invoice</button>
        </form>

        <h2>Items Added</h2>
        <table> 
          <tbody>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
            </tr>
            {selectedProducts.map((product) => {
              return (
                <tr key={product.product_name}>
                  <td>{product.product_name}</td>
                  <td>
                    <button onClick={() => decreaseQuantity(product.product_name)}>-</button>
                    {product.quantity}
                    <button onClick={() => increaseQuantity(product.product_name)}>+</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* The actual invoce that is generated */}
        <h2>Invoice</h2>
        <div>
          <table>
            <tbody>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
              {invoice.table && invoice.table.map((product, index) => {
                return (
                <tr key={index}>
                  <td>{product.product_name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>{product.total}</td>
                </tr>)
              })}
            </tbody>
          </table>
          <h2>Total: {invoice.total && invoice.total[0].total}</h2>
        </div>
        <button onClick={checkout}>Checkout</button>
      </div>
    </div>
  );
}

export default App;
