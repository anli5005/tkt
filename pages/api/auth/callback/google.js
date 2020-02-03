import { google } from '../../../../lib/auth/auth-providers';
import authenticateUser from '../../../../lib/auth/authenticate-user';

export default async (req, res) => {
    if (!req.query.code) {
        res.status(400).json({error: "missing_code"});
    }

    const client = google(req);
    let payload;
    try {
        const response = await client.getToken(req.query.code);
        payload = (await client.verifyIdToken({idToken: response.tokens.id_token})).payload;
        if (!payload.sub) {
            throw new Error("Missing sub claim")
        }
    } catch (e) {
        if (e.code === "400") {
            res.status(400).json({error: "bad_code"});
        } else {
            res.status(500).json({error: "upstream_error"});
            console.log(e);
        }
        return;
    }

    return await authenticateUser({authType: "google", subject: payload.sub}, res);
};