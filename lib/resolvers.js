import authenticate from './auth/check-auth';
import { AuthenticationError, UserInputError } from 'apollo-server';
import db from '../db/db';

function processTicket(ticket) {
    if (ticket.token) {
        ticket.token = ticket.token.toString("base64").replace(/\//g, "-");
    }
}

export default {
    Query: {
        async me(_p, _a, context) {
            await authenticate(context);
            return context.user;
        },
        async event(_p, {id}, context) {
            await authenticate(context);
            if (context.user) {
                const { rows } = await db.query(
                    `SELECT events.id, events.meta, events.slug FROM event_users
                    INNER JOIN events ON event_users.event_id = events.id
                    WHERE event_users.user_id = $1 AND event_users.event_id = $2`,
                    [context.user.id, id]
                );
                if (rows.length === 1) {
                    return rows[0];
                }
            }
        },
        async ticket(_p, {eventID, eventSlug, ticketToken}, _c) {
            const { rows } = await db.query(
                `SELECT tickets.id, tickets.meta, tickets.email, tickets.token, tickets.status FROM tickets
                INNER JOIN events on tickets.event_id = events.id
                WHERE tickets.event_id = $1 AND tickets.token = decode($2, 'base64') AND events.slug = $3`,
                [eventID, ticketToken.replace(/-/g, "/"), eventSlug]
            );

            if (rows.length === 1) {
                const [ticket] = rows;
                processTicket(ticket);
                return ticket;
            }
        }
    },
    User: {
        async events(user, _a, context) {
            await authenticate(context);

            if (context.user && context.user.id === user.id) {
                const { rows } = await db.query(
                    `SELECT events.id, events.meta, events.slug FROM event_users
                    INNER JOIN events ON event_users.event_id = events.id
                    WHERE event_users.user_id = $1`,
                    [context.user.id]
                );
                return rows;
            } else {
                throw new AuthenticationError();
            }
        }
    },
    FullEvent: {
        users() { return [] },
        async tickets(event, _a, context) {
            await authenticate(context);

            const { rows } = await db.query(
                `SELECT tickets.id, tickets.meta, tickets.email, tickets.token, tickets.status FROM event_users
                INNER JOIN tickets ON event_users.event_id = tickets.event_id
                WHERE event_users.user_id = $1 AND event_users.event_id = $2;`,
                [context.user.id, event.id]
            );

            rows.forEach(processTicket);

            return rows;
        }
    },
    Ticket: {
        async event(ticket, _a, _c) {
            return (await db.query(
                `SELECT events.id, events.meta, events.slug FROM tickets
                INNER JOIN events ON tickets.event_id = events.id
                WHERE tickets.id = $1`,
                [ticket.id]
            )).rows[0];
        }
    },
    Mutation: {
        async createEvent(_p, {slug, meta}, context) {
            await authenticate(context);
            if (context.user) {
                const client = await db.connect();
                try {
                    await client.query("BEGIN");

                    const { rows } = await client.query(
                        `INSERT INTO events (meta, slug) VALUES ($1, $2) RETURNING id, meta, slug;`,
                        [meta, slug]
                    );

                    if (rows.length === 1) {
                        const event = rows[0];
                        await client.query(
                            `INSERT INTO event_users (event_id, user_id, date_added) VALUES ($1, $2, now())`,
                            [event.id, context.user.id]
                        );
                        await client.query("COMMIT");
                        return event;
                    } else {
                        throw new Error("rows.length = " + rows.length);
                    }
                } catch (e) {
                    await client.query("ROLLBACK");
                    throw e;
                } finally {
                    client.release();
                }
            } else {
                throw new AuthenticationError();
            }
        },
        async createTickets(_p, {event, tickets}, context) {
            tickets.forEach(ticket => {
                if (!ticket) {
                    throw new UserInputError();
                }

                if (!ticket.meta) {
                    throw new UserInputError();
                }

                if (ticket.email && typeof ticket.email !== "string") {
                    throw new UserInputError();
                }

                if (ticket.status && typeof ticket.status !== "number") {
                    throw new UserInputError();
                }
            });

            await authenticate(context);
            if (!context.user) {
                throw new AuthenticationError();
            }

            const { rowCount } = await db.query(`SELECT * FROM event_users WHERE user_id = $1 AND event_id = $2`, [
                context.user.id,
                event
            ]);

            if (rowCount !== 1) {
                return;
            }

            const queryParams = tickets.map((_t, i) => `($${i * 3 + 2},$${i * 3 + 3},$${i * 3 + 4}, $1, gen_random_bytes(18))`).join(",");
            const query = `INSERT INTO tickets (meta, email, status, event_id, token) VALUES ${queryParams} RETURNING id, meta, email, token, status;`;
            const { rows } = await db.query(
                query,
                [event].concat(tickets.flatMap(ticket => [ticket.meta, ticket.email, ticket.status || 0]))
            );
            rows.forEach(processTicket);
            return rows;
        }
    }
};