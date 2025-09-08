import  { useContext, useState } from 'react';
import "./LoginPage.css"
import api from '../../api';
import {  replace , useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


const LoginPage = () => {

    const {setIsAuthenticated, get_username}= useContext(AuthContext)

    const location = useLocation()
    const navigate = useNavigate()

    const [username , setUsername] = useState("")
    const [password , setPassword] = useState("")
    
    console.log("Submitting:", { username, password }); 

  function handleSubmit(e){
    e.preventDefault()

    api
      .post("/token/", { username, password }) 
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("access", res.data.access)
        localStorage.setItem("refresh", res.data.refresh)
        setUsername("")
        setPassword("")
        setIsAuthenticated(true)
        get_username()

        const from = location?.state?.from?.pathname || "/cart" ;
        navigate(from);
        console.log(from)

      })

      .catch((err) => {
        if (err.response) {
          console.log("Error status:", err.response.status);
          console.log("Error data:", err.response.data); 
        } else {
          console.log("Error message:", err.message);
        }
      });
  }

  return (
    <div className="login-container my-5">
      <div className="login-card shadow">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="username"
              className="form-control"
              value = {username} 
              onChange={(e) => setUsername(e.target.value)} 
              id="username"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              value = {password} 
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn my-btn w-100">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p><a href="#">Forgot Password?</a></p>
          <p>Don't have an account? <a href="#">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
