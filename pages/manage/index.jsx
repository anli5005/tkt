import withApollo from '../../components/apollo';
import { useQuery } from '@apollo/react-hooks';
import Page from '../../components/page';
import { Button, Typography as T, List, ListItem } from '@material-ui/core';
import signOut from '../../lib/signout';
import Link from 'next/link';
import { GET_ME } from '../../lib/queries';

function Manage() {
    const { data, loading, error } = useQuery(GET_ME);
    
    return <Page>
        <T variant="h1">Tkt</T>

        <T variant="h2">User</T>
        {data && (data.me ? (<T>ID: <code>{data.me.id}</code></T>) : (<T>Not signed in</T>))}
        {loading && <T>Loading...</T>}
        {error && <T>Error!</T>}
        <Button onClick={signOut}>Sign out</Button>

        <T variant="h2">Events</T>
        <List>
            {data && data.me && data.me.events.map(event => 
                <Link key={event.id} href="/manage/event/[id]" as={`/manage/event/${event.id}`} passHref>
                    <ListItem button component="a">{event.slug}</ListItem>
                </Link>
            )}
            {loading && <ListItem>Loading...</ListItem>}
            {error && <ListItem>Error!</ListItem>}
            <Link passHref href="/manage/event/new"><ListItem button component="a">New Event</ListItem></Link>
        </List>
    </Page>
}

export default withApollo(() => <Manage />);