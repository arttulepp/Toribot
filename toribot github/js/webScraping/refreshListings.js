const rp = require("request-promise").defaults({ encoding: "latin1" });
const $ = require("cheerio");

const fs = require("fs");

const newListings = require("./newListings");
const jsonHandler = require("./jsonHandler");

const url = "https://www.tori.fi/koko_suomi/tietokoneet_ja_lisalaitteet/komponentit?ca=18&cg=5030&c=5038&w=3&st=s&st=k&st=u&st=h&st=g&st=b&com=graphic_card";

const refreshListings = async function (fileName, newUrl, author) {
  if (!fileName) {
    console.log("INVALID COMMAND");
    return false;
  }

  let filepath = "./data/" + fileName;
  let isDirExists = fs.existsSync(filepath) && fs.lstatSync(filepath).isFile();

  // If file doesn't exist, check if newUrl, create the file and request listings for it
  // If file exists, if newUrl requestlistings for newurl
  // If file exists, if no newUrl, get all existing urls from list and request listings for all of those

  if (!isDirExists) {
    if (newUrl) {
      fs.writeFileSync(filepath, `{"author": "${author}"}`); // create file and add empty object if file doesn't exist yet
      requestListings(filepath, newUrl, true);
    } else {
      console.log("REQUIRE NEW URL");
      return false;
    }
  } else {
    if (newUrl) {
      requestListings(filepath, newUrl, true);
    } else {
      let rawdata = fs.readFileSync(filepath);
      let filedata = JSON.parse(rawdata);
      let urls = [];
      let author;
      for (let u in filedata) {
        if (u !== "author") {
          urls.push(u);
        } else {
          author = filedata[u];
        }
      }
      for (let i = 0; i < urls.length; i++) {
        let newStuff = await requestListings(filepath, urls[i]);
        if (newStuff) {
          return {
            author: author,
            newListings: newStuff,
          };
        }
      }
    }
  }
};

const requestListings = function (filepath, url, newUrlBoolean) {
  return new Promise(function (resolve, reject) {
    rp(url)
      .then(function (html) {
        let listings = [];
        let listingObj = { [url]: listings }; // Objektit vittuun täältä, täällä vain lista, jsonHandler nakkaa objektiin ja .jsoniin // höpöhöpö tää on hyvä
        let img;

        $("div.list_mode_thumb > a", html).each(function (i, item) {
          if ($(this).find("div.images-count-container").children().length > 0) {
            // Deal with listings without img
            img = $(this).find("img.item_image")[0].attribs.src;
          } else {
            img = "Ei kuvaa";
          }
          let listing = {
            id: $(this)[0].attribs.id,
            url: $(this)[0].attribs.href.trim(),
            imgurl: img,
            name: $(this).find("div.li-title").text().replace(/\s\s+/g, ""),
            price: $(this).find("p.list_price.ineuros").text().replace(/\s\s+/g, ""),
            location: $(this).find("div.cat_geo.clean_links").text().replace(/\s\s+/g, " ").split(" ")[1], // first word is index [1] because [0] is " " for some reason
          };

          listings.unshift(listing);
        });

        return listingObj;
      })
      .then(function (listings) {
        //console.log(listings[url]);
        if (!newUrlBoolean) {
          // If url isn't new one, check for new listings and return new stuff

          let newStuff = newListings(listings[url], url, filepath);

          if (newStuff) {
            console.log("INDEX.JS UTA PASKA");
            jsonHandler(newStuff, url, filepath);
            resolve(newStuff);
          }
        } else {
          //if url is a new one, store the requested listings
          jsonHandler(listings[url], url, filepath);
        }
      })
      .catch(function (err) {
        //handle error
        console.log(err);
      });
  });
};

module.exports = { refreshListings, requestListings };

function testingtesting(newstuff) {
  //console.log(newstuff);
}
