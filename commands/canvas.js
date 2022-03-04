const { SlashCommandBuilder } = require('@discordjs/builders');
const { watchFile } = require('fs');
const Canvas = require('canvas');
const { waitForDebugger } = require('inspector');
const { urlToHttpOptions } = require('url');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, MessageSelectMenu, Collector, CommandInteractionOptionResolver} = require('discord.js');
const wait = require('util').promisify(setTimeout);
let db = require('quick.db');
const { Console } = require('console');
const { CommandSet } = require('discord-routes');



module.exports = {
data: new SlashCommandBuilder()
.setName('canvas')
.setDescription('Select which of the booster packs you own to open!'),

async execute(interaction) {
    let OwnedCards = [];
    var CommonCards = ["gen1abra", "gen1bulbasaur", "gen1caterpie", "gen1charmander", "gen1diglett", "gen1doduo", "gen1drowzee", "gen1gastly", "gen1koffing", "gen1machop"
    , "gen1magnemite", "gen1metapod", "gen1nidoranmale", "gen1onix", "gen1pidgey", "gen1pikachu", "gen1poliwag", "gen1ponyta", "gen1rattata", "gen1sandshrew"
    , "gen1squirtle", "gen1starmie", "gen1staryu", "gen1tangela", "gen1voltorb", "gen1vulpix", "gen1weedle", "gen1bill", "gen1energyremoval", "gen1gustofwind", "gen1potion",
    "gen1switch", "gen1fightingenergy", "gen1fireenergy", "gen1grassenergy", "gen1lightningenergy", "gen1psychicenergy", "gen1waterenergy"];
    var gen1cardscommon = ['./images/gen1cards/Abra.png', './images/gen1cards/Bulbasaur.png', './images/gen1cards/Caterpie.png', './images/gen1cards/Charmander.png', 
    './images/gen1cards/Diglett.png','./images/gen1cards/Doduo.png', './images/gen1cards/Drowzee.png', './images/gen1cards/Gastly.png', './images/gen1cards/Koffing.png', 
    './images/gen1cards/Machop.png', './images/gen1cards/Magnemite.png','./images/gen1cards/Metapod.png', './images/gen1cards/Nidoran-male.png', './images/gen1cards/Onix.png', 
    './images/gen1cards/Pidgey.png', './images/gen1cards/Pikachu.png', './images/gen1cards/Poliwag.png','./images/gen1cards/Ponyta.png', './images/gen1cards/Rattata.png', 
    './images/gen1cards/Sandshrew.png', './images/gen1cards/Squirtle.png', './images/gen1cards/Starmie.png','./images/gen1cards/Staryu.png','./images/gen1cards/Tangela.png',
    './images/gen1cards/Voltorb.png', './images/gen1cards/Vulpix.png', './images/gen1cards/Weedle.png', './images/gen1cards/Bill.png', './images/gen1cards/Energy-Removal.png',
    './images/gen1cards/Gust-Of-Wind.png', './images/gen1cards/Potion.png', './images/gen1cards/Switch.png', './images/gen1cards/Fighting-Energy.png','./images/gen1cards/Fire-Energy.png', 
    './images/gen1cards/Grass-Energy.png','./images/gen1cards/Lightning-Energy.png', './images/gen1cards/Psychic-Energy.png', './images/gen1cards/Water-Energy.png']
    let CardsHave = 0;
    let Sheets = [];
    let cardcountercommon = 0;
CommonCards.forEach(Card => {
    if(db.get(`${Card}.${interaction.user.id}`) >= 1){
    OwnedCards.push(gen1cardscommon[CardsHave]);
    cardcountercommon += 1;
    }
    CardsHave++;
});
console.log(`Ownmed Cards : ${OwnedCards.length}`);
var leftright = 20;
var updown = 10;
var rowcounter = 0;
let card = 0;
let CardCounter = 1;
const pokemoncard = [];



for(let card =0; card <= 8; card++){
let CARD
let canvas = Canvas.createCanvas(1200, 1400);
let ctx = canvas.getContext('2d');
let background = await Canvas.loadImage('./images/background/collection.png');
ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
CARD = await Canvas.loadImage('./images/gen1cards/Gust-Of-Wind.png')
ctx.drawImage(CARD, leftright, updown, 350, 450);
let attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
Sheets.push(attachment);
}




let Page = 0;
const shopping = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('previous')
      .setLabel('previous')
      .setStyle('SECONDARY')
      .setEmoji('933078903986212984'),
  new MessageButton()
      .setCustomId('next')
      .setLabel('next')
      .setStyle('SECONDARY')
      .setEmoji('933078903986212984'),
  new MessageButton()
      .setCustomId('cancel')
      .setLabel('Stop viewing')
      .setStyle('DANGER')
      .setEmoji('933078903986212984')
);


await interaction.reply({ ephemeral: true, files: [Sheets[Page]], components: [shopping] });

const filter = i => i.user.id === interaction.user.id;
const collector = interaction.channel.createMessageComponentCollector({filter, time: 168000 });

collector.on('collect', async i => {

 if(i.customId === 'previous'){
Page--;


await i.deferUpdate();
await i.editReply({ephermal: true, content: "Your cards", files: [Sheets[Page]], components: [shopping]});
}
else if(i.customId === 'next'){
Page++;

await i.deferUpdate();
await i.editReply({ephermal: true, content: "Your cards", files: [Sheets[Page]], components: [shopping]});
}
else if(i.customId === 'cancel'){
await i.deferUpdate();
await i.editReply({ephermal: true, content: "Collection viewing ended", components: [], embeds: [], files: []});
collector.stop();
}

});

},
};

