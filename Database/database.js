const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  await mongoose.connect(process.env.URL);
}

module.exports = { dbConnect };
