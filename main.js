require("dotenv").config();
require("./controllers/plantingController");
const express = require("express");
const cors = require("cors");
const middleware = require("./middlewares/error");
const { sequelize } = require("./models");
const orderRoute = require("./routes/orderRoute");
const orderItemRoute = require("./routes/orderItemRoute");
const productRoute = require("./routes/productRoute");
const customerRoute = require("./routes/customerRoute");


const userRoute = require("./routes/userRoute");
const farmRoute = require("./routes/farmRoute");
const seedRoute = require("./routes/seedRoute");
const plantingRoute = require("./routes/plantingRoute");
const jobRoute = require("./routes/jobRoute");

const main = express();
main.use(express.json());
main.use(express.urlencoded({ extended: false }));

main.use(cors());

main.use('/users', userRoute);
main.use('/farms', farmRoute);
main.use('/seeds', seedRoute);
main.use('/plantings', plantingRoute);
main.use('/jobs', jobRoute);
main.use("/order", orderRoute);
main.use("/orderitem", orderItemRoute);
main.use("/product", productRoute);
main.use("/customer", customerRoute);

main.use((req, res, next) => {
  res.status(404).json({
    message:
      "Path not found in this server, please make sure that your path or method is correct.",
  });
});

main.use(middleware);

// sequelize.sync({ force: true }).then(() => console.log('DB sync'))

const port = process.env.PORT || 8000;
main.listen(port, () =>
  console.log(`The server is still running on port ${port}`)
);
