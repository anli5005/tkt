import { ApolloServer } from 'apollo-server-micro';
import typeDefs from '../../lib/typedefs';
import resolvers from '../../lib/resolvers';

const server = new ApolloServer({typeDefs, resolvers});
export const config = {api: {bodyParser: false}};
export default server.createHandler({path: "/api"});