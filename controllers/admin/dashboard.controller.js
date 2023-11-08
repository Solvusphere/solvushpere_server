const Admin = require('../../models/admin.model')
const Jwt = require('jsonwebtoken')
const Joi = require('joi')
const { hashPassword,campare } = require('../../utils/bcrypt')
const { validate } = require('../../validations/admin.validation')

 const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
};
