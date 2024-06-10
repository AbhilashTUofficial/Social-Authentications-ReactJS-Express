
import { Card, CardContent } from '@mui/material'
import React, { Children, useEffect, useState } from 'react'
import styles from "../../page.module.css";
import { useAppDispatch } from '@/app/redux/hooks';

export default function CustomCard({ children }) {



    return (
        <Card className={styles.card} sx={{
            minWidth: 300,
            minHeight: 400,
        }}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
