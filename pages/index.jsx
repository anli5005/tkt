import React from 'react'
import { Button } from '@material-ui/core';
import Head from 'next/head';

export default () => {
    return (<div style={{padding: "64px"}}>
        <Head><title>Tkt</title></Head>
        <h1 style={{fontSize: "64px", fontFamily: "europa, sans-serif"}}>Tkt</h1>
        <Button variant="outlined" href="/api/auth/signin?provider=google">Sign in with Google</Button>
    </div>);
}