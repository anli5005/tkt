import React, { Fragment } from 'react';
import withApollo from '../../components/apollo';
import Router, { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_INVITE } from '../../lib/queries';
import { Typography, Button } from '@material-ui/core';
import gql from 'graphql-tag';
import Link from 'next/link';
import Page from '../../components/page';

export default withApollo(() => {
    const {query: {invite}} = useRouter();
    const {data, loading, error} = useQuery(GET_INVITE, {variables: {invite}});
    const [joinEvent] = useMutation(gql`
    mutation JoinEvent($invite: String!) {
        joinEvent(invite: $invite) {
            id
            slug
            meta
        }
    }
    `, {
        update(cache, {data: {joinEvent}}) {
            if (joinEvent) {
                const { me } = cache.readQuery({query: GET_ME});
                cache.writeQuery({
                    query: GET_ME,
                    data: {me: {...me, events: me.events.concat([joinEvent])}}
                });
            }
        }
    });

    const isInEvent = data && data.me && data.invite.id && data.me.events.find(event => event.id === data.invite.id);

    if (data) {
        if (data.invite) {
            return <Page>
                <Typography variant="h3">You've been invited to manage {data.invite.meta.displayName || data.invite.slug}.</Typography>
                {isInEvent && <Fragment>
                    <Typography>You're already managing this event.</Typography>
                    <Link href="/manage/event/[id]" as={`/manage/event/${data.invite.id}`} passHref><Button variant="outlined">Go to Event</Button></Link>
                </Fragment>}
                {(data.me && !isInEvent) && <Button variant="contained" onClick={async () => {
                    await joinEvent({variables: {invite}});
                    Router.push("/manage/event/[id]", `/manage/event/${data.invite.id}`)
                }}>Accept</Button>}
                {!data.me && <Link href={`/api/auth/signin?provider=google&invite=${invite}`} passHref><Button variant="outlined">Sign in with Google to accept</Button></Link>}
            </Page>;
        } else {
            return <Page><Typography>Unable to find invite.</Typography></Page>
        }
    } else if (loading) {
        return <Page><Typography>Loading...</Typography></Page>;
    } else {
        return <Page><Typography>Error!</Typography></Page>;
    }
});