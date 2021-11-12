const SuperAgent = require("superagent");

module.exports = class Library {
    constructor(client) {
        this.client = client;
    }

    deleteCommand(commandId) {
        if (process.env.NODE_ENV === "development") this.client.deleteGuildCommand("887396392497184778", commandId)
        else this.client.deleteCommand(commandId);
    }

    createCommand(context) {
        if (process.env.NODE_ENV === "development") this.client.bulkEditGuildCommands("887396392497184778", context)
        else this.client.bulkEditCommands(context);
    }

    async getGuild(guildId) {
        return this.client.guilds.get(guildId) ?? (await SuperAgent.get(`https://discord.com/api/v9/guilds/${guildId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }

    async getUser(userId) {
        return this.client.users.get(userId) ?? (await SuperAgent.get(`https://discord.com/api/v9/users/${userId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }

    async getMember(userId, guildId) {
        return (await SuperAgent.get(`https://discord.com/api/v9/guilds/${guildId}/members/${userId}`).set("Authorization", `Bot ${process.env.KEY}`)).body;
    }
}