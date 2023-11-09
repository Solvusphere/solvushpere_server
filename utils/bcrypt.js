const bcrypt = require("bcrypt");

module.exports.hashPassword = async (password, email) => {
  try {
    let salt = await bcrypt.genSalt(10); // Wait for the salt to be generated
    let hashed = await bcrypt.hash(password + email, salt);
    return hashed;
  } catch (error) {
    throw new Error("Error hashing the password");
  }
};
module.exports.campare = async (currentPassword, email, hashedpassword) => {
  try {
    let decode = await bcrypt.compare(currentPassword + email, hashedpassword);
    if (decode) return decode;
    else return false;
  } catch (error) {
    throw new Error("Error camparing the password");
  }
};