const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')
const command = require('./command')

client.on('ready', () => {
    console.log('Moderation successfully started.')

    command(client, ['ping', 'pong'], message => {
        message.channel.send('Pong!')
    })
    command(client, ['clear', 'clearchannel', 'cc', 'nuke'], (message) => {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.messages.fetch().then((results) => {
                message.channel.bulkDelete(results)
            })
        }
    })
    command(client, 'set-status', (message) => {
        const content = message.content.replace('s!set-status ', '')
        if (message.member.hasPermission('ADMINISTRATOR')) {
            client.user.setPresence({
                activity: {
                    name: content,
                    type: 0,
                }
            })
        }
    })
})



client.login(config.token)