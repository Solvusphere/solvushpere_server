const Company = require('../../models/compaies.model')
const Joi = require('joi')
const { commonErrors } = require('../../middlewares/error/commen.error')
const Jwt = require('jsonwebtoken')

const ProfileController = {
    async fetchingProfile(req,res) {
        try {
            const {id} = req.body
            const data = await Company.findOne({ _id: id })
            if (!data)
                return commonErrors(res, 404, { message: "Data Not Found" })
            return res.status(200).send(data)
        } catch (error) {
            console.log(error);
            commonErrors(error, 500, { message:"Internal Server Error"})
        }
    },
    
    async editProfile(req, res) {
      try {
          const { } = req.body
          
        
      } catch (error) {
        console.log(error);
        commonErrors(error,500,{message:"Internal Server Error"})
      }  
    }

}

module.exports = ProfileController