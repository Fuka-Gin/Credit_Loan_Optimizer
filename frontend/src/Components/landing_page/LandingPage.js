import React from "react";
import './LandingPage.css';
import { Link } from "react-router-dom";

const LandingPage = () => {
    return( 
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <h2 className='brandName'>FinisCredo</h2>
                </div>
                <div className="navlinks" style={ {marginLeft: '780px'} }>
                    <Link to='/' id="active">Home</Link>
                </div>
                <div className="navlinks">
                    <Link to='/about'>About</Link>
                </div>
                <div className="navlinks">
                    <Link to='/signup' id="signup-button">Sign Up</Link>
                </div>
            </nav>
            <div className="heading-section">
                <Link to='/login' id="login-button" className="btn btn-primary btn-lg">Login</Link>
            </div>
            
        </div>
    );
};

export default LandingPage;