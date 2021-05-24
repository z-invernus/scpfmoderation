const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const privateMessage = require('./private-message')
const command = require('./command')
const mongo = require('./mongo')
const welcome = require('./welcome')

client.on('ready', async () => {
    console.log('Moderation successfully started.')

    await mongo().then(mongoose => {
        try {
            console.log('Connected to mongo.')
        } finally {
            mongoose.connection.close()
        }
    })

    welcome(client)

    command(client, 'set-status', (message) => {
        const content = message.content.replace('s!set-status ', '')
        if (message.author.id === '332920455633829898') {
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
                }
            })
        }
    })
    command(client, ['serverinfo', 'server-info', 'si'], (message) => {
        const { guild } = message

        const { name, region, memberCount, owner, verificationLevel, createdAt } = guild
        const icon = guild.iconURL()

        const embed = new Discord.MessageEmbed()
            .setTitle('Displaying server info')
            .setThumbnail(icon)
            .addFields(
                {
                    name: 'Server Region',
                    value: region,
                },
                {
                    name: 'Members Count',
                    value: memberCount,
                },
                {
                    name: 'Server Owner',
                    value: owner,
                },
                {
                    name: 'Verification Level',
                    value: verificationLevel,
                },
                {
                    name: 'Creation Time',
                    value: createdAt,
                },
            )
            message.channel.send(embed)
    })
    command(client, ['help', 'commands'], (message) => {
        const { guild } = message
        const { prefix } = config
        const icon = guild.iconURL()
        const embed = new Discord.MessageEmbed()
            .setTitle('Displaying commands')
            .setThumbnail(icon)
            .addFields(
                {
                    name: 's!help',
                    value: 'Displays a list of commands \n **Aliases:** s!commands \n **Permissions required:** Noone',
                },
                {
                    name: 's!serverinfo',
                    value: 'Displays information regarding the server \n **Aliases:** s!server-info - s!si \n **Permissions required:** Noone',
                },
                {
                    name: 's!set-status',
                    value: 'Sets the bot status \n **Permissions required:** BOT Owner',
                },
                {
                    name: 's!ban',
                    value: 'Bans the mentioned user from the server. Forever. \n **Permissions required:** Ban Members / Administrator',
                },
                {
                    name: 's!kick',
                    value: 'Kicks the mentioned user from the server. \n **Permissions required:** Kick Members / Administrator',
                },
        )
            .setFooter(`PREFIX: ${prefix}`)
        message.channel.send(embed)
    })
    command(client, 'ban', message => {
        const { member, mentions } = message
        const mention = `<@${member.id}>`
        
        if (
            member.hasPermission('BAN_MEMBERS') || 
            member.hasPermission('ADMINISTRATOR')
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.ban()
                message.channel.send(`${mention}, user successfully banned.`)
            } else {
                message.channel.send(`${mention}, no user specified.`)
            }
        } else {
            message.channel.send(`${mention}, you're lacking the required permissions.`)
        }
    })
    command(client, 'kick', message => {
        const { member, mentions } = message
        const mention = `<@${member.id}>`
        
        if (
            member.hasPermission('KICK_MEMBERS') || 
            member.hasPermission('ADMINISTRATOR')
        ) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                targetMember.kick()
                message.channel.send(`${mention}, user successfully kicked.`)
            } else {
                message.channel.send(`${mention}, no user specified.`)
            }
        } else {
            message.channel.send(`${mention}, you're lacking the required permissions.`)
        }
    })
})

client.login(config.token)