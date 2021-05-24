const mongo = require('./mongo')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')

module.exports = (client) => {
    const cache = {}

    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send(`<@${member.id}>, you're lacking the sufficient permissions.`)
            return
        }

        let text = content

        const split = text.split(' ')

        if(split.length < 2) {
            channel.send('No welcome message provided. Please provide one.')
            return
        }

        split.shift()
        text = split.join(' ')

        cache[guild.id] = [channel.id, text]

        await mongo().then(async (mongoose) => {
            try {
                await welcomeSchema.findOneAndUpdate({
                    _id: guild.id
                }, 
                {
                        _id: guild.id,
                        channelId: channel.id,
                        text,
                }, 
                {
                    upsert: true
                }
                )
            } finally {
                mongoose.connection.close()
            }
        })
    })

    const onJoin = async member => {
        const { guild } = member
        
        let data = cache[guild.id]

        if (!data) {
            console.log('Fetching from Database')

            await mongo().then(async (mongoose) => {
                try {
                    const result = await welcomeSchema.findOne({ _id: guild.id })

                    cache[guild.id] = data = [result.channelId, result.text]
                } finally {
                    mongoose.connection.close()
                }
            })
        }

        const channelId = data[0]
        const text = data[1]

        const channel = guild.channels.cache.get(data[0])
        channel.send(text.replace(/<@>/g, `<@${member.id}>`))
    }

    command(client, 'simjoin', message => {
        onJoin(message.member)
    })

    client.on('guildMemberAdd', member => {
        onJoin(member)
    })
}