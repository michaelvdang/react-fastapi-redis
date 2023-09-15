import React, {useState} from 'react'
import Wrapper from './Wrapper'
import { useNavigate } from 'react-router'

const ProductsCreate = () => {
  // const [name, setName] = React.useState('')
  // const [price, setprice] = useState('')
  // const [quantity, setQuantity] = useState('')
  const navigate = useNavigate()
  
  const [form, setForm] = useState({
    name: '',
    price: '',
    quantity: ''
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const submit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8000/products', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: form.name,
        price: form.price,
        quantity: form.quantity
      })
    });
    await navigate(-1);// to previous page
    // await navigate('/');
  }
  
  return (
    <Wrapper>

    <form className='mt-3' onSubmit={submit}>
      <div className='form-floating pb-3'>
        <input className='form-control' 
          placeholder='Name' 
          onChange={handleChange} 
          name='name'
          value={form.name}
        />
        <label>Name</label>
      </div>
      
      <div className='form-floating pb-3'>
        <input className='form-control' 
          placeholder='Price' 
          type='number'
          name='price'
          onChange={handleChange} 
          value={form.price}
        />
        <label>Price</label>
      </div>
      <div className='form-floating pb-3'>
        <input className='form-control' 
          placeholder='Quantity' 
          type='number'
          name='quantity'
          onChange={handleChange} 
          value={form.quantity}
        />
        <label>Quantity</label>
      </div>

      <button className='w-100 btn btn-lg btn-primary' type='submit'>Submit</button>
    </form>

    </Wrapper>
  )
}

export default ProductsCreate