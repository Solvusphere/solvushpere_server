const Company = require("../../models/compaies.model");

const UserCompanyController = {
  async fetchCompanydata(req, res) {
    try {
      let { id } = req.params;
      let comapnyData = await Company.findOne({ _id: id }).populate([
        "goals",
        "industry",
        "advertiesments",
      ]);
      console.log(comapnyData);
    } catch (error) {}
  },
};
module.export = UserCompanyController;