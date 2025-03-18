const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/recommend", async (req, res) => {
  try {
    const userData = req.body;

    // Send the user input to the FastAPI recommendation service
    const response = await axios.post(
      "http://localhost:8000/recommendation",
      userData
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

module.exports = router;
