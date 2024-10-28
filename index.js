const express = require("express");
const app = express();
const { dbConnect } = require("./Database/database");
const routes = require("./Routes/routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

app.use("/uploads", express.static("uploads"));
app.use(cors({
  origin: 'https://devfusion-frontend.onrender.com',  // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Methods you are using
  credentials: true,  // If you're using cookies or authorization headers
}));
app.options('*', cors());  // Preflight request handling for all routes
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

dbConnect()
  .then(() => {
    console.log("connected to the database");
    app.listen(process.env.PORT, () => {
      console.log("app is listening on port no", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("error connecting to the database", error.message);
  });

// app.use("/", (req, res) => {
//   res.send("response from the server");
// });
