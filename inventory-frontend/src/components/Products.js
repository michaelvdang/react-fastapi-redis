import React, { useEffect } from 'react'
import Wrapper from './Wrapper'
import { Link, useNavigate } from 'react-router-dom'

const Products = () => {
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/products');

        const data = await response.json();

        setProducts(data);
      }
    )();

  }, []);
  
  const del = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await fetch(`http://localhost:8000/products/${id}`, {
        method: 'DELETE'
      });
      setProducts(products.filter(product => product.id !== id));
    }
  }
  
  return (
    <Wrapper>
      <div className="pt-3 pb-2 mb-3 border-bottom">
        <Link to={'/create'} className="btn btn-sm btn-outline-secondary">Add</Link>
      </div>
      <div class="table-responsive small">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>
                    <a href="#" class="btn btn-sm btn-outline-secondary"
                      onClick={e => del(product.id)}
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              )}
            )}
          </tbody>
        </table>
      </div>
    </Wrapper>
  )
}

export default Products