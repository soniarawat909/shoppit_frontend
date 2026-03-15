import { createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import api from "../api";

export const AuthContext = createContext(false)

export function AuthProvider({ children }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState("")
    const [isStaff, setIsStaff] = useState(false)


    const handleAuth = () => {
        const token = localStorage.getItem("access");
        if (token) {
            const decoded = jwtDecode(token);
            const expiry_date = decoded.exp;
            const current_time = Date.now() / 1000;

            if (expiry_date > current_time) {
                setIsAuthenticated(true)
                setIsStaff(decoded.is_staff || false)
            }
        }
    }


    function get_username() {
        api.get("get_username")
            .then(res => {
                if (res.data.success) {
                    setUsername(res.data.data.username || "")
                    setIsStaff(res.data.data.is_staff || false)
                } else {
                    setUsername(res.data.username || "")
                    // If old format fallback is needed, we could check res.data.is_staff here too
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    useEffect(function () {
        handleAuth()
        get_username()
    }, [])

    const authValue = { isAuthenticated, setIsAuthenticated, get_username, username, isStaff, setIsStaff, handleAuth }



    return <AuthContext.Provider value={authValue} >
        {children}
    </AuthContext.Provider>
}