import React from 'react'

const Header = () => {
  return (
    <header className="py-5" style={{backgroundColor: "#6050DC"}} >
        <div className="container px-4 px-lg-5 my-5">
            <div className="text-center text-white">
                <h1 className="display-4 fw-bolder">Welcome To Shoppit</h1>
                <p className="lead fw-normal text-white-75 mb-4">Shop trendy collection online with ease</p>
                <a href="#shop" className="btn btn-light btn-lg">Shop Now</a>
            </div>
        </div>
    </header>
    
  )
}

export default Header