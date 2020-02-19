import withApollo from '../../../../components/apollo';
import Page from "../../../../components/page";
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_TICKET_BY_TOKEN } from '../../../../lib/queries';
import { Typography as T, makeStyles } from '@material-ui/core';
import Link from 'next/link';
import Ticket from '../../../../components/ticket';
import qrFactory from 'qrcode-generator';
import Head from 'next/head';

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        minHeight: "100vh",
        padding: theme.spacing(3),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    },
    tktLink: {
        marginTop: theme.spacing(3),
        fontFamily: "europa",
        '& a:link, & a:visited': {
            color: theme.palette.text.secondary,
            textDecoration: 'none'
        },
        '& a:hover': {
            color: theme.palette.text.primary,
            textDecoration: 'underline'
        }
    }
}));

function TicketPage({qrCode}) {
    const classes = useStyles();

    const {query: {slug, id, token}} = useRouter();
    const {data, loading, error} = useQuery(GET_TICKET_BY_TOKEN, {variables: {
        eventID: id,
        eventSlug: slug,
        ticketToken: token
    }});

    return <Page>
        <Head><title>Tkt - Ticket</title></Head>
        <div className={classes.root}>
            {data && (data.ticket ? <Ticket ticket={data.ticket} qrSrc={qrCode} /> : <T>Ticket not found.</T>)}
            {loading && <T>Loading...</T>}
            {error && <T>Error: {error.message}</T>}
            <T className={classes.tktLink}><Link href="/"><a>tkt.anli.dev</a></Link></T>
        </div>
    </Page>
}

TicketPage.getInitialProps = ({query: {slug, id, token}}) => {
    const qr = qrFactory(0, "M");
    qr.addData(`https://tkt.anli.dev/manage/ticket/${slug}/${id}/${token}`);
    qr.make();
    return {qrCode: qr.createDataURL(4)};
};

export default withApollo(TicketPage)