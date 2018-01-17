const Discord = require("discord.js"),
economy = require('discord-eco'),
modRole = 'Banquier',
low = require('lowdb'),
FileSync = require('lowdb/adapters/FileSync'),
adapter = new FileSync('database.json'),
con = console.log

var bot = new Discord.Client();
var prefix = ("/");   

bot.on(("ready"), ()=> {
    console.log("☻Bot démarré !!☻")
    function jeux() {
        
          var answers = ['/help', 'En développement', `Serveur RP bientôt ouvert`, `Cocréé par MrFlakou`, "Créé par yoyoazs77"];
        
            return answers[Math.floor(Math.random()*answers.length)];
        }
        var servercount = bot.guilds.size;
            var servers = bot.guilds.array().map(g => g.name).join(',');
        
        setInterval(() => {
        bot.user.setGame(jeux(), "http://twitch.tv/URL%22")     }, 5000)
})

bot.login("process.env.TOKEN");

bot.on("message", (message) => {

    if (message.content.startsWith(prefix + "site")){
        message.reply("Un site internet a étais créé pour le serveur gta: https://flaryonrp.wixsite.com/flaryonrp")
    }

    let msg = message.content.toUpperCase();
    let cont = message.content.slice(prefix.length).split(" ");
    let args = cont.slice(1);

    if (message.channel.type === "dm") 
        return;

if(message.content.startsWith(prefix + "plainte")){
    var plainte = message.content.substr(9);
    var num = Math.floor((Math.random() * 9999999) + 1);
    var author = message.author.tag
    var plt = bot.channels.get('402928074368221214');
    message.delete()

    plt.sendMessage('', { embed: {
    color: 16711680,
    author: {
        name: bot.user.username,
        icon_url: bot.user.avatarURL,
    },
    title: '',
    url: '',
    fields: [
        {
            name: `Plainte déposser par ${author}`,
            value: `${plainte}`,
        },
    ],
    footer: {
        icon_url: '',
        text: `Plainte numéro ${num}`
},
}})
    message.reply("Votre plainte a bien étais prise en compte.")
    }

    if (msg.startsWith(`${prefix}ADDMONEY`)) {

        if (!message.member.roles.find("name", modRole)) {
            message.channel.send('**Vous devez être `' + modRole + '` Pour utiliser cette commande...**');
            return;
        }

        if (!args[0]) {
            message.channel.send(`**Vous devez définir un montant. Utilisation: /ADDMONEY <montant> <utilisateur>**`);
            return;
        }


        if (isNaN(args[0])) {
            message.channel.send(`**Le montant doit être un nombre. Utilisation /ADDMONEY <montant> <utilisateur>**`);
            return; 
        }

        let defineduser = '';
        if (!args[1]) { 
            defineduser = message.author.id;
        } else { 
            let firstMentioned = message.mentions.users.first();
            defineduser = firstMentioned.id;
        }

        economy.updateBalance(defineduser + message.guild.id, parseInt(args[0])).then((i) => { 
            message.channel.send(`**L'utilisateur définit a eu ${args[0]} ajouté/soustrait sur sont compte.**`)
        });

    }

    if (msg === `${prefix}BALANCE` || msg === `${prefix}MONEY`) {

        economy.fetchBalance(message.author.id + message.guild.id).then((i) => {
            message.channel.sendMessage('', { embed: {
                color: 16711680,
                author: {
                    name: '',
                    icon_url: '',
                },
                title: `${message.guild.name} banque`,
                url: '',
                fields: [
                    {
                        name: `Titulaire du compte`,
                        value: `${message.author.username}`, 
                    },
                    {
                        name: 'Solde du compte',
                        value: i.money, 
                    },
                ],
                footer: {
                    icon_url: '',
                    text: ``
            },
            }})

    })
}

if (msg.startsWith(`${prefix}TEST`)) {

    if (!args[0]) {
        message.channel.send(`**Vous devez définir un montant. Utilisation: /TEST <montant>**`);
        return;
    }

    if (isNaN(args[0])) {
        message.channel.send(`**Le montant doit être un nombre. Utilisation /TEST <montant>**`);
        return; 
    }

    if (message.content.includes("-")) {
        message.channel.sendMessage("**Vous n'avez pas le droit de vous rétiré des nombres négatif**");
        return;
    }

    economy.updateBalance(message.author.id + message.guild.id, parseInt(-args[0])).then((i) => { 
        message.channel.send(`**${args[0]}$ ont étais soustrait a votre compte.**`)
    });

}
   
})
