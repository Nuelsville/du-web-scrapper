const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require('path');

const { URL } = require("url");

let visited = new Set();
let scrapedPages = [];

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function crawl(url, baseDomain) {
    if (visited.has(url)) return;
    visited.add(url);

    try {
        console.log(`🔍 Visiting: ${url}`);
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        const pageText = $("body").text().replace(/\s+/g, " ").trim();

        scrapedPages.push({ url, content: pageText });

        $("a").each((_, el) => {
            const href = $(el).attr("href");
            if (!href || href.startsWith("mailto:") || href.startsWith("tel:" || href.match(/\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff)(\?.*)?$/i))) return;

            let fullUrl;
            try {
                fullUrl = new URL(href, url).toString();
                if (fullUrl.startsWith(baseDomain)) {
                    crawl(fullUrl, baseDomain);
                }
            } catch { }
        });

        await delay(300);
    } catch (err) {
        console.warn(`❌ Failed to fetch ${url}`);
    }
}

async function autoScrape() {
    scrapedPages = [];
    visited = new Set();

    const sites = process.env.SITES.split(",");

    for (const site of sites) {
        await crawl(site, site);
    }

    fs.writeFileSync("scraped_data.json", JSON.stringify(scrapedPages, null, 2));
    console.log(`✅ Auto-scrape done! ${scrapedPages.length} pages saved.`);
}

const startScraping = async (req, res) => {
    scrapedPages = [];
    visited = new Set();

    const sites = process.env.SITES.split(",");

    for (const site of sites) {
        await crawl(site, site);
    }

    fs.writeFileSync("scraped_data.json", JSON.stringify(scrapedPages, null, 2));

    res.status(200).json({
        message: `✅ Scraping complete. ${scrapedPages.length} pages saved.`,
        total: scrapedPages.length,
        file: "scraped_data.json"
    });
};

const getScrapedData = (req, res) => {
    const filePath = path.join(__dirname, '..', 'scraped_data.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading the data file.' });
      }
  
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseErr) {
        res.status(500).json({ message: 'Error parsing the JSON file.' });
      }
    });
  };

const getScrapedData = (req, res) => {
    const filePath = path.join(__dirname, '..', 'alternate_data.json');
  
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading the data file.' });
      }
  
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (parseErr) {
        res.status(500).json({ message: 'Error parsing the JSON file.' });
      }
    });
};
  

module.exports = { startScraping, autoScrape, getScrapedData };
