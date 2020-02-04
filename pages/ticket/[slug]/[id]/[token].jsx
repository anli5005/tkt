import withApollo from '../../../../components/apollo';
import Page from "../../../../components/page";
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_TICKET_BY_TOKEN } from '../../../../lib/queries';
import { Typography as T } from '@material-ui/core';
import Link from 'next/link';
import { Fragment } from 'react';
import qrFactory from 'qrcode-generator';

function Ticket({qrCode}) {
    const {query: {slug, id, token}} = useRouter();
    const {data, loading, error} = useQuery(GET_TICKET_BY_TOKEN, {variables: {
        eventID: id,
        eventSlug: slug,
        ticketToken: token
    }});

    return <Page>
        {data && (data.ticket ? <Fragment>
            <T variant="h1">{data.ticket.event.slug}</T>
            <T><strong>Name:</strong> {data.ticket.meta.name}</T>
            <T><strong>Email:</strong> {data.ticket.email}</T>
            <img src={qrCode} />
        </Fragment> : <T>Ticket not found.</T>)}
        {loading && <T>Loading...</T>}
        {error && <T>Error: {error.message}</T>}
        <T><Link href="/"><a>tkt.anli.dev</a></Link></T>
    </Page>
}

Ticket.getInitialProps = ({query: {slug, id, token}}) => {
    const qr = qrFactory(0, "M");
    qr.addData(`https://tkt.anli.dev/manage/ticket/${slug}/${id}/${token}`);
    qr.make();
    return {qrCode: qr.createDataURL()};
};

export default withApollo(Ticket)