import withApollo from '../../../../components/apollo';
import Page from '../../../../components/page';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_EVENT } from '../../../../lib/queries';
import { Typography as T, Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { Fragment } from 'react';
import Link from 'next/link';

function Event() {
    const {query: {id}} = useRouter();
    const {data, loading, error} = useQuery(GET_EVENT, {variables: {id}})

    const date = {event: {slug: ""}};

    return <Page>
        <T><Link href="/manage"><a>Back</a></Link></T>
        {data && (data.event ? <Fragment>
            <T variant="h1">{date.event.slug}</T>
            <T><Link href="/manage/event/[id]/users" as={`/manage/event/${id}/users`}><a>Manage Users</a></Link></T>

            <T variant="h2">Tickets</T>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ticket</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.event.tickets.map(row => 
                            <TableRow key={row.id}>
                                <TableCell>{row.meta.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    <Link href="/ticket/[slug]/[id]/[token]" as={`/ticket/${data.event.slug}/${data.event.id}/${row.token}`}>
                                        <a>View Ticket</a>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Fragment> : <T>Event not found.</T>)}
        {loading && <T>Loading...</T>}
        {error && <T>Error: {error.message}</T>}
    </Page>
}

export default withApollo(() => <Event />);