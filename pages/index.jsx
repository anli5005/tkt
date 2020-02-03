import React from 'react'
import { Button } from '@material-ui/core';

export default () => {
  return (<Button variant="contained" href="/api/auth/signin?provider=google">Sign in with Google</Button>);
}