import React from "react";
import './LandingPage.css';
import { Link } from "react-router-dom";

const LandingPage = () => {
    return( 
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <h2>Credit Loan</h2>
                </div>
                <div className="links" style={ {marginLeft: '650px'} }>
                    <Link to='/'>Home</Link>
                </div>
                <div className="links">
                    <Link to='/about'>About</Link>
                </div>
                <div className="links">
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