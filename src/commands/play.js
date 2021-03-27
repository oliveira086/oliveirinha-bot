const ytdl = require("ytdl-core");

function validateSofrencia (music) {
  let arrayMusic = music.split(' ');
  let ePedrada = false
  arrayMusic.map(x => {
    console.log(x)
    switch(x) {
      case 'Tarcísio':
        ePedrada = true
        break
      case 'HACKEARAM-ME':
        ePedrada = 'essa não'
        break
      case 'Marilia':
        ePedrada = true
        break
      case 'Kabral':
        ePedrada = true
        break
      case 'Grupo':
        ePedrada = 'padogin'
        break
      case "BK'":
        ePedrada = 'o deos do rap';
        break
    }
  })
  return ePedrada
}


module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "Como e que tu quer ouvir a cantiga sem ter ouvido?"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "Meu patrão não tenho permissão pra cantar nessa seresta..."
        );
      }

      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
      };

      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `Beleza! Adicionei ${song.title} aqui na fila`
        );
      }
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(message, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    let ePedra = validateSofrencia(song.title);
    switch (ePedra) {
      case 'essa não':
        serverQueue.textChannel.send(`NUM TOCA ESSA NÃO MEU PATRÃO: **${song.title}**`);
        break
      case true:
        serverQueue.textChannel.send(`OOOOOOOOOOOOOh pedra meu amigo: **${song.title}**`);
        break
      case false:
        serverQueue.textChannel.send(`Ouve essa pedrada: **${song.title}**`);
        break
      case 'pagodin':
        serverQueue.textChannel.send(`Pagodin nois gosta: **${song.title}**`);
      case 'e o deos do rap':
        serverQueue.textChannel.send(`O MAIS BRABO: **${song.title}**`);
        break
    }
  }

};