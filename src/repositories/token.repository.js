import RefreshTokens from "../models/refreshTokens.js"

export default class TokenRepository{

    async create(userId, refreshToken) {        
        return await RefreshTokens.create({
            userId,
            refreshToken,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 )
        })
    }
}