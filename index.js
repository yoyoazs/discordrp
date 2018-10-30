const Discord = require("discord.js");
const talkedRecently = new Set(),
economy = require('discord-eco'),
modRole = 'Banquier',
policierRole = 'Policier',
pompierRole = 'Pompier',
pauvreRole = 'SDF',
low = require('lowdb'),
FileSync = require('lowdb/adapters/FileSync'),
adapter = new FileSync('database.json'),
voitureadapter = new FileSync('voiture.json'),
carteadapter = new FileSync('carte.json')
db = low(adapter),
voituredb = low(voitureadapter)
cartedb = low(carteadapter)
fs = require("fs"),
con = console.log

var bot = new Discord.Client();
var prefix = ("/");   

voituredb.defaults({ voiture: []}).write()
cartedb.defaults({ carte: []}).write()

bot.on(("ready"), ()=> {
    console.log("☻Bot démarré !!☻")
    function jeux() {
        
          var answers = ['/help', 'En développement', `Ouverture a 18h`, `Cocréé par MrFlakou`, "Créé par yoyoazs77"];
        
            return answers[Math.floor(Math.random()*answers.length)];
        }
        var servercount = bot.guilds.size;
            var servers = bot.guilds.array().map(g => g.name).join(',');
        
        setInterval(() => {
        bot.user.setGame(jeux(), "http://twitch.tv/URL%22")     }, 5000)
})

bot.login(process.env.TOKEN);

bot.on("message", (message) => {
    if (message.channel.type === "dm") 
    return;

    const arg = message.content.slice(prefix.length).trim().split(/ +/g);

	if(message.content.startsWith(prefix + 'say')){
		if(message.author.id == "285345858348646400" || message.author.id == "300403637828714516"){
			const sayMessage = arg.join(" ");
			if (!sayMessage) return;
			message.delete().catch(O_o=>{});
			message.channel.send(sayMessage);
			}else{
				message.channel.send("**erreur** Tu n'est pas mon créateur")
			}	
	}
		
		if (message.content.startsWith(prefix + "ping")) {
			message.channel.send('Pong...').then((msg) => {
				msg.edit(`Pong! La latence est de ${msg.createdTimestamp - message.createdTimestamp}ms. La latence de l'API est de ${Math.round(bot.ping)}ms`);
		
		})
	}



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
 //       economy.fetchBalance('userID').then((i) => {
  //          console.log(i) // { userID: '144645791145918464', money: 998, lastDaily: 'Not Collected' }
   //         console.log(i.money) // 998
    //    });

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

if (msg.startsWith(`${prefix}PAY`)) {
    if (!args[0]) {
        message.channel.send(`**Vous devez définir un montant. Utilisation: /PAY <montant>**`);
        return;
    }

    if (isNaN(args[0])) {
        message.channel.send(`**Le montant doit être un nombre. Utilisation /PAY <montant>**`);
        return; 
   }

    if (message.content.includes("-")) {
        message.channel.sendMessage("**Vous n'avez pas le droit de vous rajouté de l'argent**");
        return;
    }

    economy.updateBalance(message.author.id + message.guild.id, parseInt(-args[0])).then((i) => { 
        message.channel.send(`**${args[0]}$ ont étais soustrait a votre compte.**`)
   });

}

if (message.content.startsWith(prefix + 'plaque')){
    var plaque = message.content.substr(8);
    if (!plaque){
        plaque = "Indeterminé";
    }else{
        if (voituredb.get("voiture").find({voitureID: plaque}).value()){
        console.log("Voiture trouvé")
        var info = voituredb.get("voiture").filter({voitureID: plaque}).find("name", "marque", "couleur", "année").value();
        var plaqueinfo = Object.values(info);
 
    message.channel.sendMessage('', { embed: {
        color: 16711680,
        author: {
            name: '',
            icon_url: '',
        },
        title: `${message.guild.name} concessionaire`,
        url: '',
        fields: [
            {
                name: `Plauqe`,
                value: `${plaqueinfo[0]}`, 
            },{
                name: 'Titulaire de la voiture',
                value: `${plaqueinfo[1]}`, 
            },{
                name: 'Marque de la voiture',
                value: `${plaqueinfo[2]}`,
            },{
                name: 'Couleur de la voiture',
                value: `${plaqueinfo[3]}`,
            },{
                name: 'Année de la voiture',
                value: `${plaqueinfo[4]}`,
            },
        ],
        footer: {
            icon_url: '',
            text: ``
    },
    }})

}
}
   }

   if (message.content.startsWith(prefix + 'newplaque')){
    if (!args[4]){
       return message.channel.send("Pour enregistré votre voiture veuillez faire /newplaque <plaque> <votre-speudo> <marque> <couleur> <année>\nRemplacer les espaces pas des tirés -");
    } 
    let voiture = JSON.parse(fs.readFileSync("./voiture.json", "utf8"));
    if (voiture[profilID = message.author.id]){
        return message.channel.send("Cette plaque d'imatriculation est déja enregistré. Veuillez contacté MrFlakou ou yoyoazs si cette plaque vous appartient");
    }
    voituredb.get("voiture").push({profilID: message.author.id, voitureID : args[0], name: args[1], marque: args[2], couleur: args[3], année: args[4],}).write()
        message.channel.send(`Votre plaque d'immatriculation a bien étais enregistré pour la voiture de type ${args[2]}, de couleur ${args[3]}, de l'année ${args[4]}, sous le nom de ${args[1]}`)
   }

   if (message.content.startsWith(prefix + "alerte")) {
    var alerte = message.content.substr(8);
    if (!alerte){
        return message.channel.send("Merci de bien voulloir spécifier une plaque d'immatriculation")
    }else{
        if (voituredb.get("voiture").find({voitureID: alerte}).value()){
        console.log("Voiture trouvé")
        var info = voituredb.get("voiture").filter({voitureID: alerte}).find("name", "marque", "couleur", "année").value();
        var plaqueinfo = Object.values(info);
        message.channel.send(`La voiture immatriculé ${plaqueinfo[0]}, de la marque ${plaqueinfo[2]}, de couleur ${plaqueinfo[3]} et qui date de ${plaqueinfo[4]} appartien a ${plaqueinfo[1]}. Si vous voyez se véhicule merci de nous compter au 112 ou au 15.`)
   }
}}
if (message.content.toUpperCase() === `${prefix}DAYPAY`) {
    if (talkedRecently.has(message.author.id)) {
        message.channel.send("Tu peut faire cette commande une fois par jours. - " + message.author);return;
} else {
    if (message.member.roles.find("name", modRole)){
     economy.updateBalance(message.author.id, 200).then((i) => { // economy.updateBalance grabs the (userID, value) value being how much you want to add, and puts it into 'i'.
    message.channel.send(`**You got $200!**\n**New Balance:** ${i.money}`);

    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 86400000); return;
    }
    
     )}
     if (message.member.roles.find("name", pompierRole)){
        economy.updateBalance(message.author.id, 500).then((i) => { // economy.updateBalance grabs the (userID, value) value being how much you want to add, and puts it into 'i'.
       message.channel.send(`**You got $500!**\n**New Balance:** ${i.money}`);
       talkedRecently.add(message.author.id);
       setTimeout(() => {
         talkedRecently.delete(message.author.id);
       }, 86400000); return;
       }
        )}
    }
}

 
    if (message.content.startsWith(prefix + 'newcarte')){
        var num = Math.floor((Math.random() * 9999999) + 1);
        if (!args[6]){
           return message.channel.send("Pour vous enregistré auprés de la mairie veuillez faire cette commande avec les données suivantes: /newcarte <nom> <prénom> <sexe(F ou M)> <née le> <ville> <taille> <nationalité>  ");
        }        
        cartedb.get("carte").push({carteID: firstMentioned.id, carteimage: message.author.avatarURL, nom : args[0], prénom: args[1], sexe: args[2], née_le: args[3], ville: args[4], taille: args[5], nationalité: args[6], num: num}).write()
            message.channel.send(`Vous avez bien étais inscrit a la mairie.`)
       }
       if (message.content.startsWith(prefix + 'carte')){
        var carte = message.content.substr(7);
        if (!carte){
            carte = "Indeterminé";
        }else{
            if (cartedb.get("carte").find({carteID: carte}).value()){
            console.log("Voiture trouvé")
            var info = cartedb.get("carte").filter({carteID: carte}).find("carteID", "carteimage", "nom", "prénom", "sexe", "née_le", "ville", "taille", "nationalité", "num").value();
            var carteinfo = Object.values(info);
     
        message.channel.sendMessage('', { embed: {
            color: 16711680,
            author: {
                name: '',
                icon_url: '',
            },
            title: `${message.guild.name} république`,
            url: '',
            fields: [
                {
                    name: ``,
                    value: `${carteinfo[1]}`, 
                },{
                    name: 'Nom',
                    value: `${carteinfo[2]}`, 
                    inline: true
                },{
                    name: 'Prénom',
                    value: `${carteinfo[3]}`,
                },{
                    name: 'Sexe',
                    value: `${carteinfo[4]}`,
                },{
                    name: 'Née le',
                    value: `${carteinfo[5]}`,
                    inline: true
                },{
                    name: 'A',
                    value: `${carteinfo[6]}`,
                },{
                    name: 'Taille',
                    value: `${carteinfo[7]}`,
                }
            ],
            footer: {
                icon_url: '',
                text: ``
        },
        }})
    
    }
    }
       }

       if(message.content.startsWith(prefix + "help")){

        let commande = arg[1]
                    
        if (!commande) {
        (async function() {
        
         const mainMessage = await message.channel.send("Voici la commande Help, clique sur les différent réaction pour voir les commandes et les information!");
        
        await mainMessage.react("🔨");
        await mainMessage.react("📡");
        await mainMessage.react("💻");
        await mainMessage.react("🎰");
        await mainMessage.react("🎮");
        await mainMessage.react("📻");
        await mainMessage.react("➕");
        await mainMessage.react("🎉");
        await mainMessage.react("🛑");
        
        const panier = mainMessage.createReactionCollector((reaction, user) => user.id === message.author.id);
         
        panier.on('collect', async(reaction) => 
        {
        if (reaction.emoji.name === "🔨") {
        
        mainMessage.edit("Ce bot a étais créé par yoyoazs77 pour le serveur discord de FlarYonRP. Ce bot gére votre économie, enregistre votre plaque d'imatriculation et votre carte d'identité.");				
         }
        if (reaction.emoji.name === "📡") {
        
        mainMessage.edit("**La partie économie du bot contient plusieurs commandes:**\n'/money' vous permet de votre compte en banque.\n'/pay' vous permet de vous retirez de l'argent de votre compte en banque.\n'/addmoney' permet aux banquiers de rajouté ou d'enlevé de l'argent a n'importe qui.\n'/daypay' permet de recevoire votre pay du jour.");					 
        }
        if (reaction.emoji.name === "💻") {

            mainMessage.edit("**La partie roleplay du bot contient quelques commandes:**\n'/newplaque' vous permez d'enregistrez votre plaque d'imatriculation.\n'/plaque' permet d'aquérir les informations d'une plaque d'imatriculation.\n'/alerte' permet aux policiers d'alerté les citoyens d'un vole de voitures.\n'/newcarte' permet d'enregistrez votre carte d'identité.\n'/carte' permet d'aquérir les information d'une carte d'identité.")
        }
        if (reaction.emoji.name === "🎰") {

        mainMessage.edit("**La partie information:**\n'/site' vous permet d'avoir le lien internet du site du serveur FlarYonRP gta5.\n'/plainte' vous permet de déposser plainte.\n'/ping' vous permet de voir votre latence.")
        }
        if (reaction.emoji.name === "🎮") {
            
        mainMessage.edit("Pour avoir une information sur une commande faite /help (commande)")
        }
        if (reaction.emoji.name === "🛑") {
        
        mainMessage.delete()
        
         }
        
         await reaction.remove(message.author.id);
        
        });
         }());
         return;
        }

    if (commande === 'money') {
        return message.channel.send("La commande '/money' est enregistré dans une database qui est lié au serveur discord cela veut dire que si vous utilisé ce bot la dans un autre serveur pour vous rajouté de l'argent cela ne changera pas sur ce serveur discord !")
    }
    if (commande === 'newplaque') {
        return message.channel.send("Pour utilisé la commande '/newplaque' il vous faut indiqué les information suivante et dans le même ordres: <plaque> <votre-speudo> <marque> <couleur> <année>")
    }
    if (commande === 'newcarte') {
        return message.channel.send("Pour utilisé la commande '/newcarte' il vous faut indiqué les information suivante et dans le même ordres: <nom> <prénom> <sexe(F ou M)> <née le> <ville> <taille> <nationalité> ")
    }
    if (commande === 'daypay') {
        return message.channel.send("Cette commande vous permet de recevoire votre pay du jour par rapport a votre travail !")
    }
    if (commande ===! 'money'||'newplaque'||'newcarte'||'daypay'){
        return message.channel.send("Cette fonctionalité fonctionne que pour les commandess 'money', 'newplaque', 'newcarte' et 'payday' d'autres commandes seront bientôt rajouté.")
    }
}
})
