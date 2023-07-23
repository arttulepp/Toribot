// !listings
const fs = require("fs");

module.exports = function (msg) {
  let author = msg.author;
  let filepath = "./data/" + author.username + ".json";
  try{
    let rawdata = fs.readFileSync(filepath);
    let filedata = JSON.parse(rawdata);
  
    let urls = [];
    for (let u in filedata){
      if(u !== "author"){
        urls.push(u);
      }
    } 
    
    let replystr = ""
    let c = 1;
    for (u in urls){
      replystr = replystr + c + ". " + urls[u] + "\n"
      c++
    }
    msg.channel.send(replystr);
  } catch (err) {
    msg.channel.send("Error finding listings!")
  }
  
};
