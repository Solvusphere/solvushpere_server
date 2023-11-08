const Company = require('../../models/compaies.model')
const Joi = require('joi')
const { commonErrors } = require('../../middlewares/error/commen.error')
const Jwt = require('jsonwebtoken')

const ProfileController = {
    async loadProfile(req,res) {
        try {
            const {id} = req.body
            const data = await Company.findOne({ _id: id })
            if (!data)
                return commonErrors(res, 404, { message: "Data Not Found" })
            return res.status(200).send(data)
        } catch (error) {
            console.log(error);
            commonErrors(res, 500, { message:"Internal Server Error"})
        }
   }

}

module.exports = ProfileController