module.exports = {
	name: 'nowplaying',
	description: 'Get the song that is playing.',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!serverQueue) return message.channel.send('Num ta tocando nada meu patrão.');
		return message.channel.send(`Está e a pérola da vez: ${serverQueue.songs[0].title}`);
	},
};