equire("dotenv").config();
const express = require("express");
const cors = require("cors");
const scraperRoutes = require("./routes/scraperRoutes");
const { autoScrape } = require("./controllers/scraperController");

const cron = require("node-cron");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow all origins by default
app.use(express.json());
app.use("/api", scraperRoutes);

cron.schedule("0 */3 * * *", () => {
    console.log("⏳ Auto-scrape started...");
    autoScrape();
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
