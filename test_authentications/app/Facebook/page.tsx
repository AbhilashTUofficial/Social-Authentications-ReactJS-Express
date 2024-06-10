'use client'
import CustomCard from "../Components/Card";
import styles from "../page.module.css";
// import FacebookSDKLoader, { checkPermission, fetchUserEmail, fetchUserFriends, fetchUserPosts } from "../Utils/FacebookSDKFunctions";
import { useState } from "react";
import FacebookSDKLoader, { loginWithFacebook, logoutFromFacebook } from "../Utils/FacebookSDKFunctions";

export default function page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [picture, setPicture] = useState('');

    const handleLogin = async () => {
        loginWithFacebook();
        // try {

        //     window.open("https://localhost:5000/login", '_blank', 'width=600,height=700');

        // } catch (error) {
        //     console.error('Error initiating Facebook login', error);
        // }
    };

    const handleLogout = async () => {
        // try {
        //     await logoutFromFacebook();
        //     console.log("Logged out successfully");
        //     // Reset state variables as needed
        //     setIsLoggedIn(false);
        //     setUserID('');
        //     setName('');
        //     setEmail('');
        //     setPicture('');
        // } catch (error) {
        //     console.error("Logout error:", error);
        // }
    };

    const handleFetchEmail = async () => {
        // try {
        //     const userEmail = await fetchUserEmail();
        //     console.log("User email:", userEmail);
        //     setEmail(userEmail);
        // } catch (error) {
        //     console.error("Failed to fetch user email:", error);
        // }
    };

    const handleFetchFriends = async () => {
        // try {
        //     const userFriends = await fetchUserFriends();
        //     console.log("User friends:", userFriends);
        // } catch (error) {
        //     console.error("Failed to fetch user friends:", error);
        // }
    };

    const handleFetchPosts = async () => {
        // try {
        //     const userPosts = await fetchUserPosts();
        //     console.log("User Posts:", userPosts);
        // } catch (error) {
        //     console.error("Failed to fetch user posts:", error);
        // }
    };

    const handleFetchPermissions = async () => {
        // try {
        //     const userPermission = await checkPermission();
        //     console.log("User Permissions:", userPermission);
        // } catch (error) {
        //     console.error("Failed to fetch user permissions:", error);
        // }
    };

    return (
        <main className={styles.main}>
            <FacebookSDKLoader />
            <CustomCard >

                <div className={styles.btnCont}>
                    <button className={styles.btn} onClick={handleLogin}>Login</button>
                    <button className={styles.btn} onClick={handleLogout}>Logout</button>
                    <button className={styles.btn} onClick={handleFetchEmail}>Fetch Email</button>
                    <button className={styles.btn} onClick={handleFetchFriends}>Fetch Friends</button>
                    <button className={styles.btn} onClick={handleFetchPosts}>Fetch Posts</button>
                    <button className={styles.btn} onClick={handleFetchPermissions}>User Permission</button>

                </div>
            </CustomCard>
        </main>
    );
}
