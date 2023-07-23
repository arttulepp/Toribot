const Discord = require("discord.js");
const schedule = require("node-schedule");

const { prefix, token } = require("./config.json");
const torikanava = "secret"
const client = new Discord.Client();

const fs = require("fs");
const commandHandler = require("./commands.js");
const handleListings = require("./webScraping/refreshListings"); // refreshListings() && requestListings()

client.once("ready", () => {
  console.log("Beep Boop");
  //List all servers
  console.log("Servers:");
  client.guilds.cache.forEach((guild) => {
    console.log(" - " + guild.name);
    // List all channels
    guild.channels.cache.forEach((channel) => {
      console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
    });
  });
});

client.on("message", commandHandler);

client.login(token);

const dataFolder = "./data/";
const refreshListingsJob = schedule.scheduleJob("*/5 * * * *", function () {
  console.log("Refresh all listings");
  fs.readdirSync(dataFolder).forEach((file) => {
    //console.log(file);
    getNewListings(file);
  });
});

async function getNewListings(file) {
  let author = file.split(".")[0];
  let newListings = await handleListings.refreshListings(file);
  if (newListings) {
    postNewListings(newListings);
  }
}

function test() {
  fs.readdirSync(dataFolder).forEach((file) => {
    //console.log(file);
    getNewListings(file);
  });
}
test();

function postNewListings(newListings) {
  let author = newListings.author;
  let embeds = createEmbed(newListings.newListings);
  
  if(author !== "global"){
    client.users.fetch(author.replace(/[^0-9.]/g, ""), false).then((user) => {
      embeds.forEach(function (embed) {
        user.send(embed);
      });
    });
  } else{
    embeds.forEach(function (embed) {
      client.channels.cache.get(torikanava).send(embed)
    });
  }
  
}

function createEmbed(newListings) {
  let embeds = [];
  for (let i = 0; i < newListings.length; i++) {
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle(newListings[i].name)
      .setURL(newListings[i].url.trim())
      .addFields({ name: "Hinta", value: newListings[i].price, inline: true }, { name: "Sijainti", value: newListings[i].location, inline: true })
      .setTimestamp();
    if (newListings[i].imgurl !== "Ei kuvaa") {
      embed.setImage(newListings[i].imgurl);
    } else {
      embed.setDescription("Ei kuvaa");
    }
    embeds.push(embed);
  }
  return embeds;
}
