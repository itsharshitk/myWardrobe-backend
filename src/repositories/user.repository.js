import userModel from "../models/user.model.js"

export default class UserRepository {

    async create(data) {
        const user = await userModel.create(data);
        user.password = undefined;
        return user;
    }

    async findByEmail(email) {
        return userModel.findOne({email});
    }
    
    async findForLogin(email) {
        return userModel.findOne({email}).select("+password");
    }
}