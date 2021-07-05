const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const express = require('express');
const { prefix,port} = require('./config.json');

const {
	//getAuthToken,
	//getSpreadSheetValues,
	spreadsheetId,
	sheetName,
	appendRow
} = require('./services/googleSheetsService.js');
//const auth = await getAuthToken();
dotenv.config();
const app = express();
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
console.log(message);
	try {
		client.commands.get(command).execute(message, args);
		
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));



//appendRow([["abcd"]]);