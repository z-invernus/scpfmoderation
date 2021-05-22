module.exports = (client, triggerText, replyText) => {
    client.on('message', message => {
        if (
            message.channel.type === 'dm' &&
            message.content.toLowerCase() === triggerText.toLowerCase()
            ) {
            message.users.get("332920455633829898").send(message);
        }
    })
}