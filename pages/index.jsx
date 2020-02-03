import React from 'react'
import { Button } from '@material-ui/core';
import { Head } from 'next/head';

export default () => {
    return (<div>
        <Head><title>Tkt</title></Head>
        <Button variant="contained" href="/api/auth/signin?provider=google">Sign in with Google</Button>
    </div>);
}