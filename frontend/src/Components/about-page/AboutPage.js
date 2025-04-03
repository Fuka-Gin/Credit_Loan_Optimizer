import React from "react";
import './AboutPage.css';
import { Link } from "react-router-dom";

const AboutPage = () => {
    return(
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <h2>FinisCredo</h2>
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
            <h2 id="header">About us</h2>
            <div className="content-section">
                <div className="content">
                    <h2 className="content-header">What is Netikos Dimoprasía?</h2>
                    <p className="content-body">Netikos Dimoprasía is a platform that provides various auction services such as Forward Auction, Reverse Auction, Dutch Auction, Japanese Auction, Yankee Auction, E-Tender, IT-Services, SCM, Logistic Management, Inventory Management, etc. It is a platform where buyers and sellers can interact with each other and make deals.</p>
                </div>
                <div className="content">
                    <h2 className="content-header">Can Netikos Dimoprasía be trusted?</h2>
                    <p className="content-body">Netikos Dimoprasía provides a platform where buyers and sellers can interact with each other and make deals. It provides various auction services such as Forward Auction, Reverse Auction, Dutch Auction, Japanese Auction, Yankee Auction, E-Tender, IT-Services, SCM, Logistic Management, Inventory Management, etc. It is a platform where buyers and sellers can interact with each other and make deals.</p>
                </div>
                <div className="content">
                    <h2 className="content-header">How to use Netikos Dimoprasía?</h2>
                    <p className="content-body">Netikos Dimoprasía is a platform that provides various auction services such as Forward Auction, Reverse Auction, Dutch Auction, Japanese Auction, Yankee Auction, E-Tender, IT-Services, SCM, Logistic Management, Inventory Management, etc. It is a platform where buyers and sellers can interact with each other and make deals.</p>
                </div>
                <div className="content">
                    <h2 className="content-header">Vision</h2>
                    <p className="content-body">After Establishing A Strong Foot At National Front, ‘We Aim To Build A Global Network; Thus, Providing A Reliable Online Platform To Auctioneers And Bidders From All Across The World. On Establishing A Secure Base, We Ensure To Manage All Sorts Auctioning Activities Be It Small Or Major. Our Main Objective ls Bringing Ease To Our Clients Such That Auctioning ls Not A Burden For Any Business Person And Bidding Is Not A Matter Of Risk For Anyone Across The Globe.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;