import withApollo from '../../../../components/apollo';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Page from '../../../../components/page';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Button, Typography as T, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import manageLayout from '../../../../components/manage-layout';
import { GET_EVENT } from '../../../../lib/queries';

function NewTicket() {
    const {query: params} = useRouter();

    const [addTickets] = useMutation(gql`
    mutation AddTicket($event: ID!, $tickets: [TicketInput!]!) {
        createTickets(event: $event, tickets: $tickets) {
            id
            meta
            email
            token
            status
        }
    }
    `, {
        update(cache, { data: { createTickets } }) {
            if (createTickets) {
                const { event } = cache.readQuery({ query: GET_EVENT, variables: { id: params.event } });
                cache.writeQuery({
                    query: GET_EVENT,
                    variables: {id: params.event},
                    data: { event: { ...event, events: events.tickets.concat(createTickets) } }
                });
            }
        }
    });

    return <Page>
        <Link href="/manage/event/[event]" as={`/manage/event/${params.event}`} passHref><Button variant="outlined" color="primary">Back to Ticket List</Button></Link>
        <T variant="h1">New Ticket</T>
        <Formik initialValues={{ slug: "" }} validate={values => {
            const errors = {};
            if (!values.name) {
                errors.name = "Required.";
            }
            return errors;
        }} onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
                const { data: { createTickets } } = await addTickets({ variables: { event: params.event, tickets: [{meta: {name: values.name}}] } });
                if (!createTickets || createTickets.length === 0) {
                    throw new Error("Ticket is missing");
                }
                Router.push("/manage/event/[event]/[ticket]", `/manage/event/${params.event}/${createTickets[0].id}`)
            } catch (e) {
                console.error(e);
                setErrors({ name: "Failed to add tickets." });
                setSubmitting(false);
            }
        }}>{({ submitForm, isSubmitting, isValid, values, handleChange, touched, errors }) => <Form>
            <TextField style={{ verticalAlign: "top" }} name="name" type="text" label="Name" required value={values.name} onChange={handleChange} error={touched.name && errors.name} helperText={touched.name && errors.name} />
            <Button style={{ verticalAlign: "top", marginLeft: "8px", marginTop: "12px" }} variant="outlined" disabled={isSubmitting || !isValid} onClick={submitForm}>Add</Button>
        </Form>}</Formik>
    </Page>
}

const result = withApollo(() => <NewTicket />);
result.Layout = manageLayout;
export default result;