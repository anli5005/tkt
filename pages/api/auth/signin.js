import { google } from '../../../lib/auth/auth-providers';
const generateState = require('../../../lib/auth/generate-state');

export default async (req, res) => {
    const provider = req.query.provider;
    if (provider === "google") {
        res.status(303);
        res.setHeader("Location", google(req).generateAuthUrl({
            access_type: "offline",
            scope: "https://www.googleapis.com/auth/userinfo.profile",
            state: await generateState(req, res)
        }));
        res.end();
    } else {
        res.status(400).json({error: "Provider not supported"});
    }
};