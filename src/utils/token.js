import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const createRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email
        },

        config.jwtRefresh,
        
        {
            expiresIn: "15d"
        }
    )
}

export const createAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },

        config.jwtAccess,

        {
            expiresIn: "15m"
        }
    )
}