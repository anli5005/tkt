import authenticate from './auth/check-auth';
import { AuthenticationError } from 'apollo-server';
import db from '../db/db';

export default {
    Query: {
        async me(_p, _a, context) {
            await authenticate(context);
            console.log(Object.keys(context));
            return context.user;
        },
        async event(_p, {id}, context) {
            console.log("Running resolver...");
            await authenticate(context);
            console.log(Object.keys(context));
            if (context.user) {
                const { rows } = await db.query(
                    `SELECT events.id, events.meta, events.slug FROM event_users
                    INNER JOIN events ON event_users.event_id = events.id
                    WHERE event_users.user_id = $1 AND event_users.event_id = $2`,
                    [context.user.id, id]
                );
                console.log(rows);
                if (rows.length === 1) {
                    return rows[0];
                }
            }
        }
    },
    User: {
        async events(user, _a, context) {
            await authenticate(context);

            if (context.user && context.user.id === user.id) {
                const { rows } = (await db.query(
                    `SELECT events.id, events.meta, events.slug FROM event_users
                    INNER JOIN events ON event_users.event_id = events.id
                    WHERE event_users.user_id = $1`,
                    [context.user.id]
                ));
                return rows;
            } else {
                throw new AuthenticationError();
            }
        }
    },
    FullEvent: {
        users() { return [] },
        tickets() { return [] }
    },
    Mutation: {
        async createEvent(_p, {slug, meta}, context) {
            await authenticate(context);
            if (context.user) {
                const { rows } = await db.query(
                    `INSERT INTO events (meta, slug) VALUES ($1, $2) RETURNING id, meta, slug;`,
                    [meta, slug]
                );
                if (rows.length === 1) {
                    const event = rows[0];
                    await db.query(
                        `INSERT INTO event_users (event_id, user_id, date_added) VALUES ($1, $2, now())`,
                        [event.id, context.user.id]
                    );
                    return event;
                }
            } else {
                throw new AuthenticationError();
            }
        }
    }
};