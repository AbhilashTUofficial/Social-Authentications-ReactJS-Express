'use client'

import React, { useState } from 'react'
import CustomCard from '../Components/Card';

import styles from "../page.module.css";
import axios from 'axios';


export default function page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const handleLogin = async () => {
        try {

            window.open("http://localhost:5000/auth/google", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error initiating Google login', error);
        }
    };


    const handleLogout = async () => {
        try {

            var response = await axios.get('http://localhost:5000/logout');

        } catch (error) {
            console.error('logout error', error);
        }
    };

    const handleFetctUserData = async () => {
        try {

            var response = await axios.get('http://localhost:5000/profile');

        } catch (error) {
            console.error('Fetching user data error', error);
        }
    };

    return (
        <main className={styles.main}>
            <CustomCard >
                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleFetctUserData}>Fetch User Data</button>
                </div>
            </CustomCard>
        </main>
    );
}





