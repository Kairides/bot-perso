const {Client, MessageEmbed, Message, MessageReaction} = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {prefix, param} = require('./config.json');

const accessKeyId = process.env.key_discord;
const client = new Client();
client.login(accessKeyId);

const broadcast = client.voice.createBroadcast();
const queue = new Map();

//var playing = false;

const MOTS_INTERDITS = ["connard", "connards", "salauds", "salaud", "salopard", "salopards", "salope", "salopes", "couilles", "merde", "chiasse", "putain", 
			"bordel", "foutre", "con", "cons", "couille", "batard", "batards", "bougnoul", "enculé", "enflure", "branleur", "pute", "putes", "gouine",
		       "gouines", "pd", "pédé", "pouffiasse", "pouffiasses", "lopette", "nègre", "negre", "negres", "nègres", "mongol", "mongols", "nazi", "nazis",
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

function checkMessage(message){
    var mots = message.content.split(" ");
    var grossier = false;
    mots.forEach(mot => {
        if (checkMot(mot) != ""){grossier = true;}
    });

    return grossier;
}

async function searchVideo(searched){
    ytsr(search, options).then(info =>{
        if(info.items.length < 1){
            message.reply("Désolé, je n'ai rien trouvé qui corresponde à "+ search);
        }else{
            const video = info.items[0];
            return new song(video.title, video.link);
        }
    }).catch(error =>{
        console.log("Couille dans le paté.")
    })
}

client.on('ready', () =>{
	console.log("I am ready !");
});

client.on('message', message =>{

    if(checkMessage(message)){
        var msg = new Message();
        msg.content = "le contenu de votre message a été jugé inapproprié et a donc été supprimé.";
        message.reply(msg);
        message.delete({ timeout: 100 })
            .then(msg => console.log(`Deleted message from ${msg.author.username} after 0.1 seconds`))
            .catch(console.error);
            return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    console.log(command, message.channel.type, message.channel.name);
    
    if(message.channel.type === "dm" || message.channel.name === "general"){
        if(command === "play"){
            if(!args.length){
                message.reply("paramètres de recherche manquants. Pour que je joue un morceau," +
                "veuillez taper la commande \"play\" suivie de ce que vous voulez que je joue.\n"+
                "Exemple: ```!play akroasis```");
            }else{
    
                //message.reply("Pour l'instant, je ne sais pas quoi mettre ici.");
                var search = args.join(" ");
                console.log(searchVideo(search));

                /*const options = {
                    limit: 1,
                }

                const result = {
                    observer: {},
                    playlist: false,

                    on
                }
                
                ytsr.getFilters('github').then(async (filters1) => {
                    const filter1 = filters1.get('Type').find(o => o.name === 'Video');
                    const filters2 = await ytsr.getFilters(filter1.ref);
                    const filter2 = filters2.get('Duration').find(o => o.name.startsWith('Short'));
                    const options = {
                        limit: 5,
                        nextpageRef: filter2.ref,
                    }
                    const searchResults = await ytsr(null, options);
                    dosth(searchResults);
                }).catch(err => {
                    console.error(err);
                });*/
            }
        }else{
            message.reply("commande inconnue, essayez une commande comme ```!play```");
        }
    }        
});

/*function resetPlaying(){
    playing = false;
    //console.log("Playing is false !")
};*/

/*client.on('messageReaction', messageReaction =>{
    if(message.channel.name === "info-serveur"){
        console.log(message.users);
    }
});*/
