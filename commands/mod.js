const { SlashCommandBuilder } = require('@discordjs/builders');
const { watchFile } = require('fs');
const { waitForDebugger } = require('inspector');
const { urlToHttpOptions } = require('url');
const { MessageActionRow, MessageButton, MessageEmbed, MessageAttachment, Message} = require('discord.js');
const wait = require('util').promisify(setTimeout);
let db = require('quick.db');


module.exports = {

    data: new SlashCommandBuilder()
    .setName('mod')
    .setDescription('cheat engine'),

    async execute(interaction) {
		
		//begin variables for booster packs and Player data
		let PlayerCredits = db.get(`credits.${interaction.user.id}`) || 0;
		let Generation1BoosterPack = db.get(`gen1booster.${interaction.user.id}`) || 0;
		let BurningShadowsBoosterPack = db.get(`burningshadowsbooster.${interaction.user.id}`) || 0;
	
		const shopping = new MessageActionRow().addComponents(
			  	new MessageButton()
					.setCustomId('addmoney')
					.setLabel('addmoney')
					.setStyle('SUCCESS')
					.setEmoji('933078903986212984'),
                new MessageButton()
                    .setCustomId('zero')
                    .setLabel('initialize booster packs')
                    .setStyle('DANGER')
                    .setEmoji('933078903986212984'),	
			);
		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle("Cheat Boi")
			.setDescription('Add 10,000 monies')
			
		await interaction.reply({ ephemeral: true, embeds: [embed], components: [shopping] });
		
        const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({filter, time: 168000 });

		collector.on('collect', async i => {
		if (i.customId === 'addmoney'){
			
			db.add(`credits.${interaction.user.id}`, 10000);
			const newEmbed = new MessageEmbed()
			.setColor('#57F287')
			.setTitle("Cheated woo hoo!")
			await i.deferUpdate();
			await i.editReply({ ephermal: true, embeds: [newEmbed], components: []});
			collector.stop();	
		}
        else if (i.customId === 'zero'){
			
			db.subtract(`gen1booster.${interaction.user.id}`, `${Generation1BoosterPack}`);
            db.subtract(`burningshadowsbooster.${interaction.user.id}`, `${BurningShadowsBoosterPack}`);
			const newEmbed = new MessageEmbed()
			.setColor('#57F287')
			.setTitle("Cheated woo hoo!")
			await i.deferUpdate();
			await i.editReply({ ephermal: true, embeds: [newEmbed], components: []});
			collector.stop();	
		}
		
		});

		
	},

};