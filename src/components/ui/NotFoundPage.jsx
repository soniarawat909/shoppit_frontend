import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <header className="py-3 my-5" style={{backgroundColor: "#6050DC"}} >
        <div className="container px-4 px-lg-5 my-5">
            <div className="text-center text-white">
                <h1 className="display-4 fw-bold">PAGE NOT FOUND</h1>
                <p className="lead fw-normal text-white-75 mb-4">THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST</p>
                <Link to="/" className="btn btn-light btn-lg rounded-pill px-4 py-2">Home</Link>
            </div>
        </div>
    </header>
  )

}

export default NotFoundPage