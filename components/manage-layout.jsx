import Brand from './brand';
import { Drawer, Box, makeStyles, Divider, ButtonBase, Typography, Menu, MenuItem, ListItemIcon, List, ListItem, Select, InputLabel, FormControl } from '@material-ui/core';
import { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_ME } from '../lib/queries';
import withApollo from './apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faSignOutAlt, faHome, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useRef } from 'react';
import signOut from '../lib/signout';
import ListItemLink from './list-item-link';
import Router, { useRouter } from 'next/router';

const drawerPersistentWidth = "256px";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    drawer: {
        width: drawerPersistentWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerPersistentWidth,
        height: "100vh",
        display: "flex",
        flexDirection: "column"
    },
    children: {
        flexGrow: 1
    },
    brand: {
        fontSize: "64px",
        padding: theme.spacing(2)
    },
    filler: {
        flexGrow: 1,
        overflow: "auto"
    },
    account: {
        padding: theme.spacing(1),
        display: "flex",
        "&:hover": {
            backgroundColor: theme.palette.action.hover
        },
        "&:focus": {
            backgroundColor: theme.palette.action.selected
        },
        transition: theme.transitions.create("background-color")
    },
    accountDetails: {
        flexGrow: 1,
        textAlign: "left"
    },
    bold: {
        fontWeight: "bold",
        lineHeight: 1
    },
    loadingOpacity: {
        opacity: 0.5
    },
    uuid: {
        fontSize: "50%"
    },
    marginIcon: {
        marginRight: "0.5em"
    },
    eventSelect: {
        "&::before": {
            borderBottomColor: theme.palette.divider
        },
        "& .MuiSelect-select": {
            paddingLeft: "0.5em"
        },
        "& selectEvent": {
            color: theme.palette.text.secondary
        }
    },
    selectEvent: {}
}));

function ListFAIcon(props) {
    return <ListItemIcon><FontAwesomeIcon {...props} /></ListItemIcon>
}

function ManageLayout({children}) {
    const classes = useStyles();
    let data, error;
    let loading = true;
    if (typeof window !== "undefined") {
        const query = useQuery(GET_ME);
        data = query.data;
        error = query.error;
        loading = query.loading;
    }

    const [userMenu, setUserMenu] = useState(false);
    const accountButton = useRef();
    const {query: {event}, route} = useRouter();

    const current = event || (route === "/manage/event/new" ? "new" : "");
    
    return <Box className={classes.root}>
        <Drawer variant="persistent" anchor="left" open={true} className={classes.drawer} classes={{paper: classes.drawerPaper}}>
            <Box className={classes.brand}><Brand /></Box>
            <FormControl>
                <Select className={classes.eventSelect} id="events-menu" value={current} displayEmpty onChange={event => {
                    if (event.target.value === "new") {
                        Router.push("/manage/event/new");
                    } else if (event.target.value.length > 0) {
                        Router.push("/manage/event/[event]", `/manage/event/${event.target.value}`)
                    } else {
                        Router.push("/manage");
                    }
                }}>
                    <MenuItem value=""><FontAwesomeIcon className={classes.marginIcon} icon={faHome} /> Dashboard</MenuItem>
                    {(data && data.me && data.me.events.map(event => {
                        return <MenuItem key={event.id} value={event.id}>
                            {(event.meta && event.meta.displayName) || event.slug}
                        </MenuItem>;
                    })) || <MenuItem disabled value={event}>{loading ? "Loading..." : "Error!"}</MenuItem>}
                    <MenuItem value="new"><FontAwesomeIcon className={classes.marginIcon} icon={faPlusCircle} /> New Event</MenuItem>
                </Select>
            </FormControl>
            <Box className={classes.filler}></Box>
            <Divider />
            <ButtonBase aria-controls="account-menu" aria-haspopup="true" onClick={event => {
                    setUserMenu(accountButton.current || event.target);
                }} className={classes.account} ref={accountButton} focusRipple>
                <Box className={classes.accountDetails}>
                    {
                        data ? (data.me ? <Fragment>
                            <Typography variant="subtitle1" className={classes.bold}>User</Typography>
                            <Typography className={classes.uuid}>{data.me.id}</Typography>
                        </Fragment> : <Typography>Not signed in</Typography>) : (
                            error ?
                            <Typography>Error loading user data</Typography> :
                            <Typography className={classes.loadingOpacity}>Loading...</Typography>
                        )
                    }
                </Box>
                <FontAwesomeIcon icon={faChevronUp} />
            </ButtonBase>
            <Menu id="account-menu" anchorEl={userMenu} keepMounted open={!!userMenu} onClose={() => setUserMenu(null)}>
                <MenuItem onClick={signOut}><ListFAIcon icon={faSignOutAlt} /> Sign out</MenuItem>
            </Menu>
        </Drawer>
        <Box className={classes.children}>{children}</Box>
    </Box>;
}

export default withApollo(ManageLayout);