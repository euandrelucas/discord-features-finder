const config = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs/promises')
const client = new Discord.Client({
    ws: {
        intents: ['GUILDS', 'GUILD_MEMBERS']
    }
})
let foundCount = 0

function calcMurmurhash3(str) {
    for (var e, a = 0, c = 3432918353, h = 461845907, r = 0; r < str.length - str.length % 4; r += 4) e = 5 * (65535 & (e = (e ^= a = (65535 & (a = (a = (65535 & (a = 255 & str.charCodeAt(r) | (255 & str.charCodeAt(r + 1)) << 8 | (255 & str.charCodeAt(r + 2)) << 16 | (255 & str.charCodeAt(r + 3)) << 24)) * c + (((a >>> 16) * c & 65535) << 16)) << 15 | a >>> 17)) * h + (((a >>> 16) * h & 65535) << 16)) << 13 | e >>> 19)) + ((5 * (e >>> 16) & 65535) << 16) + 3864292196;
    switch (a = 0, str.length % 4) {
        case 3:
            a ^= (255 & str.charCodeAt(r + 2)) << 16
        case 2:
            a ^= (255 & str.charCodeAt(r + 1)) << 8
        case 1:
            e ^= a = (65535 & (a = (a = (65535 & (a ^= 255 & str.charCodeAt(r))) * c + (((a >>> 16) * c & 65535) << 16)) << 15 | a >>> 17)) * h + (((a >>> 16) * h & 65535) << 16)
    }
    e ^= str.length, e = 2246822507 * (65535 & (e ^= e >>> 16)) + ((2246822507 * (e >>> 16) & 65535) << 16), e = 3266489909 * (65535 & (e ^= e >>> 13)) + ((3266489909 * (e >>> 16) & 65535) << 16), e ^= e >>> 16
    return (e >>>= 0) % 1e4
}

/**
 * Tests a Guild for said Experiment
 * @param {Discord.Guild} guild 
 */
async function testGuild(guild) {
    async function saveInvite(invite) {
        console.log(`[INFO] Invite URL: ${invite.url}`)
        await fs.appendFile('invite.txt', `${guild.name} -> ${invite.url}\n`)
        console.log('[INFO] Invite URL Saved!')
    }

    const result = calcMurmurhash3(config.experiment.id + ':' + guild.id)
    console.log('[INFO] [GUILD] Name:', guild.name)
    console.log('[INFO] [GUILD] ID:', guild.id)
    console.log('[INFO] [GUILD] Result:', result)
    console.log('[INFO] [GUILD] Has Experiment?:', result < config.experiment.position)
    if (result < config.experiment.position) {
        console.log('[SUCCESS] Experiment Found!')
        foundCount++
        
        if (guild.me.hasPermission('CREATE_INSTANT_INVITE')) {
            console.log('[INFO] Creating Invite...')
            const invite = await guild.channels.cache.find((channel) => channel.type === 'text').createInvite({ maxAge: 0 })
            console.log('[INFO] Saving Invite...')
            await saveInvite(invite)
        } else {
            console.log('[ERROR] Can\'t create invite, lacking permissions.')
            console.log('[INFO] Fetching existing invites....')
            const invites = await guild.fetchInvites()
            if(invites.size <= 0) {
                console.log('[ERROR] Guild does not have invites... :(')
                return false
            } else {
                const invite = invites.find(inv => inv.temporary === false && inv.maxUses < inv.uses)
                if (invite == null) {
                    console.log('[ERROR] Guild does not have invites... :(')
                    return false
                }
                console.log('[INFO] Saving Invite...')
                await saveInvite(invite)
            }
        }

        return true
    }
    console.log('[ERROR] Experiment Not Found!')
    return false
}

async function searchThroughGuilds() {
    console.log('[INFO] Searching through current servers...')
    client.guilds.cache.forEach(async (guild) => {
        await testGuild(guild)
    })
    if(foundCount === 0) {
        console.log('[INFO] Experiment Not Found in current servers...')
    }
}

async function findExperiment() {
    console.log('[INFO] Creating Server...')

    if (client.guilds.cache.size >= 10) {
        console.log('[INFO] The bot is on too many servers, it has to be on less than 10 to be able to create servers!')
        if (config.bot.leaveGuilds) {
            if (config.bot.guildAllowList.length > 8) {
                console.log('[ERROR] Guild AllowList cannot exceed the limit of 8 IDs')
                process.exit()
            }
            const leaveAmount = client.guilds.cache.size - 8
            console.log(`[INFO] Leaving ${leaveAmount} servers...`)
            client.guilds.cache.forEach(async (guild) => {
                if (config.bot.guildAllowList.includes(guild.id)) {
                    console.log(`[INFO] Keeping the Server called "${guild.name}" (${guild.id}) because of user preferences.`)
                    return
                }

                if (guild.ownerID === client.user.id) {
                    console.log(`[INFO] Deleting guild "${guild.name}"`)
                    await guild.delete()
                } else {
                    console.log(`[INFO] Leaving guild "${guild.name}"`)
                    await guild.leave()
                }
            })
        } else {
            process.exit()
        }
    }

    await client.guilds.create(config.guild.name, {
        icon: config.guild.icon,
    }).then(async (guild) => {
        console.log('[INFO] Trying to find Experiment...')
        const experimentFound = await testGuild(guild)
        if (!experimentFound) {
            console.log(`[INFO] Deleting server "${guild.name}"...`)
            await guild.delete()
            console.log(`[INFO] Trying again in ${config.experiment.searchCooldown} seconds...`)
        }
    })
}

client.on('guildMemberAdd', async (member) => {
    console.log('[INFO] A new Member Joined! Say hi to', member.displayName)
    if (member.guild.ownerID === client.user.id) {
        if (member.id === config.guild.owner) {
            console.log(`[INFO] Passing ownership of server to ${member.displayName}`)
            await member.guild.setOwner(member.id, 'Have fun!')
            console.log(`[INFO] Leaving Server ${member.guild.name}`)
            await member.guild.leave()
        }
    }
})

client.on('ready', async () => {
    try {
        console.log(`[INFO] ${client.user.username} is Ready!`)
        console.log('[INFO] Bot is currently in', client.guilds.cache.size, 'servers!')
        if (config.bot.searchThroughGuilds) {
            await searchThroughGuilds()
            if (foundCount >= config.bot.findCount) {
                console.log('[INFO] Found Enough Servers!')
                return
            }
        }
        await findExperiment()
        if (foundCount >= config.bot.findCount) {
            console.log('[INFO] Found Enough Servers!')
            return
        }
        
        const interval = setInterval(async () => {
            await findExperiment()
            if (foundCount >= config.bot.findCount) {
                console.log('[INFO] Found Enough Servers!')
                clearInterval(interval)
            }
        }, config.experiment.searchCooldown * 1000)
    } catch (err) {
        console.error('[ERROR]', err)
    }
})

client.login(config.bot.token)
