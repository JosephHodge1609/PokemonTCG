const { SlashCommandBuilder } = require('@discordjs/builders');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');
const { urlToHttpOptions } = require('url');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, Message} = require('discord.js');
const wait = require('util').promisify(setTimeout);
let db = require('quick.db');
module.exports = {
    
	
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Access the store to purchase booster packs'),


		
	async execute(interaction) {
		//begin variables for booster packs and Player data
		let PlayerCredits = db.get(`credits.${interaction.user.id}`) || 0;
		let Generation1BoosterPack = db.get(`gen1booster.${interaction.user.id}`) || 0;
		let BurningShadowsBoosterPack = db.get(`burningshadowsbooster.${interaction.user.id}`) || 0;
		let boosterpacks = ['images/boosterpack/gen1.jpg', 'images/boosterpack/burningshadows.png'];
		let boosterpackattachments = ['attachment://gen1.jpg', 'attachment://burningshadows.png'];
		let boosterpackCounter = 0;
		let BoosterPackNames = ["Base Set ", "Burning Shadows "];
		let BoosterPackDBNames = ["gen1booster", "burningshadowsbooster"];
		//end variables for booster packs
		//begin bariables for booster pack prices
		var Generation1BoosterPackPrice = 500;
		var BurningShadowsBoosterPackPrice = 800;
		let BoosterPackPrices = [Generation1BoosterPackPrice, BurningShadowsBoosterPackPrice];
		//end variables for booster pack prices
		const shopping = new MessageActionRow().addComponents(
			  	new MessageButton()
					.setCustomId('previous')
					.setLabel('previous')
					.setStyle('SECONDARY')
					.setEmoji('933078903986212984'),
				new MessageButton()
					.setCustomId('purchase')
					.setLabel('purchase')
					.setStyle('SUCCESS')
					.setEmoji('933078903986212984'),
				new MessageButton()
					.setCustomId('next')
					.setLabel('next')
					.setStyle('SECONDARY')
					.setEmoji('933078903986212984'),
				new MessageButton()
					.setCustomId('cancel')
					.setLabel('leave shop')
					.setStyle('DANGER')
					.setEmoji('933078903986212984')
			);
			const attachment = new MessageAttachment(boosterpacks[boosterpackCounter]);
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Poke Shop")
			.setDescription('Purchase your booster packs!')
			.setImage(boosterpackattachments[boosterpackCounter]);
			
		 await interaction.reply({ ephemeral: true, embeds: [embed], files: [attachment], components: [shopping] });
		
        const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({filter, time: 168000 });

		collector.on('collect', async i => {
		if (i.customId === 'purchase'){
			if(PlayerCredits < BoosterPackPrices[boosterpackCounter]){
				await i.deferUpdate();
				await i.editReply({content: `Not enough credits! You'll need ${BoosterPackPrices[boosterpackCounter]} credits to purchase the ${BoosterPackNames[boosterpackCounter]} booster pack. Try purchasing a different boost pack`});
			}
			if(PlayerCredits > BoosterPackPrices[boosterpackCounter]){
			db.subtract(`credits.${interaction.user.id}`, BoosterPackPrices[boosterpackCounter]);
			db.add(`${BoosterPackDBNames[boosterpackCounter]}.${interaction.user.id}`, 1);
			const newEmbed = new MessageEmbed()
			.setColor('#57F287')
			.setTitle("Purchased!")
			await i.deferUpdate();
			await i.editReply({ ephermal: true, embeds: [newEmbed], components: [shopping]});
			}
			
		}
		else if(i.customId === 'previous'){
			if(!boosterpackCounter <= 0){
				boosterpackCounter--;
			}
			
			const attachment = new MessageAttachment(boosterpacks[boosterpackCounter])
			const newEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Poke Shop")
			.setDescription('Purchase your booster packs!')
			.setImage(boosterpackattachments[boosterpackCounter]);
			await i.deferUpdate();
			await i.editReply({ephermal: true, content: "Buy your packs here! So many memories!", embeds: [newEmbed], files: [attachment], components: [shopping]});
		}
		else if(i.customId === 'next'){
			if(!boosterpackCounter >= 1){
				boosterpackCounter++;
			}
			
			const attachment = new MessageAttachment(boosterpacks[boosterpackCounter])
			const newEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Poke Shop")
			.setDescription('Purchase your booster packs!')
			.setImage(boosterpackattachments[boosterpackCounter]);
			await i.deferUpdate();
			await i.editReply({ephermal: true, content: "Buy your packs here! So many memories!", embeds: [newEmbed], files: [attachment], components: [shopping]});
		}
		else if(i.customId === 'cancel'){
			await i.deferUpdate();
			await i.editReply({ephermal: true, content: "Shop closed.", components: [], embeds: [], files: []});
			collector.stop();
		}

		});

		
	},

	
};

