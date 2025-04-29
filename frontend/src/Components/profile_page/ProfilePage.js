import React, {useState, useEffect} from 'react';
import './ProfilePage.css';
import { Link } from 'react-router-dom';
import { FaUser, FaMobile } from 'react-icons/fa';
import { SiMaildotru } from "react-icons/si"; 
import axios from 'axios';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        mobileNo: "",
        aadhaarNo: "",
        panCard: "",
        address1: "",
        address2: "",
        address3: "",
        pincode: "",
        district: "",
        state: "",
        country: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId){
                    console.log("User ID not found in localStrorage");
                    return;
                }
                
                const response = await axios.get(`/api/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle update
    const handleUpdate = async () => {
        try{
            const userId = localStorage.getItem('userId');
            await axios.put(`api/user/${userId}`, userData);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return(
        <div>
            <nav className="navbar-section">
                <div className="brand">
                    <img src="/logo1.png" alt="Logo" className="logo" />
                    <h2 className='brandName'>FinisCredo</h2>
                </div>
                <div className="navlinks" style={ {marginLeft: '700px'} }>
                    <Link to="/dashboard" >Dashboard</Link>
                </div>
                <div className="navlinks">
                    <Link to="/profile" id="active">My Profile</Link>
                </div>
            </nav>
            <div className="body-container">
                <form className='profile-form'>
                    <h1 style={{padding: '20px'}}>Personal Information</h1>
                    {!isEditing ? (
                        <button type="button" className='edit-button' onClick={() => setIsEditing(true)}>Edit</button>
                    ) : (
                        <button type="button" className='update-button' onClick={handleUpdate}>Update</button>
                    )}
                    
                    <div className='personal-info'>
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="username">Name:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="username" value={userData.username} onChange={handleChange} disabled={!isEditing} />
                                <span><FaUser className='icon'/></span>                           
                            </div>
                        </div>
                    
                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="email">Email:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="email" value={userData.email} onChange={handleChange} disabled/>
                                <span><SiMaildotru className='icon'/></span>
                            </div>
                        </div>
                    
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="mobileNo">Mobile No:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="mobileNo" value={userData.mobileNo} onChange={handleChange} disabled={!isEditing}/>
                                <span><FaMobile className='icon'/></span>                           
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="aadhaarNo">Aadhaar No:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="aadhaarNo" value={userData.aadhaarNo} onChange={handleChange} disabled={!isEditing} /> 
                                <span><FaUser className='icon'/></span>                           
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="panCard">PAN Card No:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="panCard" value={userData.panCard} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaUser className='icon'/></span>                           
                            </div>
                        </div>

                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="address1">Flat/House No & Name:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="address1" value={userData.address1} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaMobile className='icon'/></span>                           
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="address2">Street/Lane:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="address2" value={userData.address2} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaUser className='icon'/></span>                           
                            </div>
                        </div>

                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="address3">Address Line 3:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="address3" value={userData.address3} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaMobile className='icon'/></span>                           
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="pincode">Pincode:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="pincode" value={userData.pincode} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaUser className='icon'/></span>
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="district">District:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="district" value={userData.district} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaMobile className='icon'/></span>                           
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '20px'}}>
                            <div className='label-box'>
                                <label htmlFor="state">State:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="state" value={userData.state} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaUser className='icon'/></span>
                            </div>
                        </div>
                        
                        <div style={{marginLeft: '200px'}}>
                            <div className='label-box'>
                                <label htmlFor="country">Country:</label>
                            </div>
                            <div className="input-box">
                                <input type="text" name="country" value={userData.country} disabled={!isEditing} onChange={handleChange} /> 
                                <span><FaUser className='icon'/></span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div> 
    );
};

export default ProfilePage;