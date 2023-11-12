const Company = require("../../models/compaies.model");
const { processingResult } = require("../../utils/process.NLP");

const solutionController = {
  async process_Solution(req, res) {
    try {
      let { problem, id } = req.body;
      let companyIds = (await processingResult(id, problem)).map(
        (entry) => entry.comapany_id
      );
      let fetchingCompanies = await Company.find({
        _id: { $in: companyIds },
      }).populate('goals');
      console.log(fetchingCompanies);
      if (fetchingCompanies) res.status(200).send(fetchingCompanies);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = solutionController;
