const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/db");
const authRouterCustomer = require("./routes/auth/authCustomer");
const authRouterWorker = require("./routes/auth/authWorker");
const { authenticateJWT } = require("./middleware/authMiddleware");
const verify = require("./controllers/auth/verify");
const cookieParser = require("cookie-parser");
const addTicketRouter = require("./routes/ticket/addTicket");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser())
app.use(express.json());

app.use("/auth/customer", authRouterCustomer);
app.use("/auth/worker", authRouterWorker);
app.get("/auth/verify", authenticateJWT, verify);

app.use("/ticket/add", addTicketRouter);
sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(5555, () => {
      console.log(`Server is running on http://localhost:5555`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
