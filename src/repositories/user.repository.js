import userModel from "../models/user.model.js"

class UserRepository {

    async create(data) {
        const user = await userModel.create(data);
        user.password = undefined;
        return user;
    }

    async findByEmail(email) {
        return userModel.findOne({email});
    }
}

export default UserRepository;