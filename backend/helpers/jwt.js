import {expressjwt} from "express-jwt";

function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            `${api}/users/login`,
            `${api}/users/register`,
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        ]
    })
}


async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) return done(null, true);

    done();
}
export default authJwt;