const { SchemaLink } = require("apollo-link-schema");
const { makeExecutableSchema } = require("apollo-server");

import typeDefs from "./typedefs.graphql";
import resolvers from "./resolvers";

const schema = makeExecutableSchema({typeDefs, resolvers});

module.exports = function(token) {
    return new SchemaLink({schema, context: {token}});
};