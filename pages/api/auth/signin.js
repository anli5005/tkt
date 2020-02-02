import { google } from '../../../lib/auth/auth-providers';
import config from 'config';

export default (req, res) => {
    const provider = req.query.provider;
    console.log(config.get("auth.tokenMaxAge"));
    console.log(config.get("databaseUrl"));
    console.log(config.get("auth.google.clientId"));
    if (provider === "google") {
        res.status(303);
        res.setHeader("Location", google().generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile"
        }));
        res.end();
    } else {
        res.status(400).json({error: "Provider not supported"});
    }
};