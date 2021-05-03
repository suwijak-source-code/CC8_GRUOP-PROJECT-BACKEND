require("dotenv").config();
const express = require("express");
const cors = require("cors");
const middleware = require("./middlewares/error");
const { sequelize } = require("./models");
const customerRoute = require("./routes/customerRoute");

const main = express();
main.use(express.json());
main.use(express.urlencoded({ extended: false }));

main.use(cors());
main.use("/customer", customerRoute);

main.use((req, res, next) => {
  res.status(404).json({
    message:
      "Path not found in this server, please make sure that your path or method is correct.",
  });
});

main.use(middleware);

// sequelize.sync({ alter: true });

const port = process.env.PORT || 8000;
main.listen(port, () =>
  console.log(`The server is still running on port ${port}`)
);
