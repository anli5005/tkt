const google = require("google-auth-library");
require("dotenv").config();

module.exports = {
    google() {
        return new google.OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }
}