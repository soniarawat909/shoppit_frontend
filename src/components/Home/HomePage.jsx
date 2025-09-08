import Header from './Header'
import CardContainer from './CardContainer'
import { useEffect, useState } from 'react'
import api from '../../api'
import { randomValue } from '../../GenerateCartCode'

const HomePage = () => {

    const[products, setProducts]= useState([])

    useEffect(function(){
      if(localStorage.getItem("cart_code")=== null){
        localStorage.setItem("cart_code", randomValue)
      }
    },[])

    useEffect(function() {   
    api.get("products")
    .then(res => {
        console.log(res.data)
        setProducts(res.data)
    })
    .catch(err => {
            console.error(err.message)})
    }, [])

  return (
    <>
    <Header/>
    <CardContainer products={products}/>
    </>
  )
}

export default HomePage