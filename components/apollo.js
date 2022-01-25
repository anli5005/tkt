import withApollo from 'next-with-apollo';
import { ApolloLink } from '@apollo/client/link/core';
import { HttpLink } from '@apollo/client/link/http';
import { parse } from 'cookie';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

let makeSsrLink;
if (typeof window === "undefined") {
    makeSsrLink = require("../lib/apollo-ssr");
}

export default withApollo((ctx) => {
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
        })),
        cache: new InMemoryCache().restore(ctx.initialState)
    }
    return new ApolloClient(config);
}, {
    render({Page, props}) {
        return <ApolloProvider client={props.apollo}>
            <Page {...props} />
        </ApolloProvider>;
    }
});