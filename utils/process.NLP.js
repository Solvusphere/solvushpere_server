const natural = require("natural");
const Goals = require("../models/goals.model");
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

module.exports.processingResult(async (id) => {
  const tfidf = new TfIdf();

  let fetchingSolutions = await Goals.find({ company_id: id }).exec();
  if (!fetchingSolutions) {
    return false;
    }
    console.log(fetchingSolutions);
});
