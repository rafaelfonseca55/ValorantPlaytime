const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const serverId = '';
const userId = '';
const channelId = '';
const token = '';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages
    ],
});

let valorantPlaytimeStart;

// Reads the playtime.json file and parses the JSON data
if (fs.existsSync('playtime.json')) {
    const data = fs.readFileSync('playtime.json', 'utf8');
    const jsonData = JSON.parse(data);
    valorantPlaytimeStart = new Date(jsonData.valorantPlaytimeStart);
}

client.on('ready', async () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
    setInterval(async () => {
        const guild = client.guilds.cache.get(serverId);
        const member = await guild.members.fetch(userId);
// If the user has Rich Presence enabled, it checks if he's playing Valorant or not
        if(member.presence != null && member.presence.activities != null) {
            const valorantActivity = member.presence.activities.find(activity => activity.name === 'VALORANT');
// If he's playing timer starts
            if (valorantActivity) {
                if (!valorantPlaytimeStart) {
                    valorantPlaytimeStart = new Date(valorantActivity.timestamps.start);
                }

                const valorantPlaytime = Math.floor((new Date() - valorantPlaytimeStart) / 60000); // in minutes
                const valorantPlaytimeInHours = (valorantPlaytime / 60).toFixed(2); // in hours
                const channel = guild.channels.cache.get('channelId'); // channel ID
                fs.writeFileSync('playtime.json', JSON.stringify({ valorantPlaytime, valorantPlaytimeStart }));
                channel.send(`Valorant playtime: ${valorantPlaytimeInHours} hours.`);
            } else {
                valorantPlaytimeStart = null;
            }
        }
    }, 60000); // check every minute
});

client.login(token); // BOT TOKEN
