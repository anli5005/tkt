import withApollo from '../../../components/apollo';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Page from '../../../components/page';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Typography as T, TextField } from '@mui/material';
import { Formik, Form } from 'formik';
import { GET_ME } from '../../../lib/queries';
import manageLayout from '../../../components/manage-layout';

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
        <T variant="h1">New Event</T>
        <Formik initialValues={{slug: ""}} validate={values => {
            const errors = {};
            if (!values.slug) {
                errors.slug = "Required.";
            } else if (!/^[a-zA-Z0-9-_+]+$/.test(slug)) {
                errors.slug = "Slug contains invalid characters.";
            }
            return errors;
        }} onSubmit={async (values, {setSubmitting, setErrors}) => {
            try {
                const {data: {createEvent}} = await addEvent({variables: {slug: values.slug, meta: {}}});
                if (!createEvent) {
                    throw new Error("Event is missing");
                }
                Router.push("/manage/event/[event]", `/manage/event/${createEvent.id}`)
            } catch (e) {
                console.error(e);
                setErrors({slug: "Failed to add event."});
                setSubmitting(false);
            }
        }}>{({submitForm, isSubmitting, isValid, values, handleChange, touched, errors}) => <Form>
            <TextField style={{ verticalAlign: "top" }} name="slug" type="text" label="Slug" required value={values.slug} onChange={handleChange} error={touched.slug && errors.slug} helperText={touched.slug && errors.slug} />
            <Button style={{verticalAlign: "top", marginLeft: "8px", marginTop: "12px"}} variant="outlined" disabled={isSubmitting || !isValid} onClick={submitForm}>Add</Button>
        </Form>}</Formik>
    </Page>
}

const result = withApollo(() => <NewEvent />);
result.Layout = manageLayout;
export default result;