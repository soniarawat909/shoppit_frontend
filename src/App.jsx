import NavBar from "./components/ui/NavBar";
import { BrowserRouter , Routes , Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./components/Home/HomePage";
import NotFoundPage from "./components/ui/NotFoundPage";
import ProductPage from "./components/product/ProductPage";
import { useEffect, useState } from "react";
import api from "./api";
import CartPage from "./components/cart/CartPage";
import LoginPage from "./components/user/LoginPage"
import ProtectedRoute from "./components/ui/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./components/user/RegisterPage";

const App = () => {

  const[numCartItems, setNumCartItems]= useState(0);
  const cart_code = localStorage.getItem("cart_code")

  useEffect(function(){
    if(cart_code){

      api.get(`get_cart_stat?cart_code=${cart_code}`)
      .then(res=>{
        console.log(res.data)
        setNumCartItems(res.data.num_of_items)

      })

      .catch(err=>{
        console.log(err.message)
      })
    }


  },[])


  return (
   <AuthProvider>

    <Routes>
      <Route path="/" element={<MainLayout numCartItems={numCartItems}/>}>
      <Route index element={<HomePage/>} />
      <Route path="products/:slug" element={<ProductPage setNumCartItems={setNumCartItems}/>}/>
      <Route path="cart" element={<ProtectedRoute>
        <CartPage setNumCartItems={setNumCartItems}/>
        </ProtectedRoute>}/>
      <Route path="login" element={<LoginPage/>}/>
      <Route path="*" element={<NotFoundPage/>} />
      <Route path="register" element={<RegisterPage />} />
      </Route>
    </Routes>
   </AuthProvider>
    
  )
}

export default App