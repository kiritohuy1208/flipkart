const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { urlencoded } = require("express");
const connectDatabase = require("../config/database");
dotenv.config();
const path = require("path");
const cors = require("cors");

const AuthRoute = require("./routes/auth");
const AuthAdminRoute = require("./routes/admin/auth");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const initialDataRoute = require("./routes/admin/initialData");
const pageRoute = require("./routes/admin/page");
const addressRoute = require("./routes/address");
const orderRoute = require("./routes/order");
const orderAdminRoute = require("./routes/admin/order.route");
app.use(cors());
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads"))); // dirnam tro ve thu muc cha
app.use(
  urlencoded({
    extended: true,
  })
);
connectDatabase();

// Declare project's router
app.use("/api", AuthRoute);
app.use("/api/admin", AuthAdminRoute);
app.use("/api/category", categoryRoute);
app.use("/api", productRoute);
app.use("/api", cartRoute);
app.use("/api", initialDataRoute);
app.use("/api", pageRoute);
app.use("/api", addressRoute);
app.use("/api", orderRoute);
app.use("/api", orderAdminRoute);

app.get("/", (req, res, next) => {
  res.send("Server web Flipkart start on port :" + process.env.Port || 8080);
});
app.listen(process.env.Port || 8080, () => {
  console.log("Server start on port :" + process.env.Port || 8080);
});
