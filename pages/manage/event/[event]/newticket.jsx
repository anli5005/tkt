import withApollo from '../../../../components/apollo';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Page from '../../../../components/page';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Button, Typography as T, TextField, Switch } from '@mui/material';
import { Formik, Form } from 'formik';
import manageLayout from '../../../../components/manage-layout';
import { GET_EVENT } from '../../../../lib/queries';

function NewTicket() {
    const {query: params} = useRouter();
    const { data } = useQuery(GET_EVENT, { variables: { id: params.event } });

    const [addTickets] = useMutation(gql`
    mutation AddTicket($event: ID!, $tickets: [TicketInput!]!, $send: Boolean!) {
        createTickets(event: $event, tickets: $tickets, send: $send) {
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
                console.log(params.event);
                const data = cache.readQuery({ query: GET_EVENT, variables: { id: params.event } });
                if (data) {
                    const { event } = data;
                    cache.writeQuery({
                        query: GET_EVENT,
                        variables: { id: params.event },
                        data: { event: { ...event, tickets: event.tickets.concat(createTickets) } }
                    });
                }
            }
        }
    });

    return <Page>
        <Link href="/manage/event/[event]" as={`/manage/event/${params.event}`} passHref><Button variant="outlined" color="primary">Back to Ticket List</Button></Link>
        <T variant="h1">New Ticket</T>
        <Formik initialValues={{ name: "", email: "", send: false }} validate={values => {
            const errors = {};
            if (values.email) {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = "Must be a valid email address.";
                }
            } else {
                if (values.send) {
                    errors.email = "Email is required.";
                }
            }
            return errors;
        }} onSubmit={async (values, { setSubmitting, setErrors }) => {
            try {
                const ticket = {
                    meta: {name: values.name || undefined},
                    email: values.email || undefined
                };
                const { data: { createTickets } } = await addTickets({ variables: { event: params.event, tickets: [ticket], send: !!values.send } });
                if (!createTickets || createTickets.length === 0) {
                    throw new Error("Ticket is missing");
                }
                Router.push("/manage/event/[event]/[ticket]", `/manage/event/${params.event}/${createTickets[0].id}`)
            } catch (e) {
                console.error(e);
                setErrors({ name: "Failed to add tickets." });
                setSubmitting(false);
            }
        }}>{({ submitForm, isSubmitting, isValid, values, handleChange, handleBlur, touched, errors }) => <Form>
            <div style={{ marginTop: "12px" }}><TextField name="name" type="text" label="Name" value={values.name} onChange={handleChange} onBlur={handleBlur} error={!!(touched.name && errors.name)} helperText={touched.name && errors.name} /></div>
            <div style={{ marginTop: "12px" }}><TextField name="email" type="email" label="Email" value={values.email} onChange={handleChange} onBlur={handleBlur} error={!!(touched.email && errors.email)} helperText={touched.email && errors.email} /></div>
            <div style={{ marginTop: "12px", display: "flex" }}>
                <Switch disabled={!data || !data.event || !data.event.canSendEmails} name="send" value={values.send} onChange={handleChange} onBlur={handleBlur} />
                <div>
                    <div style={{marginTop: "6px"}}>Send an email to {values.email ? <strong>{values.email}</strong> : "the email address"}.</div>
                    {(!data || !data.event || !data.event.canSendEmails) && <T variant="caption">You'll need to request email permissions for your event.</T>}
                </div>
            </div>
            <Button style={{ verticalAlign: "top", marginTop: "12px" }} variant="outlined" disabled={isSubmitting || !isValid} onClick={submitForm}>Add</Button>
        </Form>}</Formik>
    </Page>
}

const result = withApollo(() => <NewTicket />);
result.Layout = manageLayout;
export default result;