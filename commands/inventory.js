const { SlashCommandBuilder } = require('@discordjs/builders');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');
const { urlToHttpOptions } = require('url');
let db = require('quick.db');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment} = require('discord.js');
const wait = require('util').promisify(setTimeout);
module.exports = {
    
	
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Access the store to purchase booster packs'),
		
	async execute(interaction) {
		let PlayerCredits = db.get(`credits.${interaction.user.id}`) || 0;
		let Generation1BoosterPack = db.get(`gen1booster.${interaction.user.id}`) || 0;
		let BurningShadowsBoosterPack = db.get(`burningshadowsbooster.${interaction.user.id}`) || 0;
		let BoosterCycle = [Generation1BoosterPack, BurningShadowsBoosterPack];
		let BoosterCycleNames = ["Base Set ", "Burning Shadows "];
		const attachment = new MessageAttachment('images/main/Pokeball.png');
		const InventoryEmbed = new MessageEmbed()
		.setColor("#0099ff")
		.setTitle("Inventory")
		.setThumbnail('attachment://Pokeball.png')
		.setFields(
			{name: "Player Name", value: `${interaction.member}`, inline: true},
			{name: "Credits ", value: `${PlayerCredits}`, inline: false},
		)
		for(let i = 0; i < BoosterCycle.length; i++){
			if(BoosterCycle[i] >= 1){
				InventoryEmbed.addField( `${BoosterCycleNames[i]}`, `${BoosterCycle[i]}`, true);
			}
		}
		await interaction.reply({ ephemeral: true, embeds: [InventoryEmbed], files: [attachment]});
	},

	
};

