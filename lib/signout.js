import Router from 'next/router';

export default function signOut() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    Router.push("/");
}