const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const DB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGOOSE_URL)
      .then(() => {
        console.log("Data Base Connected Successfully");
      })
      .catch((err) => {
        console.log(`Data Base Connection Failed ${err}`);
      });
  } catch (err) {
    console.log(`Server Side Error while Connection ${err}`);
  }
};

module.exports = DB;
