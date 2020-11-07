const {Client, MessageEmbed, Message, MessageReaction} = require('discord.js');

const accessKeyId = process.env.key_discord;

const client = new Client();
client.login(accessKeyId);

var playing = false;

const MOTS_INTERDITS = ["connard", "connards", "salauds", "salaud", "salopard", "salopards", "salope", "salopes", "bite", "couilles", "merde", "chiasse", "putain", 
			"bordel", "foutre", "con", "cons", "couille", "batard", "batards", "bougnoul", "enculé", "enflure", "branleur", "pute", "putes", "gouine",
		       "gouines", "pd", "pédé", "pouffiasse", "puoffiasses", "lopette", "nègre", "negre", "negres", "nègres", "mongol", "mongols", "nazi", "nazis",
			"négro", "négros", "nique", "niquer", "trouduc", "Rob Schneider"];

function checkMot(mot){
    var grossier = false;
    for (var i = 0; i < MOTS_INTERDITS.length; i++){
        if (MOTS_INTERDITS[i] === mot.toLowerCase()){
            grossier = true;
        }
    }
    return grossier;
};

function resetPlaying(){
    playing = false;
    //console.log("Playing is false !")
};

client.on('ready', () =>{
	console.log("I am ready !");
});

client.on('message', message =>{

    /*if(message.channel.name === "general" && message.content.startsWith('!createSession')){
        playing = true;
        setTimeout(resetPlaying, 360000);
        console.log("Running !")
    }*/

    var mots = message.content.split(" ");
    mots.forEach(mot => {
        if (checkMot(mot) != ""){
            var msg = new Message();
            msg.content = "le contenu de votre message a été jugé inapproprié et a donc été supprimé.";

            message.reply(msg);
            // message.member.setNickname(message.member.nickname + "(GROSSIER)");
            message.delete({ timeout: 100 })
            .then(msg => console.log(`Deleted message from ${msg.author.username} after 0.1 seconds`))
            .catch(console.error);
        }
    });
});

/*client.on('messageReaction', messageReaction =>{
    if(message.channel.name === "info-serveur"){
        console.log(message.users);
    }
});*/
