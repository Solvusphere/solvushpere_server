const app = require("../index"); // Your Express app or HTTP server
const mongoose = require("mongoose");
const supertest = require("supertest");
const User = require("../models/user.model");

describe("User Registration API", () => {
  beforeAll(async () => {
    // Connect to the database before running tests
    if (!mongoose.connection.readyState) {
      await mongoose.connect("mongodb://0.0.0.0:27017/solution", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });
  afterAll(async () => {
    // Disconnect from the database after all tests are done
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });
  
  it("should register a user", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      number: "1234567890",
      password: "password123",
    };
    await supertest(app)
      .post("/user/register")
      .send(userData)
      .expect(200)
      .then(async (response) => {
        // Check the response
        console.log(response);
        expect(response.text).toBe("Successfully registered");
      });
  });
});
