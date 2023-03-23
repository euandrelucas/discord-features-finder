const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()

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
    if (member.id === config.guild.owner) {
        await member.guild.owner.set(member.id)
        await member.guild.leave()
    }
})

client.on('ready', async () => {
    client.guilds.cache.forEach(async (g) => {
        await g.members.fetch()
        g.members.cache.forEach(async (member) => {
            if (member.id === config.guild.owner) {
                await member.guild.setOwner(member.id)
                await member.guild.leave()
            }
        })
    })
    if (client.guilds.cache.size > 9) {
        if (!config.bot.exitGuilds) {
            throw new Error('The bot is on many servers, it has to be on less than 10 to be able to create servers!')
        } else {
            console.log('The bot is on many servers, it has to be on less than 10 to be able to create servers! Exiting guilds...')
            client.guilds.cache.forEach(async (g) => {
                await g.leave().catch(() => {})
            })
        }
    }
    console.log('Ready!')
    try {
        await client.guilds.create(config.guild.name, {
            icon: config.guild.icon,
        }).then(async (g) => {
            if (calcMurmurhash3(config.guild.experiment + ":" + g.id) < config.guild.experimentPos) {
                console.log('Experiment Found!')
                console.log(g)
                g.channels.cache.first().createInvite({
                    maxAge: 0
                }).then((invite) => {
                    const fs = require('fs')
                    fs.writeFile('invite.txt', invite.url, function(err) {
                        if (err) throw err;
                        console.log('Saved!');
                    }).then(() => process.exit());
                })
            } else {
                console.log('Experiment not found, deleting guild...')
                await g.delete()
            }
        })
    } catch (e) {
        console.log(e)
    }
    setInterval(async () => {
        try {
            await client.guilds.create(config.guild.name, {
                icon: config.guild.icon,
            }).then(async (g) => {
                if (calcMurmurhash3(config.guild.experiment + ":" + g.id) < config.guild.experimentPos) {
                    console.log('Experiment Found!')
                    console.log(g)
                    g.channels.cache.first().createInvite({
                        maxAge: 0
                    }).then((invite) => {
                        const fs = require('fs')
                        fs.writeFile('invite.txt', invite.url, function(err) {
                            if (err) throw err;
                            console.log('Saved!');
                        });
                    })
                    process.exit()
                } else {
                    console.log('Experiment not found, deleting guild...')
                    await g.delete()
                }
            })
        } catch (e) {
            console.log(e)
        }
    },  config.guild.seconds * 1000)
})

client.login(config.bot.token)
