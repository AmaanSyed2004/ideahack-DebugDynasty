const express = require("express");
const axios = require("axios");
const Customer = require("../../models/Customer");
const { authenticateJWT } = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/recommend", authenticateJWT, async (req, res) => {
  try {
    const userID= req.user.id;
    // Fetch the user's data from the database
    const user = await Customer.findOne({
      where: { userID },
    });
    // Send the user input to the FastAPI recommendation service
    const response = await axios.post(
      "http://localhost:8000/recommendation",
      {
        age: user.age || 30,
        total_assets: user.total_assets,
        credit_score: user.credit_score,
        net_monthly_income: user.net_monthly_income,
        missed_payments: user.missed_payments,
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
