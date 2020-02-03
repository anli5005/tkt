import withData from '../lib/next-apollo/withData';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { parse } from 'cookie';

let makeSsrLink;
if (typeof window === "undefined") {
    makeSsrLink = require("../lib/apollo-ssr");
}

export default withData((ctx) => {
    let cookie = (ctx && ctx.req && ctx.req.headers.cookie) || (typeof document !== "undefined" && document.cookie);
    let token;

    if (cookie) {
        try {
            const parsed = parse(cookie);
            token = parsed.auth;
        } catch (_) {}
    }

    const config = {
        link: makeSsrLink ? makeSsrLink(token) : (new ApolloLink((operation, forward) => {
            operation.setContext({headers: {authorization: `Bearer ${token}`}});
            return forward(operation);
        })).concat(new HttpLink({
            credentials: "same-origin",
            uri: "/api"
        }))
    }
    return config;
});