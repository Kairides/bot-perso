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

async function deleteMessage(message){
    var msg = new Message();
        msg.content = "le contenu de votre message a été jugé inapproprié et a donc été supprimé.";
        message.reply(msg);
        message.delete({ timeout: 100 })
            .then(msg => console.log(`Deleted message from ${msg.author.username} after 0.1 seconds`))
            .catch(console.error);
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
  }

async function searchVideo(args, message, serverQueue){

    const voiceChannel = message.member.voice.channel;
    if(!args.length){
        message.reply("paramètres de recherche manquants. Pour que je joue un morceau," +
        "veuillez taper la commande \"play\" suivie de ce que vous voulez que je joue.\n"+
        "Exemple: ```!play akroasis```");
    }else{
        if(!voiceChannel){
            message.reply("vous devez être dans un canal vocal pour ecoutez de la musique.");
            return;
        }else{
            var search = args.join(" ");
            const songInfo = await ytdl.getInfo(search);
            const song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };

            if(!serverQueue){

                const queueConstruct = {
                    textChannel: message.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };

                queue.set(message.guild.id, queueConstruct);

                queueConstruct.songs.push(song);

                try{
                    var connection = voice.join();
                    queueConstruct.connection = connection;
                    play(message.guild, queueConstruct.songs[0]);
                } catch (err){
                    console.log(err);
                    queue.delete(message.guild.id);
                    return message.channel.send(err);
                }
            }else{
                serverQueue.songs.push(song);
                return message.channel.send(`La chanson ${song.title} a été ajoutée à la file d'attente.`)
            }
        }
    }

    /*class song {
        title;
        url;

        constructor(title, url) {
            this.title = title;
            this.url = url;
        }
    }

    const result = {
        observers: {},
        playlist: false,

        on(eventName, observer) {
            if(!this.observers[eventName]){
                this.observers[eventName] = [];
            }

            this.observers[eventName].push(observer)
        },

        emit(eventName, object) {
            for (const observer of this.observers[eventName]) {
                observer(object)
            }
        }
    };

    const options = {
                    limit: 1,
    };

    ytsr(searched, options).then(info =>{
        if(info.items.length < 1){
            message.reply("Désolé, je n'ai rien trouvé qui corresponde à "+ searched);
        }else{
            const video = info.items[0];
            let s = song(video.title, video.link);

            result.emit("video", s);
            result.emit("done", null);
        }
    }).catch(error =>{
        console.log(error);
    })*/
}

client.on('ready', () =>{
	console.log("I am ready !");
});

client.on('message', message =>{

    if(checkMessage(message)){
        deleteMessage(message);
        return;
    }

    const serverQueue = queue.get(message.guild.id);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();
    
    if(message.channel.type === "dm" || message.channel.name === "general"){
        if(command === "play"){

            searchVideo(args, message, serverQueue);

            
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
