const { SchemaLink } = require("@apollo/client/link/schema");
const { makeExecutableSchema } = require("@graphql-tools/schema");

import typeDefs from "./typedefs.graphql";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({typeDefs, resolvers});

module.exports = function(token) {
    return new SchemaLink({schema, context: {token}});
};