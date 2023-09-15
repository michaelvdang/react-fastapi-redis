import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import ProductsList from './ProductsList'

const Orders = () => {
  const [product, setProduct] = useState({
    product_id: '',
    name: '',
    quantity: '',
    price: ''
  })
  const [message, setMessage] = useState('Make a purchase')
  const [form, setForm] = useState({
    product_id: '',
    quantity: ''
  })

  // retrieve product name from redis
  useEffect(() => {
    (async () => {
      let url = 'http://localhost:8000/products/' + form.product_id
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.name === undefined) {
          setProduct('Product not found')
          return
        }
        setProduct({
          product_id: data.product_id,
          name: data.name,
          quantity: data.quantity,
          price: data.price
        });
      })
    })()

  }, [form.product_id])

  const navigate = useNavigate();

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    // console.log(form.product_id) // form won't have updated value yet
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // alert(form.product_id + ' ' + form.quantity)
    let res = await fetch('http://localhost:9000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.product_id,
        quantity: form.quantity
      })
    })
    // .then(response => response.json())
    // .then(order => console.log(order));

    const order = await res.json();
    console.log(order);
    setMessage('Purchase successful!')
    navigate('/');
  }
  
  return (
      <Wrapper>
          <ProductsList />
          <div className='py-5 text-center'>
            <h2>Checkout Form</h2>
            <p className='lead'>{message}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className='row g-3'>
              <div className='col-sm-3'>
                <label className='form-label'
                >Product ID</label>
                <input 
                  className='form-control' 
                  placeholder='Product ID'
                  onChange={handleChange}
                  name='product_id'
                  value={form.product_id}
                />
              </div>
              <div className='col-sm-3'>
                <label className='form-label'
                >Product Name</label>
                <p>{product.name}</p>
              </div>
              <div className='col-sm-3'>
                <label className='form-label'
                >Product Price</label>
                <p>{product.price}</p>
              </div>

              <div className='col-sm-3'>
                <label className='form-label'
                >Quantity</label>
                <input 
                  className='form-control' 
                  type='number'
                  name='quantity'
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <hr className='my-4'/>
            <button className='w-100 btn btn-primary btn-lg' type='submit'>Buy</button>
          </form>
          <p>The app is querying redis for the product name whenever there is a change in product ID. 
            This is not practical but it is just to demonstrate how to use redis with nodejs.
            There should also be context to manage the state of the products list and the cart.
            When buy is clicked, the app should update the inventory of the product in the database.
          </p>
          
      </Wrapper>
  )
}

export default Orders