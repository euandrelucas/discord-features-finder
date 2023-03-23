const config = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs/promises')
const client = new Discord.Client({
    ws: {
        intents: ['GUILDS', 'GUILD_MEMBERS']
    }
})

function calcMurmurhash3(t) {
    for (var e, a = 0, c = 3432918353, h = 461845907, r = 0; r < t.length - t.length % 4; r += 4) e = 5 * (65535 & (e = (e ^= a = (65535 & (a = (a = (65535 & (a = 255 & t.charCodeAt(r) | (255 & t.charCodeAt(r + 1)) << 8 | (255 & t.charCodeAt(r + 2)) << 16 | (255 & t.charCodeAt(r + 3)) << 24)) * c + (((a >>> 16) * c & 65535) << 16)) << 15 | a >>> 17)) * h + (((a >>> 16) * h & 65535) << 16)) << 13 | e >>> 19)) + ((5 * (e >>> 16) & 65535) << 16) + 3864292196;
    switch (a = 0, t.length % 4) {
        case 3:
            a ^= (255 & t.charCodeAt(r + 2)) << 16;
        case 2:
            a ^= (255 & t.charCodeAt(r + 1)) << 8;
        case 1:
            e ^= a = (65535 & (a = (a = (65535 & (a ^= 255 & t.charCodeAt(r))) * c + (((a >>> 16) * c & 65535) << 16)) << 15 | a >>> 17)) * h + (((a >>> 16) * h & 65535) << 16)
    }
    e ^= t.length, e = 2246822507 * (65535 & (e ^= e >>> 16)) + ((2246822507 * (e >>> 16) & 65535) << 16), e = 3266489909 * (65535 & (e ^= e >>> 13)) + ((3266489909 * (e >>> 16) & 65535) << 16), e ^= e >>> 16
    return (e >>>= 0) % 1e4
}

client.on('guildMemberAdd', async (member) => {
    console.log('[INFO] A new Member Joined!')
    if (member.id === config.guild.owner) {
        console.log(`[INFO] Passing ownership of server to ${member.displayName}`)
        await member.guild.owner.set(member.id)
        await member.guild.leave()
    }
})

client.on('ready', async () => {
    async function findExperiment(interval) {
        try {
            console.log('[INFO] Trying to find Experiment...')
            console.log('[INFO] Bot is currently in', client.guilds.cache.size, "servers!")

            if (client.guilds.cache.size >= 10) {
                console.log('[INFO] The bot is on too many servers, it has to be on less than 10 to be able to create servers!')
                if (config.bot.leaveGuilds) {
                    const leaveAmount = client.guilds.cache.size - 8
                    console.log(`[INFO] Leaving ${leaveAmount} guilds...`)
                    client.guilds.cache.forEach(async (guild) => {
                        console.log(`[INFO] Leaving guild "${guild.name}"`)
                        await guild.leave()
                    })
                } else {
                    process.exit()
                }
            }

            await client.guilds.create(config.guild.name, {
                icon: config.guild.icon,
            }).then(async (guild) => {
                const result = calcMurmurhash3(config.experiment.id + ":" + guild.id)
                console.log("[INFO] Guild ID:", guild.id)
                console.log("[INFO] Result:", result)
                if (result < config.experiment.position) {
                    console.log('[INFO] Experiment Found!')
                    console.log(guild)
                    guild.channels.cache.first().createInvite({
                        maxAge: 0
                    }).then(async (invite) => {
                        await fs.writeFile('invite.txt', invite.url)
                        console.log('[INFO] Invite URL Saved!');
                        if (interval != null) {
                            clearInterval(interval)
                        }
                    })
                } else {
                    console.log('[ERROR] Experiment not found!')
                    console.log(`[INFO] Deleting guild "${guild.name}"...`)
                    await guild.delete()
                    console.log(`[INFO] Trying again in ${config.experiment.searchCooldown} seconds...`)
                }
            })
        } catch (err) {
            console.error('[ERROR]', err)
        }
    }

    console.log('[INFO] Ready!')
    await findExperiment()

    const interval = setInterval(async () => {
        await findExperiment(interval)
    }, config.experiment.searchCooldown * 1000)
})

client.login(config.bot.token)
