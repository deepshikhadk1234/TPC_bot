module.exports = {
    name: 'campusdrive',
    description: 'creating new channel for new company',
    execute(message, args) {
        //message.author.roles.cache.some(role => role.name === 'Mod');
        //if the author has permission to run this command
        if (!message.member.roles.cache.some(role => role.name.includes("TPC"))) {
            message.reply('You do not have the permission to run this command');
            return;
        };

        if (!args[0]) { message.reply('Invalid Command'); return; }


        let po = [{
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
        },
        {
            id: message.author.id,
            allow: ['VIEW_CHANNEL'],
        },

        ];
        let mentionedroles = message.mentions.roles;

        mentionedroles.each(role => po.push({ id: role.id, allow: ['VIEW_CHANNEL'], }));

        message.guild.channels.create(args[0], {
            type: 'text',
            permissionOverwrites: po
        });

        message.reply('Channel created successfully !!!');

    }
}