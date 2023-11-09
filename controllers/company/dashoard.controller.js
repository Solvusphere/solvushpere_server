const Company = require("../../models/compaies.model");
const Joi = require("joi");
const { commonErrors } = require("../../middlewares/error/commen.error");
const User = require("../../models/users.model");
const { sendEmail } = require("../../auth/email/nodemailer.auth");

const {
  redisDel,
  redisSet,
  setObject,
  redisReSet,
  redisGet,
} = require("../../connections/redis.connection");

const { verifyOtp } = require("../../auth/email/otp.auth");
const Jwt = require("jsonwebtoken");
const Redis = require("../../connections/redis.connection");
const { hashPassword, campare } = require("../../utils/bcrypt");
const { Validate } = require("../../validations/company.validation");
const Goals = require("../../models/goals.model");
const { sendEmailAsLink } = require("../../auth/email/link.auth");

const requirments = {
  password: Joi.string().min(8).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(30).required(),
  otp: Joi.number().required(),
  document: Joi.string().required(),
  number: Joi.number().required(),
  founder: Joi.string().min(3).max(20).required(),
  logo: Joi.string().required(),
  web_url: Joi.string().required(),
  industry: Joi.string().required(),
  image: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  goals: Joi.string().min(4).required(),
};

const CompanyController = {
  async verifyEmail(req, res) {
    try {
      const { email } = req.body;
      let validating = Validate({ email: requirments.email }, { email });
      if (!validating)
        return commonErrors(res, 400, {
          response: validating.response[0].message,
        });
      let existingUserOrCompany = await Promise.all([
        User.findOne({ email: email }),
        Company.findOne({ email: email }),
      ]);

      if (existingUserOrCompany[0] || existingUserOrCompany[1])
        return commonErrors(res, 400, {
          response: "This email doesn't have any access to register again",
        });
      sendEmailAsLink(email).then((responses) => {
        if (!res.status)
          return commonErrors(res, 404, {
            response: "otp has been not sended, Please try again ",
          });
        let authenticateEmail = responses;
        let validationData = {
          email: email,
        };

        let storingcompanydata = setObject(validationData);
        if (storingcompanydata == false)
          return commonErrors(res, 404, {
            response: "Somthing went worng, please refresh and try again",
          });
        res.status(200).send({ message: "sucessfully sended Otp" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },
  async registeringIntialData(req, res) {
    try {
      const { name, number, password, document, email } = req.body;

      let retrivedata = await redisGet(`${email}_verify`);
      if (!retrivedata) {
        return commonErrors(res, 400, {
          message: "Please verify your email agin",
        });
      }
      let parsedData = JSON.parse(retrivedata);
      let existingUserOrCompany = await Promise.all([
        User.findOne({ email: parsedData.email }),
        Company.findOne({ email: parsedData.email }),
      ]);

      if (existingUserOrCompany[0] || existingUserOrCompany[1])
        return commonErrors(res, 400, {
          response: "This email doesn't have any access to register again",
        });

      let retrivingCachedData = await redisGet(parsedData.email);
      if (retrivingCachedData) {
        let parsing = JSON.parse(retrivingCachedData);
        if (parsing.email == parsedData.email) {
          let registeringIntially = new Company(parsing);
          if (registeringIntially)
            registeringIntially.save().then((response) => {
              redisDel(parsing.email);
              return res.status(200).send({
                message: " Registration completed, Welcome to Solvusphere",
              });
            });
        }
      }
      let companyData = {
        username: name,
        number: number,
        password: password,
        document: document,
      };
      let validatingData = Validate(
        {
          username: requirments.username,
          number: requirments.number,
          password: requirments.password,
          document: requirments.document,
        },
        companyData
      );
      if (!validatingData.status)
        return commonErrors(res, 400, {
          message: validatingData.response[0].message,
        });
      let encryptpassword = await hashPassword(password, parsedData.email);
      if (!encryptpassword)
        return commonErrors(res, 400, {
          message: "somthing went worng try again",
        });
      let registeringData = {
        name: name,
        email: parsedData.email,
        number: number,
        password: encryptpassword,
        document: "",
      };
      let registeringIntially = new Company(registeringData);
      await registeringIntially.save().catch((err) => {
        redisSet(parsedData.email, JSON.stringify(registeringData));
        return res.status(500).send({
          error: "Internal Server Error, your registration not completed",
        });
      });
      redisDel(`${parsedData.email}_verify`);
      res.status(200).send({
        message: " Registration completed, Welcome to Solvusphere",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  },
  async completeRegistration(req, res) {
    try {
      let { id } = req.body;
      let checkingCache = await redisGet(id);
      if (checkingCache) {
        let parsing = JSON.parse(checkingCache);
        let registeringByCachedData = await Company.findByIdAndUpdate(
          id,
          parsing
        ).exec();
        if (registeringByCachedData) {
          redisDel(id);
          return res.status(200).send({
            message: "Registration completed, Welcome to solvusphere",
          });
        }
      }

      const { founder, logo, image, web_url, industry, services, goals } =
        req.body;
      const companyData = {
        founder,
        logo,
        image,
        web_url,
        industry,
        services,
        goals,
      };
      const value = await Company.findById(id).exec();
      if (!value) {
        return commonErrors(res, 400, {
          message: `You don't have any access to change this datas`,
        });
      }
      let validatingDatas = Validate(
        {
          founder: requirments.founder,
          logo: requirments.logo,
          image: requirments.image,
          web_url: requirments.web_url,
          industry: requirments.industry,
          services: {
            image: requirments.image,
            name: requirments.name,
            description: requirments.description,
          },
          goals: {
            solution: requirments.goals,
            vision: requirments.goals,
            mission: requirments.goals,
          },
        },
        companyData
      );
      if (validatingDatas.status == false) {
        return commonErrors(res, 400, {
          message: validatingDatas.response[0].message,
        });
      }
      let companyGoal = {
        solution: goals.solution,
        vision: goals.vision,
        mission: goals.mission,
        company_id: id,
      };
      let cheakingIfAlreadyExist = await Goals.findOne({ company_id: id });
      if (cheakingIfAlreadyExist) {
        let updateSolution = await Goals.updateOne(
          { company_id: id },
          {
            $set: {
              solution: goals.solution,
              vision: goals.vision,
              mission: goals.mission,
            },
          }
        );
      } else {
        let createdSolution = new Goals(companyGoal);
        if (!createdSolution) {
          redisSet(id, companyData);
          return commonErrors(res, 400, {
            message: `Something went wrong, but your data will be stored temporarily.1`,
          });
        }
        let savingSolution = await createdSolution.save();
        if (!savingSolution) {
          redisSet(id, companyData);

          return commonErrors(res, 400, {
            message: `Something went wrong, but your data will be stored temporarily.2`,
          });
        }
      }
      const savingCompleteData = await Company.findByIdAndUpdate(
        id,
        companyData
      ).exec();
      if (!savingCompleteData) {
        redisSet(id, companyData);
        return commonErrors(res, 400, {
          message: `Something went wrong, but your data will be stored temporarily.3`,
        });
      }
      // Data successfully
      res
        .status(200)
        .send({ message: "Registration completed. Welcome to Solvusphere!" });
    } catch (error) {
      console.log(error);
      return commonErrors(res, 500, { message: "sothing went worng" });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const CompanyData = {
        email: email,
        password: password,
      };
      const validating = Validate(
        { email: requirments.email, password: requirments.password },
        CompanyData
      );
      if (!validating)
        return commonErrors(res, 400, validating.response[0].message);

      const company = await Company.findOne({ email: email });
      if (!company)
        return commonErrors(res, 404, {
          message: "Please Register Your Company",
        });

      const isValidPassword = await campare(password, email, company.password);

      if (!isValidPassword)
        return commonErrors(res, 400, { message: "Password Doesn't Match" });

      const payload = {
        _id: company._id,
        name: company.name,
        email: company.email,
      };
      const token = Jwt.sign(payload, "#$solvusphere$#");
      return commonErrors(res, 200, {
        message: "Login Successfully",
        token,
        company,
      });
    } catch (error) {
      console.log(error);
      return commonErrors(error, 500, { message: "Internal Server Error" });
    }
  },
};

module.exports = CompanyController;
