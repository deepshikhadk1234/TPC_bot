const {
	getAuthToken,
	getSpreadSheetValues,
	spreadsheetId,
	sheetName,
} = require('../services/googleSheetsService.js');
const {prefix}= require('../config.json');


async function assignRole(branch, gradYear, message) {
	let { cache } = message.guild.roles;
	let modRole = cache.find(role => role.name === "moderator");

	let yearRole = cache.find(role => role.name.includes(gradYear));
	if (!yearRole) {
		message.reply("Year role could not be assigned. \
			Please ping"+ "<@&" + modRole.id + "> to identify you.")
	}
	else {
		await message.member.roles.add(yearRole);
	}
	let yearString = "Year role added\n";

	let branchRole = cache.find(role => role.name.includes(branch));
	if (!branchRole) {
		message.reply("Branch role could not be assigned. \
		Please ping"+ "<@&" + modRole.id + "> to identify you.")
	}
	else {
		await message.member.roles.add(branchRole);
	}
	let branchString = "Branch role added\n";
	let messageString = branchString + yearString;
	return messageString;
}

async function getDetails(message, username) {
	let { cache } = message.guild.roles;
	let modRole = cache.find(role => role.name === "moderator");
	var sheetValues = null;
	try {
		const auth = await getAuthToken();
		const details = await getSpreadSheetValues({
			spreadsheetId,
			sheetName,
			auth
		});
		sheetValues = details.data.values;
	}
	catch (error) {
		console.log(error);
		return;
	};
	console.log(`Finding match for ${message.author.tag}`);

	for (var i in sheetValues) {
		let discordUserNameTag = sheetValues[i][0];

		if (discordUserNameTag == message.author.tag) {
			let firstName = sheetValues[i][1];

			//let part = realName.split(" ")
			let lastName = sheetValues[i][2];// part[part.length - 1];

			console.log(`real name ${firstName}`);
			let rollNumber = sheetValues[i][3];
			console.log(`roll no ${rollNumber}`);
			let branch = sheetValues[i][4];
			console.log(`branch ${branch}`);
			let rollYear = sheetValues[i][5];
			let gradYear = parseInt(rollYear)+4;
            console.log(`grad year ${gradYear}`);

			let messageString = await assignRole(branch, gradYear, message);
			try {
				if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.reply('I\'m missing permissions.');
				//if (message.author.id === message.guild.ownerID) return message.reply('I can\'t change your nickname.');

				await message.member.setNickname(`${firstName} ${lastName}`);
				messageString += "Nickname Changed\n"
				message.reply(messageString)
			} catch (err) {
				console.error(err);
			}
			// console.log(message.guild.roles);
			return;
		}
	}
	message.reply("User not found");
	return;
}

module.exports = {
	name: 'verify',
	description: 'Changes nickname and roles',
	execute(message, args) {
		username = message.author.tag.split('#')[0];
		//  console.log(`user name is ${username}`);
		if (args[0] === "me") {
			getDetails(message, username);
		}
		else {
			message.reply(`The command you are looking for is-${prefix}verify me`);
		}
	}
}