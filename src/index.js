const Discord = require('discord.js');
const youtube = require('ytdl-core');
const Functions = require('../util/functions');

const client = new Discord.Client();
const TOKEN = '';
const prefixo = '-';

const servidores = {
    server: {
        connection: null,
        dispatcher: null
    }
}

const ytdlOptions = {
    filter: 'audioonly'
}

const listAudios = [
    {id: 'bora', label: 'Bora', link: 'Bora'},
    {id: 'rojao', label: 'Rojao', link: 'Rojao'},
    {id: 'naonao', label: 'Não Não', link: 'NaoNao'},
    {id: 'oi', label: 'Oi', link: 'OiMeuChapa'},
    {id: 'fortnite', label: 'Fortnite', link: 'Fortnite'},
    {id: 'muitoforte', label: 'Muito forte', link: 'Noffa'},
];

const listComands = [
    {id: 'sound', description: 'Reproduz áudios curtos'},
    {id: 'play', description: 'Reproduz músicas do youtube (Somente com link)'},
    {id: 'pause', description: 'Pausa somente as músicas do youtube'},
    {id: 'resume', description: 'A música volta a tocar'},
    {id: 'list', description: 'Lista todos os áudios do comando -sound'},
    {id: 'salve', description: 'O Bot manda um salve'},
]

client.on("ready", () => {
    console.log('Estou online!');
});

client.on("message", async (msg) => {
    // Verifica se a mensagem pertence a uma guild(Servidor)
    if (!msg.guild) return console.log('=====> Mensagem não pertence a um servidor!');

    // Verifica se começa com o prefixo
    if (!msg.content.startsWith(prefixo)) return;

    // Verificando se o usuario está no canal de voz
    if (msg.content.startsWith(prefixo) && !msg.member.voice.channel && msg.author.username !== client.user.bot) {
        console.log(`=====> Usuário: ${msg.author.username} mandou mensagem fora do canal de voz`);
        msg.channel.send('Entre no canal de voz!');
        return;
    }

    const fullCmd = msg.content.split(' ');
    const comando = fullCmd[0];
    fullCmd.shift();
    let audio = fullCmd;

    if (comando === `${prefixo}pause`) { // -pause
        return servidores.server.dispatcher.pause();
    }
    
    if (comando === `${prefixo}resume`) { // -resume
        return servidores.server.dispatcher.resume();
    }

    if (comando === `${prefixo}help`) { // -help
        let mensagem = '**Lista de Comandos:** \n';
        listComands.map((comand) => {
            return mensagem += `-> *${comand.id}:* ${comand.description} \n`;
        });
        mensagem += '*O comando deve inicar com -*';

        return msg.channel.send(mensagem);
    }

    if (comando === `${prefixo}list`) { // -list
        let mensagem = '**Lista de Audios:** \n';
        listAudios.map((audio) => {
            return mensagem += `-> ${audio.label} \n`;
        });
        mensagem += 'Ex: *-sound bora*';

        return msg.channel.send(mensagem);
    }

    if (comando === `${prefixo}salve`) { // -salve
        return msg.channel.send(`Salve ${msg.author.username}`);
    }

    if (audio.length === 0 && msg.author.username !== client.user.bot) {
        return console.log('=====> Audio ou link não especificados!');
    }

    // Comando para chamar o bot
    if (comando === `${prefixo}sound`) { // -sound
        servidores.server.connection = await msg.member.voice.channel.join();
        audio = Functions.formatText(audio.join(''));

        listAudios.map((sound) => {
            if (audio === sound.id) {
                return servidores.server.connection.play(`./audios/${sound.link}.mp3`);
            }
        });
    }

    if (comando === `${prefixo}play`) { // -play
        servidores.server.connection = await msg.member.voice.channel.join();
        if (youtube.validateURL(audio)) {
            return servidores.server.dispatcher = servidores.server.connection.play(youtube(audio, ytdlOptions));
        }
        
        return msg.channel.send('Link inválido!');
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    let newUserChannel = newState.channelID;
    let oldUserChannel = oldState.channelID;

    if (oldUserChannel && !newUserChannel) {
        return;
    }

    if ((oldState.mute && !newState.mute) || (!oldState.mute && newState.mute) || (oldState.deaf && !newState.deaf) || (!oldState.deaf && newState.deaf)) {
        return;
    }

    if (oldState.channel && oldState.channel.guild.id === newState.channel.guild.id) {
        return;
    }

    servidores.server.connection = await newState.member.voice.channel.join(); 

    setTimeout(() => {
        servidores.server.connection.play(`./audios/OiMeuChapa.mp3`);
    }, 1000);
});

client.login(TOKEN);
