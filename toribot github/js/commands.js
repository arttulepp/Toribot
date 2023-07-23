const { prefix } = require('./config.json');
const beep = require("./commands/beepboop");
const add = require("./commands/addListingUrl");
const remove = require("./commands/deleteListingUrl");
const mylistings = require("./commands/showAllListingUrls");

const commands = { beep, add, remove, mylistings};


const commandHandler = async function(msg){
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;
    //console.log(msg.content);
    let args = msg.content.split(" ");
    let command = args.shift().substring(1); //removes command from args, removes prefix from command

    //console.log(command);

    try{
        commands[command](msg,args);
    } catch(err){ console.log(err); }
}

module.exports = commandHandler;