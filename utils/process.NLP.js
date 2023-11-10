const natural = require("natural");
const Goals = require("../models/goals.model");
const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

const processingResult = async (id, problem) => {
  const tfidf = new TfIdf();

  let fetchingSolutions = await Goals.find(
    {},
    { solution: 1, company_id: 1 }
  ).exec();
  if (fetchingSolutions) {
    fetchingSolutions.map((companies) => {
      const solutionTokens = tokenizer.tokenize(companies.solution);
      tfidf.addDocument(solutionTokens);
    });
    const userTokens = tokenizer.tokenize(problem);
    const matchingCompanies = fetchingSolutions.map((companies, index) => ({
      comapany_id: companies.company_id,
      score: tfidf.tfidf(userTokens, index),
    }));
    let matchedcompanies = matchingCompanies
      .sort((a, b) => b.score - a.score)
      .filter((company) => company.score != 0 || company.score > 0); // Sort by score
    if (matchingCompanies.length != 0) {
      return matchedcompanies;
    } else {

    }
  } else {
    // console.log(fetchingSolutions);
    return false;
  }
};

module.exports = {
  processingResult,
};
