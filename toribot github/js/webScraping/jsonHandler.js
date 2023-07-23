const $ = require("cheerio");
const fs = require("fs");

const jsonHandler = function(newListings, url, filepath) {
  let rawdata = fs.readFileSync(filepath);
  let allListings = JSON.parse(rawdata);
  //console.log(allListings.hasOwnProperty(url));
  if (!allListings.hasOwnProperty(url)) {
    // if no key, add the key
    // create new key
    allListings[url] = [];
  }

  let listings = allListings[url];
  for (let i = 0; i < newListings.length; i++) {
    //console.log(newListings[i])
    listings.unshift(newListings[i]);
    if (listings.length > 60) {
      // if listings.length exceed 60, remove the last item
      listings.pop();
    }
  }
  //console.log(allListings);
  let data = JSON.stringify(allListings, null, 2);
  fs.writeFileSync(filepath, data);
}

module.exports = jsonHandler;