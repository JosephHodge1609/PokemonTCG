const fs = require('fs');
const { Client, Collection, Intents, VoiceChannel, MessageAttachment } = require('discord.js');
const { token } = require('./config.json');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer,  NoSubscriberBehavior, createAudioResource,AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_PRESENCES
    ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});



/*
client.on('messageCreate', message => {
	const resource = createAudioResource('music/hop.mp3');
		const player = createAudioPlayer();
		const connection =  joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator
			
		})
		
		if(message.content === '!play'){
		connection.subscribe(player);
		player.play(resource);
	
		}
	
	
		
		connection.on(VoiceConnectionStatus.Ready, () => {
			console.log('Connection is in the Ready state!');
		});
		
		player.on(AudioPlayerStatus.Playing, () => {
			
		});
	
})
*/


client.login(token);


