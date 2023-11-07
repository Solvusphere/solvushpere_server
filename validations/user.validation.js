const Joi = require("joi");

// const userSchema = Joi.object({
//   username: Joi.string().min(3).max(30).required(),
//   email: Joi.string().email().required(),
// });

const otpSchema = Joi.object({
  otp: Joi.number().required(),
});

function creatingSchema(data) {
  return Joi.object(data);
}


const Validate = (schma, data) => {
  const { error, value } = creatingSchema(schma).validate(data);
  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};

const validateOtp = (data) => {
  const { error, value } = otpSchema.validate(data);
  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};


module.exports = {
  validateOtp,
  Validate,
};
