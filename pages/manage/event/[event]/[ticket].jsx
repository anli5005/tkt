import withApollo from '../../../../components/apollo';
import Page from "../../../../components/page";
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TICKET_BY_ID } from '../../../../lib/queries';
import { Typography as T, Container, Paper, Button, AccordionSummary, AccordionDetails, Accordion } from '@mui/material';
import Link from 'next/link';
import { Fragment } from 'react';
import Head from 'next/head';
import gql from 'graphql-tag';
import manageLayout from '../../../../components/manage-layout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function ManageTicket() {
    const {query: {event: id, ticket, token}} = useRouter();
    const {data, loading, error} = useQuery(GET_TICKET_BY_ID, {variables: {
        eventID: id,
        ticketID: ticket
    }});

    const [updateStatus] = useMutation(gql`
    mutation UpdateStatus($event: ID!, $ticket: ID!, $status: Int!) {
        updateTicketStatus(event: $event, ticket: $ticket, status: $status) {
            id
            meta
            email
            token
            status
        }
    }
    `);

    let statusString = "";
    if (data && data.event && data.event.ticket) {
        const status = data.event.ticket.status;
        if (status === 0) {
            statusString = "❌ Checked Out";
        } else if (status === 1) {
            statusString = "✅ Checked In"
        } else {
            statusString = `Unknown (${status})`;
        }
    }

    return <Page>
        <Head>
            <title>Manage Ticket</title>
        </Head>
        <Container>
            {data && ((data.event && data.event.ticket) ? <Fragment>
                <Link href="/manage/event/[event]" as={`/manage/event/${id}`} passHref><Button variant="outlined" color="primary">Back to Ticket List</Button></Link>
                <T variant="h3">{data.event.meta.displayName || data.event.slug} - Manage Ticket</T>
                <T>ID: {data.event.ticket.id}</T>
                {(token && token.replace(/ /g, "+") !== data.event.ticket.token) && <Paper variant="outlined">
                    <T variant="h5">Unverified link</T>
                    <T>The link you've used to access this page may be inauthentic. If you're scanning someone in, ask the ticket holder to check their email and obtain the latest version of the ticket.</T>
                </Paper>}
                {data.event.ticket.meta.name && <T><strong>Name:</strong> {data.event.ticket.meta.name}</T>}
                {data.event.ticket.email && <T><strong>Email:</strong> {data.event.ticket.email}</T>}
                <T><strong>Status:</strong> {statusString}</T>
                {Object.keys(data.event.ticket.meta).length > 0 && <Accordion style={{ marginTop: "16px", marginBottom: "16px"}}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel-content" id="panel-header">
                        <T>More Data</T>
                    </AccordionSummary>
                    <AccordionDetails><ul>
                        {Object.keys(data.event.ticket.meta).map(key => <li key={key}><T><strong>{key}</strong>: <code>{data.event.ticket.meta[key]}</code></T></li>)}
                    </ul></AccordionDetails>
                </Accordion>}
                {data.event.ticket.status !== 1 ?
                    <Button variant="contained" color="primary" onClick={() => updateStatus({
                        variables: {event: id, ticket, status: 1}
                    })}>Check In</Button> :
                    <Button variant="outlined" color="primary" onClick={() => updateStatus({
                        variables: {event: id, ticket, status: 0}
                    })}>Check Out</Button>
                }
                <T style={{paddingTop: "32px", paddingBottom: "8px"}}>Ticket URL: https://tkt.anli.dev/ticket/{encodeURIComponent(data.event.slug)}/{encodeURIComponent(data.event.id)}/{encodeURIComponent(data.event.ticket.token)}</T>
                <Button variant="outlined" target="_blank" href={`https://tkt.anli.dev/ticket/${encodeURIComponent(data.event.slug)}/${encodeURIComponent(data.event.id)}/${encodeURIComponent(data.event.ticket.token)}`}>View</Button>
            </Fragment> : <Fragment>
                <T>Unable to retrieve ticket. You may need to sign in.</T>
                <Button variant="outlined" href="/api/auth/signin?provider=google">Sign in with Google</Button>
            </Fragment>)}
            {loading && <T>Loading...</T>}
            {error && <T>Error: {error.message}</T>}
        </Container>
    </Page>
}

const result = withApollo(() => <ManageTicket />);
result.Layout = manageLayout;
export default result;
