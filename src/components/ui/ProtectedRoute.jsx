import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { BACKEND_BASE } from '../../api';
import { Navigate, useLocation } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {

  const [isAuthorized, setIsAuthorized] = useState(true)
  const location = useLocation()


  useEffect(function () {
    auth().catch(() => setIsAuthorized(false))
  }, [])


  async function refreshToken() {
    const refreshToken = localStorage.getItem("refresh")

    try {
      const res = await axios.post(BACKEND_BASE + "/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        const authData = res.data.success ? res.data.data : res.data;
        localStorage.setItem("access", authData.access)
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
      }
    }

    catch (error) {
      console.log(error)
      setIsAuthorized(false)
    }
  }

  async function auth() {

    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const expiry_date = decoded.exp;
    const current_time = Date.now() / 1000;

    if (current_time > expiry_date) {
      await refreshToken();
    }
    else {
      setIsAuthorized(true);
    }
  }



  return (
    isAuthorized ? children : <Navigate to="/login" state={{ from: location }} replace />
  )

}

export default ProtectedRoute