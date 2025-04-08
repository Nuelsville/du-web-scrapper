const express = require("express");
const router = express.Router();
const { startScraping, getScrapedData, getAlternateData } = require("../controllers/scraperController");

router.get("/scrape", startScraping);
router.get('/scraped-data', getScrapedData);
router.get('/alternate-data', getAlternateData);

module.exports = router;
