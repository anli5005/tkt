import withApollo from '../../../../components/apollo';
import Page from '../../../../components/page';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { GET_EVENT } from '../../../../lib/queries';
import { Typography as T, Table, Paper, TableContainer, TableHead, TableRow, TableCell, TableBody, Button } from '@material-ui/core';
import { Fragment } from 'react';
import Link from 'next/link';
import ManageLayout from '../../../../components/manage-layout';

const Event = withApollo(() => {
    const {query: {event: id}} = useRouter();
    const {data, loading, error} = useQuery(GET_EVENT, {variables: {id}})

    const date = {event: {slug: ""}};

    return <Page>
        {data && (data.event ? <Fragment>
            <T variant="h1">{data.event.meta.displayName || data.event.slug}</T>
            <T variant="h3" style={{paddingBottom: "32px"}}>Tickets</T>
            <Link href="/manage/event/[event]/newticket" as={`/manage/event/${id}/newticket`} passHref><Button style={{ marginBottom: "32px" }} variant="contained" color="primary">New Ticket</Button></Link>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.event.tickets.map(row => 
                            <TableRow key={row.id}>
                                <TableCell>{row.meta.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.status === 1 ? <strong>Checked In</strong> : "Checked Out"}</TableCell>
                                <TableCell>
                                    <Link href={`/manage/event/[event]/[ticket]?token=${row.token}`} as={`/manage/event/${data.event.id}/${row.id}?token=${row.token}`} passHref>
                                        <Button variant="outlined" color="primary">Manage Ticket</Button>
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
});

Event.Layout = ManageLayout;

export default Event;