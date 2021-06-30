const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const { prefix } = require('./config.json');
dotenv.config();
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
    console.log('I am online :-)')
});

client.login(process.env.TOKEN);

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

/* 
	
	if (command === 'ping') {
		message.channel.send('Pong.');
	} else if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		} else if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	}
	else if (command === 'kick') {
		// Grab the "first" mentioned user from the message
		// This will return a `User` object, just like `message.author`
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		
		const taggedUser = message.mentions.users.first();

		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
		
	}

	else if (command === 'avatar') {
		// Grab the "first" mentioned user from the message
		// This will return a `User` object, just like `message.author`
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
		}
		
		//const taggedUser = message.mentions.users.first();
		//const taggedUser = message.mentions.users.first();

		//message.channel.send(`You wanted to kick: ${taggedUser.username}`);
		//return message.reply(`${taggedUser.username}'s avatar: <${taggedUser.displayAvatarURL({ format: 'png', dynamic: true })}>`);
		
		//if (!message.mentions.users.size) {
			//return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
	//	}
		
		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>`;
		});
		
		// Send the entire array of strings as a message
		// By default, discord.js will `.join()` the array with `\n`
		message.channel.send(avatarList);
	}

	else if (command === 'prune') {
		const amount = parseInt(args[0]);

		 if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		} else if (amount < 2 || amount > 100) {
			return message.reply('you need to input a number between 2 and 100.');
		}
		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('there was an error trying to prune messages in this channel!');
	});
}

 */
});