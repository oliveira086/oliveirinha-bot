module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('Num ouvi direito o som ta muito alto...');
		if (!serverQueue) return message.channel.send('Ainda bem não aguentava mais!');
		serverQueue.connection.dispatcher.end();
	},
};