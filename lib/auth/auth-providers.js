const config = require("config");
const google = require("google-auth-library");

module.exports = {
    google() {
        return new google.OAuth2Client(
            config.get("auth.google.clientId"),
            config.get("auth.google.clientSecret"),
            config.get("auth.google.redirectUri")
        );
    }
}