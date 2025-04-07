const express = require("express");
const router = express.Router();
const { startScraping, getScrapedData } = require("../controllers/scraperController");

router.get("/scrape", startScraping);
router.get('/scraped-data', getScrapedData);

module.exports = router;
