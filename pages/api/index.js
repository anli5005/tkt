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
}});

export const config = {api: {bodyParser: false}};
export default server.createHandler({path: "/api"});