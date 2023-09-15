import React, {useState, useEffect} from 'react'

const ProductsList = () => {
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/products');

        const data = await response.json();

        setProducts(data);
      }
    )();

  }, []);
  
  return (
    <div class="table-responsive small">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Inventory</th>
              <th scope="col">Price</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              return (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  <td>
                    <a href="#" class="btn btn-sm btn-outline-secondary"
                      // onClick={e => del(product.product_id)}
                    >
                      Add to cart
                    </a>
                  </td>
                </tr>
              )}
            )}
          </tbody>
        </table>
      </div>
  )
}

export default ProductsList