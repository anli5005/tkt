import verify from '../../../lib/auth/check-auth';

export default async (req, res) => {
    await verify({token: req.cookies.auth});
    res.send("Done");
};