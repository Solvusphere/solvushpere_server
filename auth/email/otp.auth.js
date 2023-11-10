const {
  redisGet,
  redisSet,
  redisReSet,
} = require("../../connections/redis.connection");

module.exports.verifyOtp = async (sendedotp) => {
  let takecompanyOtp = await redisGet(`${sendedotp}`);
  if (takecompanyOtp == null)
    return {
      status: false,
      message: "This Otp has expaired ,Please resend the otp again ",
    };
  let companyData = JSON.parse(takecompanyOtp);
  if (!companyData.otp)
    return {
      status: false,
      message: "Invalide Otp,Please resend the otp again ",
    };
  if (companyData.otp != sendedotp)
    return {
      status: false,
      message: "Invalide Otp,Please check your otp agian ",
    };
  companyData.verified = true;
  redisReSet(`${companyData.otp}`, JSON.stringify(companyData));
  return {
    status: true,
    message: "welcome to solvushpere , you otp has been verifed ",
    otp: companyData.otp,
  };
};
