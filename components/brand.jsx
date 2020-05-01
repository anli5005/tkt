import { Box, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    logo: {
        height: "1.5em",
        display: "inline-block",
        paddingRight: "0.2em",
        verticalAlign: "middle"
    },
    name: {
        fontSize: "1em",
        display: "inline-block",
        verticalAlign: "middle"
    }
});

export default function Brand() {
    const classes = useStyles();

    return <Box className={classes.root}>
        <img className={classes.logo} src="/tkt.png" />
        <Typography variant="h1" className={classes.name}>Tkt</Typography>
    </Box>
}