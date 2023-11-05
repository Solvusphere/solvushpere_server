const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
});

const otpSchema = Joi.object({
  otp: Joi.number().required(),
});

const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().min(8).required()
})
const validateEmail = (data) => {
  const { error, value } = userSchema.validate(data);
  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};

const validateOtp = (data) => {
  const { error, value } = otpSchema.validate(data);
  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};

const LoginValidate = (data) => {
  const { error, value } = LoginSchema.validate(data);
  
  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
}
module.exports = {
  validateEmail,
  validateOtp,
  LoginValidate
};

