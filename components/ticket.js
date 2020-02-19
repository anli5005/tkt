import { Typography as T, Card, CardContent, CardHeader, CardMedia, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: 345
    },
    centered: {
        textAlign: "center",
        width: "100%"
    },
    qrCode: {
        margin: `0 auto`,
        display: "block",
        width: 160,
        height: 160,
        borderRadius: "4px"
    },
    header: {
        textAlign: "center",
    }
}));

export default function Ticket({ticket: {event, meta, email}, qrSrc}) {
    const classes = useStyles();

    return <Card className={classes.root}>
        <CardHeader className={classes.header} title={event.meta.displayName || event.slug} />
        <CardContent>
            {meta.name && <T className={classes.centered} variant="h4">{meta.name}</T>}
            {email && <T className={classes.centered}>{email}</T>}
        </CardContent>
        <CardContent>
            <img className={classes.qrCode} src={qrSrc} />
        </CardContent>
    </Card>
}