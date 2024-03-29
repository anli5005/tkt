import Page from '../../components/page';
import { Typography as T, Box } from '@mui/material';
import ManageLayout from '../../components/manage-layout';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    box: {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    tktFlair: {
        opacity: 0.3,
        margin: "0"
    }
});

const Manage = () => {
    const classes = useStyles();

    return <Page>
        <Box className={classes.box}>
            <T variant="h1" className={classes.tktFlair}>Tkt</T>
        </Box>
    </Page>   
};

Manage.Layout = ManageLayout;

export default Manage;