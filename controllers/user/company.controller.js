const Company = require("../../models/compaies.model");
const { commonErrors } = require("../../middlewares/error/commen.error");
const User = require("../../models/users.model");

const UserCompanyController = {
  async fetchCompanydata(req, res) {
    try {
      let { id } = req.params;
      let comapnyData = await Company.findOneAndUpdate(
        { _id: id },
        { $inc: { visite_count: 1 } },
        { new: true }
      )
        .select("-password")
        .populate(["goals", "industry", "advertiesments"]);
      res.send(comapnyData);
    } catch (error) {
      console.log(error);
      return commonErrors(res, 500, { message: "internal sever error" });
    }
  },
  async FollowToTheCompany(req, res) {
    try {
      let { id } = req.params;
      let { userId } = req.body;

      const [followCompany, followUser] = await Promise.all([
        Company.findByIdAndUpdate(id, {
          $addToSet: { followers: userId },
        }),
        User.findByIdAndUpdate(
          { _id: userId },
          {
            $addToSet: { following: id },
          }
        )
      ]);
      if (!followCompany || !followUser)
        return commonErrors(res, 404, { message: "Somthing went worng " });
      res.send({ message: "succesfully followed" });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = UserCompanyController;
