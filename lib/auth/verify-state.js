import { parse } from 'cookie';

module.exports = (req, res) => {
    if (req.headers.cookie) {
        const {state} = parse(req.headers.cookie);
        if (state === req.query.state) {
            const parts = state.split(".");
            let redirect = "/manage";
            if (parts.length > 1) {
                redirect = `/invite/${parts[1].replace(/ /g, "+")}`;
            }

            return {valid: true, redirect};
        }
    }

    return {valid: false};
};