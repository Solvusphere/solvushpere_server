const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  number: Joi.number().required(),
});

const Validate = (data) => {
  const { error, value } = userSchema.validate(data);

  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};

const LoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password:Joi.string().min(8).required()
})

const LoginValidate = (data) => {
    const { error, value } = LoginSchema.validate(data);

    if (error) return { status: false, response: error.details };
    else return { status: true, response: value };
}
module.exports = {
  Validate,
  LoginValidate
};