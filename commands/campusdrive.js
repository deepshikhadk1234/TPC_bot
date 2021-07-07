module.exports = {
    name: 'campusdrive',
    description: 'creating new channel for new company',
    execute(message, args) {
        let companyName = args[0];
        let companyFor = args[1];
        
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

        const guild = message.guild;
        
        if (companyFor != 'Placement' && companyFor != 'Internship') { 
            message.reply('Please Check the Category name'); 
            return;
         }
        guild.channels.create(companyName, {
            type: 'text',
            permissionOverwrites: po,
        }).then(channel => {
            let category = guild.channels.cache.find(c => c.name == companyFor && c.type == "category");

            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
        }).catch(console.error);

        message.reply('Channel created successfully !!!');

    }
}