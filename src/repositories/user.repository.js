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
    
    async findForLogin(email) {
        return userModel.findOne({email}).select("+password");
    }

    async findById(id) {
        return userModel.findById(id);
    }

    async updatePassword(id, newHash){
        return userModel.updateOne(
            {_id: id},
            {$set: { password: newHash } }
        )
    }
}

export default new UserRepository();