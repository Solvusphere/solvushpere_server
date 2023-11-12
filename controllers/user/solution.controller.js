const Company = require("../../models/compaies.model");
const User = require("../../models/users.model");
const { processingResult } = require("../../utils/process.NLP");

const solutionController = {
  async processSolution(req, res) {
    try {
      let { problem, id } = req.body;
      // proccessing data using NLP and finding the better solution for the user problem
      let companyIds = (await processingResult(id, problem)).map(
        (entry) => entry.comapany_id
      );
      // fetching the companies matched for the solutions 
      let fetchingCompanies = await Company.find({
        _id: { $in: companyIds },
      }).populate("goals");
      console.log(fetchingCompanies);
      
      const newData = {
        indestr_id: fetchingCompanies[0].industry,
      };
    // adding those most fetched datas in to reommendation queue 
      await User.findOne({ _id: id }).then((user) => {
        if (user) {
          // Check if indestr_id already exists in the array
          const isExisting = user.recommended.some((item) =>
            item.indestr_id.equals(newData.indestr_id)
          );
          if (!isExisting) {
            // Add the new data to the array
            user.recommended.push(newData);
            // Limit the array size to 15
            if (user.recommended.length > 15) {
              user.recommended.shift(); // Remove the oldest item
            }
            // Save the updated user document
            return user.save();
          }
        }
      });
  
      if (fetchingCompanies) res.status(200).send(fetchingCompanies);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = solutionController;
