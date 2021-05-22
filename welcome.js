const Discord = require('discord.js')

module.exports = client => {
    const channelId = '821849698062696458'
    const targetChannelId = '821852722240159744'
    const targetChannel2Id = '821854360119148545'
    
    client.on('guildMemberAdd', (member) => {

        const embed = new Discord.MessageEmbed()
            .setTitle('New member joined.')
            .setDescription(`Welcome to the Foundation, <@${member.id}>! Head over to <#${targetChannelId}> and <#${targetChannel2Id}> to get started!`)

        const channel = member.guild.channels.cache.get(channelId)
        channel.send(embed)
    })
}