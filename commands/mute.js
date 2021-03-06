const settings = require("../settings.js");
const jsl = require("svjsl");
const fs = require("fs");


module.exports.isAdminCommand = true;
module.exports.help = "[WIP] Prevents the specified user from sending any messages";
module.exports.args = ["User"];
module.exports.run = (client, message, args) => {
    return message.reply("this command is work in progress and doesn't work currently.");

    var mentions, muteUser, muteMinutes = settings.command_settings.mute.default;
    try {
        mentions = message.mentions.members.array();
        muteUser = mentions[0];
    }
    catch(err) {

    }

    try {
        muteMinutes = parseInt(args.split(" ")[1]);
        if(isNaN(muteMinutes)) muteMinutes = settings.command_settings.mute.default;
        else if(jsl.isEmpty(muteMinutes) || muteMinutes <= settings.command_settings.mute.min || muteMinutes >= settings.command_settings.mute.max) return message.reply(`please enter a number between ${settings.command_settings.mute.min} and ${settings.command_settings.mute.min}.`);
    }
    catch {
        muteMinutes = settings.command_settings.mute.default;
    }

    try {
        if(jsl.isEmpty(muteUser)) muteUser = client.users.find(user => user.username == args.split(" ")[0]);
    }
    catch(err) {
        if(jsl.isEmpty(muteUser)) muteUser = client.users.find(user => user.username == args);
    }

    if(jsl.isEmpty(muteUser.tag) || muteUser.tag == "undefined") return message.reply("please don't mention the user you want to mute.\nExample: `^mute User1234`, not `^mute @User1234`");

    if(message.member.permissions.has("MUTE_MEMBERS")) {
        if(!fs.readFileSync(settings.command_settings.mute.file).includes(muteUser.id)) {
            message.reply("muted user **" + muteUser.tag + "** for **" + muteMinutes + "** minutes.").then(m => {
                if(message.guild.id == "430932202621108275") message.guild.channels.get("489605729624522762").send("**" + message.author.tag + "** just muted user **" + muteUser.tag + "** for **" + muteMinutes + "** minutes.");
                let data = `${message.guild.id};${muteUser.id};${new Date().toUTCString()};${muteMinutes}`;
                fs.appendFileSync(settings.command_settings.mute.file, data + "\n");
            });
        }
        else {
            message.reply("that user is already muted!");
        }
    }
    else {
        message.reply("you don't have enough permissions to do that!\nNeeded permission: `MUTE_MEMBERS`");
    }
}