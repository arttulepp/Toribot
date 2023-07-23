/// !remove 2
const fs = require("fs");

module.exports = function (msg, args) {
  let author = msg.author;
  let index = args[0] - 1;


  let filepath = "./data/" + author.username + ".json";
  let rawdata = fs.readFileSync(filepath);
  let filedata = JSON.parse(rawdata);

  let urls = [];
  for (let u in filedata){
    if(u !== "author"){
      urls.push(u);
    }
  }

  if((urls.length < args[0]) || index < 0 ||!Number.isInteger(index)){  // Check if index is valid
    msg.channel.send("Invalid index!");
    return;
  }

  delete filedata[urls[index]];

  urls = [];
  for (let u in filedata){
    if(u !== "author"){
      urls.push(u);
    }
  } 

  if (urls.length == 0) {       // if no urls  in list, remove the file
    try {
      fs.unlinkSync(filepath);
      //file removed
    } catch (err) {
      console.error(err);
    }
  } else {
    let data = JSON.stringify(filedata, null, 2);
    fs.writeFileSync(filepath, data);
  }

  msg.channel.send("Listing removed successfully");
};

