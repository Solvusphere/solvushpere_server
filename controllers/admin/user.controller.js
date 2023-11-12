const Company = require('../../models/compaies.model')
const User = require('../../models/users.model')
const Jwt = require('jsonwebtoken')
const { commonErrors } = require('../../middlewares/error/commen.error')

const AdminUserController = {
    async user_List(req, res) {
        try {
            const userList = await User.find({}).sort({verified:1})
            if (!userList) {
                return commonErrors(res,404,{message:"Compnay Datas Not Found"})
            }
            return res.status(200).send(userList)
            
        } catch (error) {
            console.log(error);
            commonErrors(error,500,{message:"Internal Server Error"})
        }
    },

    async block_User(req, res) {
        try {
            const { id } = req.params
            const block = await User.updateOne({ _id: id }, { $set: { verified: false } });
            if (!block)
                return commonErrors(res, 400, { message: "Action Denied" })
            return res.status(200).send({ message: "You Are No More our User", id })
        } catch (error) {
            console.log(error);
            commonErrors(error,500,{message:"Internal Server Error"})
        }
    },
}

module.exports = AdminUserController