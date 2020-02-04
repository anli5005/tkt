import withApollo from '../../../../../components/apollo';
import Page from "../../../../../components/page";
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_TICKET_BY_TOKEN } from '../../../../../lib/queries';
import { Typography as T } from '@material-ui/core';
import Link from 'next/link';
import { Fragment } from 'react';

function Ticket({qrCode}) {
    const {query: {slug, id, token}} = useRouter();
    const {data, loading, error} = useQuery(GET_TICKET_BY_TOKEN, {variables: {
        eventID: id,
        eventSlug: slug,
        ticketToken: token
    }});

    return <Page>
        <T><Link href="/manage/event/[id]" as={`/manage/event/${data.ticket.event.id}`}><a>{data.ticket.event.slug}</a></Link></T>
        {data && (data.ticket ? <Fragment>
            <T variant="h1">Ticket {data.ticket.id}</T>
            <T><strong>Name:</strong> {data.ticket.meta.name}</T>
            <T><strong>Email:</strong> {data.ticket.email}</T>
        </Fragment> : <T>Ticket not found.</T>)}
        {loading && <T>Loading...</T>}
        {error && <T>Error: {error.message}</T>}
    </Page>
}

export default withApollo(Ticket)