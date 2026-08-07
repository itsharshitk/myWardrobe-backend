import { refreshToken } from "../controllers/auth.controller.js"
import RefreshTokens from "../models/refreshTokens.js"

class TokenRepository{

    async create(userId, refreshToken) {        
        return await RefreshTokens.create({
            userId,
            refreshToken,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000 )
        })
    }

    async deleteByToken(tokenHash) {
        return await RefreshTokens.deleteOne(
            {refreshToken: tokenHash}
        )
    }
}

export default new TokenRepository();