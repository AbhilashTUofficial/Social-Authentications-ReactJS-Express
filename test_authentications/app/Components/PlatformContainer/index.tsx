import React from 'react'
import styles from "../../page.module.css";
import Link from 'next/link';

const PlatformCont = ({ title, route, status }) => {

    const getStatus = () => {
        return status == "pending" ? styles.pending : status == "ongoing" ? styles.ongoing : styles.completed
    }
    return (

        <div className={`${styles.platformCont} ${getStatus()}`}>
            <Link href={route}>{title}</Link>
        </div>

    )
}

export default PlatformCont