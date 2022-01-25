import { ApolloServer } from 'apollo-server-micro';
import typeDefs from '../../lib/typedefs.graphql';
import resolvers from '../../lib/resolvers';

const server = new ApolloServer({typeDefs, resolvers, context({req}) {
    let context = {};
    const prefix = "Bearer ";
    if (req.headers.authorization && req.headers.authorization.startsWith(prefix)) {
        context.token = req.headers.authorization.slice(prefix.length);
    }
    return context;
}, uploads: false});

const start = server.start();

export const config = {api: {bodyParser: false}};
export default async (req, res) => {
    await start;
    return server.createHandler({ path: "/api" })(req, res);
}