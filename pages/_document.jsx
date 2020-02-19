import Document from 'next/document';
import { ServerStyleSheets } from '@material-ui/core';
import { Children } from 'react';

export default class TktDocument extends Document {
    static async getInitialProps(ctx) {
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () => originalRenderPage({
            enhanceApp: App => props => sheets.collect(<App {...props} />)
        });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: [...Children.toArray(initialProps.styles), sheets.getStyleElement()]
        };
    }
}