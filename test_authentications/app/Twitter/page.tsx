'use client'
import axios from "axios";
import CustomCard from "../Components/Card";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
export default function page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const [accessToken, setAccessToken] = useState(null);
    const [loginStatus, setLoginStatus] = useState(null);
    const [followers, setFollowers] = useState([]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== "http://localhost:5000") return;

            const { token, status } = event.data;

            if (token) {
                setAccessToken(token);
                setLoginStatus(status);
            }
        };

        window.addEventListener("message", handleMessage);

        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, []);

    const handleLogin = async () => {
        try {
            // const response = await axios.get('http://localhost:5000/login');
            // const authUrl = response.data.url;
            window.open("http://localhost:5000/login", '_blank', 'width=600,height=700');

        } catch (error) {
            console.error('Error initiating Twitter login', error);
        }

    };

    const handleLogout = async () => {

    };

    const handleFetchEmail = async () => {

    };

    const handleFetchFollowers = async () => {
        try {
            const response = await axios.post("http://localhost:5000/followers", {
                accessToken,
            });
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching followers", error);
        }
    };

    const handleFetchPosts = async () => {

    };

    const handleFetchPermissions = async () => {

    };

    return (
        <main className={styles.main}>
            <CustomCard >

                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleFetchFollowers}>Fetch Followers</button>
                    {/* <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleFetchEmail}>Fetch Email</button>
                    
                    <button className={styles.btn} onClick={handleFetchPosts}>Fetch Posts</button>
                    <button className={styles.btn} onClick={handleFetchPermissions}>User Permission</button> */}

                </div>
            </CustomCard>
        </main>
    );
}
