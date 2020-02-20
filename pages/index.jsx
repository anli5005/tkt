import React from 'react'
import { Button } from '@material-ui/core';
import Head from 'next/head';

export default () => {
    return (<div>
        <Head><title>Tkt</title></Head>
        <h1>Tkt</h1>
        <p>A ticketing platform. Still very much WIP.</p>
        <Button variant="outlined" href="/api/auth/signin?provider=google">Sign in with Google</Button>
    </div>);
}