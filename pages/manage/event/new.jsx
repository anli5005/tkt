import withApollo from '../../../components/apollo';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Page from '../../../components/page';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Typography as T } from '@material-ui/core';
import { Formik, Form } from 'formik';
import { TextField } from 'formik-material-ui';
import { GET_ME } from '../../../lib/queries';

function NewEvent() {
    const [addEvent] = useMutation(gql`
    mutation AddEvent($slug: String!, $meta: Data!) {
        createEvent(slug: $slug, meta: $meta) {
            id
            slug
            meta
        }
    }
    `, {
        update(cache, {data: {createEvent}}) {
            if (createEvent) {
                const { me } = cache.readQuery({query: GET_ME});
                cache.writeQuery({
                    query: GET_ME,
                    data: {me: {...me, events: me.events.concat([createEvent])}}
                });
            }
        }
    });

    return <Page>
        <T><Link href="/manage"><a>Back</a></Link></T>
        <T variant="h1">New Event</T>
        <Formik initialValues={{slug: ""}} validate={values => {
            const errors = {};
            if (!values.slug) {
                errors.slug = "Required.";
            }
            return errors;
        }} onSubmit={async (values, {setSubmitting, setErrors}) => {
            try {
                const {data: {createEvent}} = await addEvent({variables: {slug: values.slug, meta: {}}});
                if (!createEvent) {
                    throw new Error("Event is missing");
                }
                Router.push("/manage/event/[id]", `/manage/event/${createEvent.id}`)
            } catch (e) {
                console.error(e);
                setErrors({slug: "Failed to add event."});
                setSubmitting(false);
            }
        }}>{({submitForm, isSubmitting, isValid}) => <Form>
            <TextField name="slug" type="text" label="Slug" required />
            <Button variant="outlined" disabled={isSubmitting || !isValid} onClick={submitForm}>Add</Button>
        </Form>}</Formik>
    </Page>
}

export default withApollo(() => <NewEvent />);