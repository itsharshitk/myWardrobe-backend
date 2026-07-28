import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/user.repository.js";

const repo = new userRepository();

export const register = async (data) => {
    const userExist = await repo.findByEmail(data.email);

    if(userExist) {
        throw new ApiError(409, "User already exists");
    }

    const createdUser = await repo.create(data);

    return createdUser
}