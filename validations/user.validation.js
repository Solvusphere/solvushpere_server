const Joi = require("joi");

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required()
});
const Validate = (data) => {
  const { error, value } = userSchema.validate(data);

  if (error) return { status: false, response: error.details };
  else return { status: true, response: value };
};

module.exports = {
  Validate,
};