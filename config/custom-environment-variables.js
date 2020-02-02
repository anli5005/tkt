const prefix = process.env.NOW_GITHUB_COMMIT_REF === "master" ? "PROD_" : "";

function prefixed(variable) {
    return prefix + variable;
}

module.exports = {
    "auth": {
        "google": {
            "clientId": "GOOGLE_CLIENT_ID",
            "clientSecret": "GOOGLE_CLIENT_SECRET",
            "redirectUri": "GOOGLE_REDIRECT_URI"
        },
        "jwtSecret": prefixed("JWT_SECRET")
    },
    "databaseUrl": prefixed("DATABASE_URL")
}