const Company = require('../../models/compaies.model')
const Joi = require('joi')
const Jwt = require('jsonwebtoken')
const Redis = require("../../connections/redis.connection")
const { commonErrors } = require('../../middlewares/error/commen.error')
const { hashPassword, campare } = require('../../utils/bcrypt')
const { validateOtp, Validate } = require('../../validations/company.validation')

const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
};


const CompanyController    = {
    async login(req, res) {
        try {
            const { email, password } = req.body
            const CompanyData = {
             email: email,
             password: password,
            };
            const validating = Validate(
                { email: requirments.email, password: requirments.password },
                CompanyData
            )
            if (!validating)
                return commonErrors(res, 400, validating.response[0].message)
            
            const company = await Company.findOne({ email: email })
            if (!company)
                return commonErrors(res, 404, { message: "Please Register Your Company" })
            
            const isValidPassword = await campare(password, company.password)
            
            if (!isValidPassword)
                return commonErrors(res, 400, { message: "Password Doesn't Match" })
            
            const payload = { _id: company._id, name: company.name, email: company.email };
            const token = Jwt.sign(payload, "#$solvusphere$#")
            return commonErrors(res, 200, { message: "Login Successfully", token, company });
        } catch (error) {
            console.log(error);
            return commonErrors(error,500,{message:"Internal Server Error"})
        }
    }
}

module.exports = CompanyController