import gql from 'graphql-tag';

export const GET_ME = gql`
{
    me {
        id
        events {
            id
            slug
        }
    }
}
`;

export const GET_EVENT = gql`
query GetEvent($id: ID!) {
    event(id: $id) {
        id
        slug
        tickets {
            id
            meta
            email
            token
            status
        }
    }
}
`;

export const GET_EVENT_USERS = gql`
query GetEventUsers($id: ID!) {
    me {
        id
    }
    event(id: $id) {
        id
        slug
        users {
            id
        }
    }
}
`;

export const GET_TICKET_BY_TOKEN = gql`
query GetTicketByToken($eventID: ID!, $eventSlug: String!, $ticketToken: String!) {
    ticket(eventID: $eventID, eventSlug: $eventSlug, ticketToken: $ticketToken) {
        id
        meta
        email
        token
        status
        event {
            id
            slug
            meta
        }
    }
}
`;