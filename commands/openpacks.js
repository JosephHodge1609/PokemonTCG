const { SlashCommandBuilder } = require('@discordjs/builders');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');
const { urlToHttpOptions } = require('url');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, MessageSelectMenu, Collector} = require('discord.js');
const wait = require('util').promisify(setTimeout);
let db = require('quick.db');


module.exports = {

    data: new SlashCommandBuilder()
    .setName('open')
    .setDescription('Select which of the booster packs you own to open!'),

    async execute(interaction) {
		//begin variables for booster packs and Player data
		let PlayerCredits = db.get(`credits.${interaction.user.id}`) || 0;
		let Generation1BoosterPack = db.get(`gen1booster.${interaction.user.id}`) || 0;
		let BurningShadowsBoosterPack = db.get(`burningshadowsbooster.${interaction.user.id}`) || 0;
        let BoosterCycle = [Generation1BoosterPack, BurningShadowsBoosterPack];
		let BoosterCycleLabels = ["Open Base Set", "Open Burning Shadows"];
        let BoosterCycleDescriptions = ["Opens base set booster pack", "Opens burning shadows booster pack"];
        let BoosterCycleValue = ["Open", "Open Shadows"];
        //end variables for booster packs and player data

        //List of pokemon card images for generation one only

    // common cards 53% chance of pulling 38 commons total
    let gen1cardscommon = ['./images/gen1cards/Abra.png', './images/gen1cards/Bulbasaur.png', './images/gen1cards/Caterpie.png', './images/gen1cards/Charmander.png', 
    './images/gen1cards/Diglett.png','./images/gen1cards/Doduo.png', './images/gen1cards/Drowzee.png', './images/gen1cards/Gastly.png', './images/gen1cards/Koffing.png', 
    './images/gen1cards/Machop.png', './images/gen1cards/Magnemite.png','./images/gen1cards/Metapod.png', './images/gen1cards/Nidoran-male.png', './images/gen1cards/Onix.png', 
    './images/gen1cards/Pidgey.png', './images/gen1cards/Pikachu.png', './images/gen1cards/Poliwag.png','./images/gen1cards/Ponyta.png', './images/gen1cards/Rattata.png', 
    './images/gen1cards/Sandshrew.png', './images/gen1cards/Squirtle.png', './images/gen1cards/Starmie.png','./images/gen1cards/Staryu.png','./images/gen1cards/Tangela.png',
     './images/gen1cards/Voltorb.png', './images/gen1cards/Vulpix.png', './images/gen1cards/Weedle.png', './images/gen1cards/Bill.png', './images/gen1cards/Energy-Removal.png',
    './images/gen1cards/Gust-Of-Wind.png', './images/gen1cards/Potion.png', './images/gen1cards/Switch.png', './images/gen1cards/Fighting-Energy.png','./images/gen1cards/Fire-Energy.png', 
    './images/gen1cards/Grass-Energy.png','./images/gen1cards/Lightning-Energy.png', './images/gen1cards/Psychic-Energy.png', './images/gen1cards/Water-Energy.png']

    let gen1cardscommonattachment = ['attachment://Abra.png', 'attachment://Bulbasaur.png', 'attachment://Caterpie.png', 'attachment://Charmander.png', 'attachment://Diglett.png',
    'attachment://Doduo.png', 'attachment://Drowzee.png', 'attachment://Gastly.png', 'attachment://Koffing.png', 'attachment://Machop.png', 'attachment://Magnemite.png',
    'attachment://Metapod.png', 'attachment://Nidoran-male.png', 'attachment://Onix.png', 'attachment://Pidgey.png', 'attachment://Pikachu.png', 'attachment://Poliwag.png',
    'attachment://Ponyta.png', 'attachment://Rattata.png', 'attachment://Sandshrew.png', 'attachment://Squirtle.png', 'attachment://Starmie.png','attachment://Staryu.png',
    'attachment://Tangela.png','attachment://Voltorb.png', 'attachment://Vulpix.png', 'attachment://Weedle.png', 'attachment://Bill.png', 'attachment://Energy-Removal.png',
    'attachment://Gust-Of-Wind.png', 'attachment://Potion.png', 'attachment://Switch.png', 'attachment://Fighting-Energy.png','attachment://Fire-Energy.png', 
    'attachment://Grass-Energy.png','attachment://Lightning-Energy.png', 'attachment://Psychic-Energy.png', 'attachment://Water-Energy.png']

    // uncommon cards 32% chance of pulling  32 uncommon total
    let gen1cardsuncommon= ['./images/gen1cards/Arcanine.png', './images/gen1cards/Charmeleon.png', './images/gen1cards/Dewgong.png', './images/gen1cards/Dratini.png', 
    './images/gen1cards/Farfetchd.png','./images/gen1cards/Growlithe.png', './images/gen1cards/Haunter.png', './images/gen1cards/Ivysaur.png', './images/gen1cards/Jynx.png',
     './images/gen1cards/Kadabra.png', './images/gen1cards/Kakuna.png','./images/gen1cards/Machoke.png', './images/gen1cards/Magikarp.png', './images/gen1cards/Magmar.png', 
     './images/gen1cards/Nidorino.png', './images/gen1cards/Poliwhirl.png', './images/gen1cards/Porygon.png','./images/gen1cards/Raticate.png', './images/gen1cards/Seel.png', 
     './images/gen1cards/Wartortle.png', './images/gen1cards/Defender.png','./images/gen1cards/Energy-Retrieval.png', './images/gen1cards/Full-Heal.png',
    './images/gen1cards/Maintenance.png', './images/gen1cards/PlusPower.png', './images/gen1cards/Pokemon-Center.png', './images/gen1cards/Pokemon-Flute.png', './images/gen1cards/Pokedex.png',
     './images/gen1cards/Professor-Oak.png','./images/gen1cards/Revive.png', './images/gen1cards/Super-Potion.png','./images/gen1cards/Double-Colorless-Energy.png']

     let gen1cardsuncommonattachment= ['attachment://Arcanine.png', 'attachment://Charmeleon.png', 'attachment://Dewgong.png', 'attachment://Dratini.png', 
    'attachment://Farfetchd.png','attachment://Growlithe.png', 'attachment://Haunter.png', 'attachment://Ivysaur.png', 'attachment://Jynx.png',
     'attachment://Kadabra.png', 'attachment://Kakuna.png','attachment://Machoke.png', 'attachment://Magikarp.png', 'attachment://Magmar.png', 
     'attachment://Nidorino.png', 'attachment://Poliwhirl.png', 'attachment://Porygon.png','attachment://Raticate.png', 'attachment://Seel.png', 
     'attachment://Wartortle.png', 'attachment://Defender.png','attachment://Energy-Retrieval.png', 'attachment://Full-Heal.png',
    'attachment://Maintenance.png', 'attachment://PlusPower.png', 'attachment://Pokemon-Center.png', 'attachment://Pokemon-Flute.png', 'attachment://Pokedex.png',
     'attachment://Professor-Oak.png','attachment://Revive.png', 'attachment://Super-Potion.png','attachment://Double-Colorless-Energy.png']

    //rare cards 15% chance of pulling  32 rares total
    let gen1cardsrare = ['./images/gen1cards/Alakazam.png', './images/gen1cards/Blastoise.png', './images/gen1cards/Chansey.png', './images/gen1cards/Charizard.png', 
    './images/gen1cards/Clefairy.png','./images/gen1cards/Gyarados.png', './images/gen1cards/Hitmonchan.png', './images/gen1cards/Machamp.png', './images/gen1cards/Magneton.png', 
    './images/gen1cards/Mewtwo.png', './images/gen1cards/Nidoking.png','./images/gen1cards/Ninetales.png', './images/gen1cards/Poliwrath.png', './images/gen1cards/Raichu.png',
     './images/gen1cards/Venusaur.png', './images/gen1cards/Zapdos.png', './images/gen1cards/Beedrill.png','./images/gen1cards/Dragonair.png', './images/gen1cards/Dugtrio.png', 
     './images/gen1cards/Electabuzz.png', './images/gen1cards/Electrode.png', './images/gen1cards/Pidgeotto.png', './images/gen1cards/Clefairy-Doll.png',
     './images/gen1cards/Computer-Search.png', './images/gen1cards/Devolution-Spray.png', './images/gen1cards/Imposter-Professor-Oak.png', './images/gen1cards/Item-Finder.png', 
     './images/gen1cards/Lass.png', './images/gen1cards/Pokemon-Breeder.png','./images/gen1cards/Pokemon-Trader.png', './images/gen1cards/Scoop-Up.png', 
     './images/gen1cards/Super-Energy-Removal.png']

     let gen1cardsrareattachment = ['attachment://Alakazam.png', 'attachment://Blastoise.png', 'attachment://Chansey.png', 'attachment://Charizard.png', 
    'attachment://Clefairy.png','attachment://Gyarados.png', 'attachment://Hitmonchan.png', 'attachment://Machamp.png', 'attachment://Magneton.png', 
    'attachment://Mewtwo.png', 'attachment://Nidoking.png','attachment://Ninetales.png', 'attachment://Poliwrath.png', 'attachment://Raichu.png',
     'attachment://Venusaur.png', 'attachment://Zapdos.png', 'attachment://Beedrill.png','attachment://Dragonair.png', 'attachment://Dugtrio.png', 
     'attachment://Electabuzz.png', 'attachment://Electrode.png', 'attachment://Pidgeotto.png', 'attachment://Clefairy-Doll.png',
     'attachment://Computer-Search.png', 'attachment://Devolution-Spray.png', 'attachment://Imposter-Professor-Oak.png', 'attachment://Item-Finder.png', 
     'attachment://Lass.png', 'attachment://Pokemon-Breeder.png','attachment://Pokemon-Trader.png', 'attachment://Scoop-Up.png', 
     'attachment://Super-Energy-Removal.png']
    //end List of pokemon card images for generation one only
        let CollectedCards = []; //this is the storage that will get 10 cards for the user to see once it's complete
        let CollectedCardsattachment = []; //this is the storage that will get 10 cards for the user to see once it's complete attaches to embed

        let options = [{ label: `Cancel`, description: `Leaves the menu`, value: "Menu cancelled" }];

        for(let i = 0; i < BoosterCycle.length; i++){
			if(BoosterCycle[i] >= 1){
				options.push({ label: `${BoosterCycleLabels[i]}`, description: `${BoosterCycleDescriptions[i]}`, value: `${BoosterCycleValue[i]}` }); 
			}
		}

		const OpenPacks = new MessageActionRow().addComponents(
             new MessageSelectMenu()
            .setCustomId('open')
            .setPlaceholder('Please select a booster')
            .addOptions(options)
        );
       
        await interaction.reply({ephemeral: true, content: "Please select a booster to open", components: [OpenPacks]});

        const filter = (m) => m.user.id == interaction.user.id 
		const collector = interaction.channel.createMessageComponentCollector({filter, time: 178000 });
        collector.on('collect', async i => {
            const value = i.values[0];
    switch(value){
    case 'Menu cancelled':
                    collector.stop();
                    await i.deferUpdate();
                    await interaction.editReply({ ephemeral: true, components: [], content: value });
    break;
    case 'Open':
                    collector.stop();
                    let CheckOutRare = "Please be something good!";
                    //begin adding cards to the player!
                    let CardSelectorCommon = (Math.round(Math.random() * (gen1cardscommon.length - 1))); //generates a random number to land on a specific image
                    let CardSelectorUncommon = (Math.round(Math.random() * (gen1cardsuncommon.length - 1))); //generates a random number to land on a specific image
                    let CardSelectorRare = (Math.round(Math.random() * (gen1cardsrare.length - 1))); //generates a random number to land on a specific image
                    for(let i = 0; i <= 5; i++){
                        CardSelectorCommon = (Math.round(Math.random() * (gen1cardscommon.length - 1)));
                        CollectedCards.forEach(Check => {
                            if(Check === gen1cardscommon[CardSelectorCommon]){
                                do {
                                    CardSelectorCommon = (Math.round(Math.random() * (gen1cardscommon.length - 1)));
                                }while(Check === gen1cardscommon[CardSelectorCommon]);
                                
                                console.log(`rerolled was: ${Check} it is now ${gen1cardscommon[CardSelectorCommon]}`);
                            }
                        })
                        CollectedCards.push(gen1cardscommon[CardSelectorCommon]);
                        CollectedCardsattachment.push(gen1cardscommonattachment[CardSelectorCommon]);
                    }
                    for(let i = 0; i <= 2; i++){
                        CardSelectorUncommon = (Math.round(Math.random() * (gen1cardsuncommon.length - 1)));
                        CollectedCards.forEach(Check => {
                            if(Check === gen1cardsuncommon[CardSelectorUncommon]){
                                do {
                                    CardSelectorUncommon = (Math.round(Math.random() * (gen1cardsuncommon.length - 1)));
                                }while(Check === gen1cardsuncommon[CardSelectorUncommon]);
                               
                                console.log(`rerolled was: ${Check} it is now ${gen1cardsuncommon[CardSelectorUncommon]}`);
                            }
                        })
                        CollectedCards.push(gen1cardsuncommon[CardSelectorUncommon]);
                        CollectedCardsattachment.push(gen1cardsuncommonattachment[CardSelectorUncommon]);
                    }
                    CardSelectorRare = (Math.round(Math.random() * (gen1cardsrare.length - 1)));
                        
                        CollectedCards.push(gen1cardsrare[CardSelectorRare]);
                        CollectedCardsattachment.push(gen1cardsrareattachment[CardSelectorRare]);
                  
                    //end adding cards to the player!
                    let PositionCounter = 0; // this will keep track of which card the user is currently looking at using buttons
                    const ViewingCards = new MessageActionRow().addComponents(
                        new MessageButton()
                          .setCustomId('previous')
                          .setLabel('previous')
                          .setStyle('SUCCESS')
                          .setEmoji('933078903986212984'),
                      new MessageButton()
                          .setCustomId('next')
                          .setLabel('next')
                          .setStyle('SUCCESS')
                          .setEmoji('933078903986212984'),
                      new MessageButton()
                          .setCustomId('exit')
                          .setLabel('Exit')
                          .setStyle('DANGER')
                          .setEmoji('933078903986212984')
                  );
                    const attachment = new MessageAttachment(CollectedCards[PositionCounter]);
                    const InventoryEmbed = new MessageEmbed()
                    .setColor("#57F287")
                    .setImage(`${CollectedCardsattachment[PositionCounter]}`)
                    await i.deferUpdate();
                    await interaction.editReply({ephermal: true, embeds: [InventoryEmbed], files: [attachment], content: "Check these cards out!", components: [ViewingCards]});

                    const filter = i => i.user.id === interaction.user.id;
                    const collector2 = interaction.channel.createMessageComponentCollector({filter, time: 368000 });
                    collector2.on('collect', async i => {
                         if(i.customId === 'previous'){
                            if(!PositionCounter <= 0){
                                PositionCounter--;
                                CheckOutRare = `Card ${PositionCounter+1}/${CollectedCards.length}`;
                            }
                            
                            const attachment = new MessageAttachment(CollectedCards[PositionCounter])
                            const newEmbed = new MessageEmbed()
                            .setColor('#57F287')
                            .setImage(CollectedCardsattachment[PositionCounter]);
                            await i.deferUpdate();
                            await i.editReply({ephermal: true, content: `${CheckOutRare}`, embeds: [newEmbed], files: [attachment], components: [ViewingCards]});
                        }
                        else if(i.customId === 'next'){
                            if(PositionCounter < 9 ){
                               
                                
                                PositionCounter++;
                                CheckOutRare = `Card ${PositionCounter+1}/${CollectedCards.length}`;
                                if(PositionCounter === 9){
                                    CheckOutRare = "Did you get the rare you were looking for?";
                                }
                            }
                          
                            else if(PositionCounter === 9){
                                CheckOutRare = "There are no more cards left to view, you can click previous to go back or exit."
                            }
                            
                            const attachment = new MessageAttachment(CollectedCards[PositionCounter])
                            const newEmbed = new MessageEmbed()
                            .setColor('#57F287')
                            .setImage(CollectedCardsattachment[PositionCounter]);
                            await i.deferUpdate();
                            await i.editReply({ephermal: true, content: `${CheckOutRare}`, embeds: [newEmbed], files: [attachment], components: [ViewingCards]});
                        }
                        else if(i.customId === 'exit'){
                            await i.deferUpdate();
                            await i.editReply({ephermal: true, content: "Exited viewing", components: [], embeds: [], files: []});
                            collector2.stop();
                        }
                
                        });
    break;

    case 'Open Shadows':
                    collector.stop();
                    await i.deferUpdate();
                    await interaction.editReply({ ephemeral: true, components: [], content: "Content is not yet available for Burning Shadows, try Base Set!" });
    break;
            }//end of switch

            
        });//first collector.on


		
	},//execute interaction

};
