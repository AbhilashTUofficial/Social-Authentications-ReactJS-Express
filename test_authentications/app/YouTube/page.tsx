'use client'
import { useEffect } from "react";
import CustomCard from "../Components/Card";
import styles from "../page.module.css";
// import { authenticate, loadClient } from "../Utils/YouTubeAPIFunctions";
import { GoogleApis } from "googleapis";
import { gapi } from "gapi-script";
// const google = require("googleapis")
export default function page() {

    const handleLogin = () => {
        try {

            window.open("http://localhost:5000/auth/youtube", '_blank', 'width=600,height=700');


        } catch (error) {
            console.error('Error initiating Youtube login', error);
        }
    }
    const handleLogout = () => {
        try {

            window.open("http://localhost:5000/logout", '_blank', 'width=600,height=700');


        } catch (error) {
            console.error('Error initiating Youtube logout', error);
        }
    }

    const handleGetUserData = () => {
        try {

            window.open("http://localhost:5000/profile", '_blank', 'width=600,height=700');


        } catch (error) {
            console.error('Error getting user data', error);
        }
    }

    return (
        <main className={styles.main}>
            <CustomCard >

                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleGetUserData}>Get User Data</button>



                </div>
            </CustomCard>
        </main>
    );
}
