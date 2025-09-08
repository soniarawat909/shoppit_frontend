import React, { useEffect, useState } from 'react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import api from '../../api'

const CartPage = ({setNumCartItems}) => {


const cart_code = localStorage.getItem("cart_code")
const [cartitems, setCartItems] =useState([])
const [cartTotal, setCartTotal] = useState(0.00)
const tax = 2.00

    useEffect(function(){
        api.get(`get_cart?cart_code=${cart_code}`)
        .then(res=>{
            console.log(res.data)
            setCartItems(res.data.items)
            setCartTotal(res.data.sum_total)
        })
        .catch(err =>{
            console.log(err.message)
        })
    },[])

    if (cartitems.length < 1){
        return(
            <div className="alert alert-primary my-5" role="alert">
                YOU HAVE NOT ADDED ANY ITEM TO YOUR CART
            </div>
        )
    }

  return (
    <div className="container my-3 py-3" style={{ height: "80vh", overflow: "scroll" }}>
      <h5 className="mb-4">Shopping Cart</h5>
      <div className="row">
        
        <div className="col-md-8">
            {cartitems.map(item => <CartItem key={item.id} item={item} 
            cartitems={cartitems} 
            setCartTotal ={setCartTotal} 
            setNumCartItems={setNumCartItems}
            setCartItems= {setCartItems}/>)} 
        </div>
          <CartSummary cartTotal={cartTotal} tax={tax} />
        </div>
      </div>
    
  )
}

export default CartPage
