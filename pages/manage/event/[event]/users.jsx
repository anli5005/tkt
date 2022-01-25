import withApollo from '../../../../components/apollo';
import Page from '../../../../components/page';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Typography as T } from '@mui/material';
import { Fragment } from 'react';
import { GET_EVENT_USERS } from '../../../../lib/queries';
import Link from 'next/link';

function Event() {
    const {query: {event: id}} = useRouter();
    const {data, loading, error} = useQuery(GET_EVENT_USERS, {variables: {id}})

    return <Page>
        <T><Link href="/manage/event/[id]" as={`/manage/event/${id}`}><a>Back</a></Link></T>
        {data && (data.event ? <Fragment>
            <T variant="h1">{data.event.slug}</T>
        </Fragment> : <T>Event not found.</T>)}
        {loading && <T>Loading...</T>}
        {error && <T>Error: {error.message}</T>}
    </Page>
}

export default withApollo(() => <Event />);