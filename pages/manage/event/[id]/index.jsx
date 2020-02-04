import withApollo from '../../../../components/apollo';
import Page from '../../../../components/page';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_EVENT } from '../../../../lib/queries';
import { Typography as T } from '@material-ui/core';
import { Fragment } from 'react';
import Link from 'next/link';

function Event() {
    const {query: {id}} = useRouter();
    const {data, loading, error} = useQuery(GET_EVENT, {variables: {id}})

    return <Page>
        <T><Link href="/manage"><a>Back</a></Link></T>
        {data && (data.event ? <Fragment>
            <T variant="h1">{data.event.slug}</T>
            <T><Link href="/manage/event/[id]/users" as={`/manage/event/${id}/users`}><a>Manage Users</a></Link></T>
        </Fragment> : <T>Event not found.</T>)}
        {loading && <T>Loading...</T>}
        {error && <T>Error: {error.message}</T>}
    </Page>
}

export default withApollo(() => <Event />);