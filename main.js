const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages
    ],
});

let valorantPlaytimeStart;

// Read the playtime.json file and parse the JSON data
if (fs.existsSync('playtime.json')) {
    const data = fs.readFileSync('playtime.json', 'utf8');
    const jsonData = JSON.parse(data);
    valorantPlaytimeStart = new Date(jsonData.valorantPlaytimeStart);
}

client.on('ready', async () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
    setInterval(async () => {
        const guild = client.guilds.cache.get('802529062563479583'); // SERVER ID
        const member = await guild.members.fetch('746887218513051689'); // USER ID

        if(member.presence != null && member.presence.activities != null) {
            const valorantActivity = member.presence.activities.find(activity => activity.name === 'VALORANT');

            if (valorantActivity) {
                if (!valorantPlaytimeStart) {
                    valorantPlaytimeStart = new Date(valorantActivity.timestamps.start);
                }

                const valorantPlaytime = Math.floor((new Date() - valorantPlaytimeStart) / 60000); // in minutes
                const valorantPlaytimeInHours = (valorantPlaytime / 60).toFixed(2); // in hours
                const channel = guild.channels.cache.get('1192902533119746138'); // channel ID
                fs.writeFileSync('playtime.json', JSON.stringify({ valorantPlaytime, valorantPlaytimeStart }));
                channel.send(`Valorant playtime: ${valorantPlaytimeInHours} hours.`);
            } else {
                valorantPlaytimeStart = null;
            }
        }
    }, 60000); // check every minute
});

client.login('MTE5Mjg3OTk4MzY4MTYwOTgzOQ.G_8yXI.5WH5739eWkm8UEIbGp3Z4up95MeHzaQt86YeJM'); // BOT TOKEN
