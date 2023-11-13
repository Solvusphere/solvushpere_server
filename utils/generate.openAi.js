const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.API_KY_OPENAI,
});

async function proccessByOpenAi(data) {
  if (data.length > 600) {
    return "Your content is exeeded the maximum limit. Can you please shrink this content ";
  }
  let response;
  await openai.chat.completions
    .create({
      messages: [{ role: "user", content: data }],
      model: "gpt-3.5-turbo",
    })
    .then((res) => {
      response = res;
      console.log("Api connected");
    })
    .catch((err) => console.log(err));
  let responseData = response.choices[0].message.content;
  console.log(responseData + "respone");
  if (responseData) return responseData;
}

module.exports = { proccessByOpenAi };
