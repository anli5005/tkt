import { useEffect, Fragment, useMemo } from "react";
import Head from "next/head";
import { CssBaseline, ThemeProvider, createMuiTheme, useMediaQuery } from "@material-ui/core";

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;

const systemFont = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
];
const headingFont = ['europa'].concat(systemFont);
const headingTypography = {fontFamily: headingFont.join(",")};
const boldHeadingTypography = {...headingTypography, fontWeight: 700}

export default function App({Component, pageProps}) {
    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
    }, []);

    const prefersDarkMode = !useMediaQuery('(prefers-color-scheme: light)');

    const theme = useMemo(() => createMuiTheme({
        palette: {
            type: prefersDarkMode ? "dark" : "light"
        },
        typography: {
            fontFamily: systemFont.join(","),
            h1: boldHeadingTypography,
            h2: boldHeadingTypography,
            h3: boldHeadingTypography,
            h4: headingTypography,
            h5: headingTypography,
            h6: headingTypography,
            caption: headingTypography,
            overline: headingTypography
        }
    }), [prefersDarkMode]);

    const body = <Component {...pageProps} />;

    return <Fragment>
        <Head>
            <link rel="stylesheet" href="https://use.typekit.net/yal5ubs.css" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {Component.Layout ? <Component.Layout>{body}</Component.Layout> : body}
        </ThemeProvider>
    </Fragment>
}