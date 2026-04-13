import {expressjwt} from "express-jwt";

function authJwt() {
    const secret = process.env.JWT_SECRET;
    return expressjwt({
        secret,
        algorithms: ['HS256'],
    })
}

export default authJwt;