'use client'
import CustomCard from "../Components/Card";
import styles from "../page.module.css";
import { useState } from "react";

export default function page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const handleLogin = async () => {
        try {

            window.open("http://localhost:5000/auth/discord", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error initiating Discord login', error);
        }
    };

    const handleLogout = async () => {
        try {

            window.open("http://localhost:5000/logout", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error user logout', error);
        }
    };
    const handleFetchUserData = async () => {
        try {

            window.open("http://localhost:5000/profile", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error get user data', error);
        }
    }
    const handleFetchConnections = async () => {
        try {

            window.open("http://localhost:5000/connections", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error get user connections data', error);
        }
    }


    return (
        <main className={styles.main}>
            <CustomCard >

                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleFetchUserData}>Fetch User Data</button>
                    <button className={styles.btn} onClick={handleFetchConnections}>Fetch Connections</button>


                </div>
            </CustomCard>
        </main>
    );
}
