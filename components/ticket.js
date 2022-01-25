import { Typography as T, Card, CardContent, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';

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
    },
    status: {
        marginTop: theme.spacing(2)
    }
}));

export default function Ticket({ticket: {event, meta, email, status}, qrSrc}) {
    const classes = useStyles();

    let statusString = "";
    if (status === 0) {
        statusString = "❌ Checked Out";
    } else if (status === 1) {
        statusString = "✅ Checked In"
    }

    return <Card className={classes.root}>
        <CardHeader className={classes.header} title={event.meta.displayName || event.slug} />
        <CardContent>
            {meta.name && <T className={classes.centered} variant="h4">{meta.name}</T>}
            {email && <T className={classes.centered}>{email}</T>}
            <T className={`${classes.centered} ${classes.status}`}><strong>{statusString}</strong></T>
        </CardContent>
        <CardContent>
            <img className={classes.qrCode} src={qrSrc} />
        </CardContent>
    </Card>
}