import authenticate from './auth/check-auth';
import { AuthenticationError } from 'apollo-server';

export default {
    Query: {
        async me(_p, _a, context) {
            try {
                await authenticate(context);
            } catch (e) {
                throw new AuthenticationError();
            }

            return context.user;
        }
    }
};