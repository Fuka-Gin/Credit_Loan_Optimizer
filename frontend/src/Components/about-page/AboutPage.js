import React from "react";
import './AboutPage.css';
import { Link } from "react-router-dom";

const AboutPage = () => {
    return(
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <h2 className='brandName'>FinisCredo</h2>
                </div>
                <div className="navlinks" style={ {marginLeft: '650px'} }>
                    <Link to='/'>Home</Link>
                </div>
                <div className="navlinks">
                    <Link to='/about' id="active">About</Link>
                </div> 
                <div className="navlinks">
                    <Link to='/signup' id="signup-button">Sign Up</Link>
                </div>
            </nav>
            <h2 id="header">About us</h2>
            <div className="content-section">
                <div className="content">
                    <h2 className="content-header">What is FinisCredo?</h2>
                    <p className="content-body">
                        FinisCredo is a comprehensive financial platform dedicated to helping individuals and businesses manage their credit card debts effectively. 
                        We provide tools and services such as debt tracking, repayment strategy planning, and personalized financial insights to help users regain 
                        control of their finances and work towards a debt-free future.
                    </p>
                </div>
                <div className="content">
                    <h2 className="content-header">Can FinisCredo be trusted?</h2>
                    <p className="content-body">
                        Absolutely. At FinisCredo, trust and transparency are at the heart of everything we do. Our platform uses secure encryption methods to protect user data, 
                        and we offer clear, actionable insights without hidden fees or misleading terms. Our growing community of satisfied users stands as a testament to our 
                        credibility and commitment.
                    </p>
                </div>
                <div className="content">
                    <h2 className="content-header">How to use Netikos Dimoprasía?</h2>
                    <p className="content-body">
                        Using FinisCredo is simple. Sign up and connect your credit card details securely. Our system will automatically track your balances, calculate 
                        your debt-to-income ratio, suggest optimized payment strategies, and notify you of upcoming due dates. You can also simulate repayment plans 
                        and receive expert tips tailored to your financial behavior.
                    </p>
                </div>
                <div className="content">
                    <h2 className="content-header">Vision</h2>
                    <p className="content-body">
                        At FinisCredo, we envision a world where financial stress doesn’t hinder growth. Our mission is to empower every user with smart tools, clear insights, 
                        and the confidence to make informed financial decisions. Whether you're managing a single card or multiple debts, FinisCredo is here to support you every 
                        step of the way—towards stability, clarity, and long-term freedom from debt.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;