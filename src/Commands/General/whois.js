const Command = require("@structures/Command");
const Embed = require("@components/Embed");

const { Constants } = require("eris");
const moment = require("moment");

module.exports = class Whois extends Command {
    constructor(client) {
        super(client, {
            name: "whois",
            description: "Gives information about the provided user",
            usage: "whois (user)",
            category: "General",
            
            options: [{
                "name": "target",
                "description": "Get information on a specific user",
                "type": Constants.ApplicationCommandOptionTypes.USER
            }]
        });
    }   

    async execute(Interaction, Args) {
        const user = (Args.target && await this.client.getRESTGuildMember("887396392497184778", Args.target)) ?? (Interaction.member || Interaction.user);
        const roles = user.roles.map(role => `<@&${role}>`).sort((a, b) => b - a);

        return Interaction.createFollowup(new Embed({
            author: { name: `${user.username}#${user.discriminator}`, icon_url: (user.avatarURL ?? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`) },
            fields: [
                {
                    name: "Guild Details",
                    value: `• Nickname: ${user.nick ?? "No Nickname"}\n• Joined at: ${moment(new Date(user.joinedAt)).format("LL")} (\`${moment(user.joinedAt).fromNow()}\`)${roles.length ? `\n• Roles: ${roles.join(" ")}` : ""}`
                },
                {
                    name: "User Details",
                    value: `• Identity: ${user.username}#${user.discriminator} (\`${user.id}\`)\n• Registered: ${moment(new Date(user.createdAt)).format("LL")} (\`${moment(user.createdAt).fromNow()}\`)`
                }
            ],
            thumbnail: { url: (user.avatarURL ?? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`) },
            color: this.client.extensions.string.splitNumbers(Interaction.channel?.guild.roles.get(roles[0]))?.color
        }).parse());
    }
}