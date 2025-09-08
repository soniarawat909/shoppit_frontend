import React, { useState } from 'react'
import { BASE_URL } from '../../api'
import api from '../../api'

const CartItem = ({item, cartitems , setCartTotal , setNumCartItems , setCartItems}) => {

  const[quantity,setQuantity]= useState(item.quantity)

  const itemData ={quantity:quantity, item_id:item.id}
  const itemID = {item_id: item.id}

  function deleteCartitem() {
  const confirmDelete = window.confirm("ARE YOU SURE?");
  
  if (confirmDelete) {
    api.post("delete_cartitem/", itemID)
      .then(res => {
        console.log(res.data);

        // ✅ create updated array first
        const updatedCartItems = cartitems.filter(cartitem => cartitem.id !== item.id);

        // ✅ now update states using new array
        setCartItems(updatedCartItems);
        setCartTotal(updatedCartItems.reduce((acc, curr) => acc + curr.total, 0));
        setNumCartItems(updatedCartItems.reduce((acc, curr) => acc + curr.quantity, 0));
      })
      .catch(err => {
        console.log(err.message);
      });
  }
}


  function updateCartitem(){
    api.patch("update_quantity/", itemData)
    .then(res =>{
      console.log(res.data)

      const updatedItems = cartitems.map((cartitem)=> cartitem.id === item.id ? res.data.data : cartitem)

      setCartTotal(updatedItems.reduce((acc,curr)=> acc+curr.total,0))
      setNumCartItems(updatedItems.reduce((acc, curr) => acc + curr.quantity, 0))
    })
    .catch(err =>{
      console.log(err.message)
    })
  }

  return (
    <div className="col-md-12">
      {/* Cart Items */}
      <div
        className="cart-item d-flex align-items-center mb-3 p-3"
        style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}
      >
        <img
          src={`${BASE_URL}${item.product.image}`}
          alt="Product Image"
          className="img-fluid"
          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
        />
        <div className="ms-3 flex-grow-1">
          <h5 className="mb-1">{item.product.name}</h5>
          <p className="mb-0 text-muted">{`$${item.product.price}`}</p>
        </div>
        <div className="d-flex align-items-center">
          <input
            type="number"
            className="form-control me-3"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: '70px' }}
          />
          <button className="btn btn btn-sm mx-2" onClick={updateCartitem} style={{backgroundColor: "#4b3bcb", color:"white"}}>Update</button>
          <button className="btn btn-danger btn-sm" onClick={deleteCartitem}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
