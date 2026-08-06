import jwt from "jsonwebtoken";
import config from "../config/config.js";
import ApiError from "../utils/ApiError.js";

const auth = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
     
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(new ApiError(401, "Invalid token"));
        }

        const token = authHeader.split(" ")[1];

        const verifiedUser = jwt.verify(token, config.jwtAccess);

        req.user = verifiedUser;

        return next();

    } catch(err) {
        return next(new ApiError(401, "Invalid token"));
    }
}

export default auth;