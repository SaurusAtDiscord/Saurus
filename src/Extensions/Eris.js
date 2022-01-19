'use strict';

module.exports = class Eris {
    /**
     * @param { Eris.Client } client - The client.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * If we're in development, delete the command from the guild. Otherwise, delete the command from the client.
     * @param { String } commandId The ID of the command to delete.
     */
    deleteCommand(commandId) {
        if (process.env.NODE_ENV === 'development') this.client.deleteGuildCommand(process.env.DEVELOPMENT, commandId)
        else this.client.deleteCommand(commandId);
    }

    /**
     * If we're in development, create the command from the guild. Otherwise, create the command from the client.
     * @param { Array } context The context of the command.
     */
    createCommand(context) {
        if (process.env.NODE_ENV === 'development') this.client.bulkEditGuildCommands(process.env.DEVELOPMENT, context)
        else this.client.bulkEditCommands(context);
    }

    /**
     * `getGuild` returns a guild object from the cache, or from the API if it's not in the cache.
     * @param { String } guildId The ID of the guild to get.
     * @returns { Object } The guild object.
     */
    async getGuild(guildId) {
        return this.client.guilds.get(guildId) ?? this.client.guilds.add(await this.client.getRESTGuild(guildId));
    }

    /**
     * Get the user object for the given user ID.
     * @param { String } userId The ID of the user to get.
     * @returns { Object } The user object.
     */
    async getUser(userId) {
        return this.client.users.get(userId) ?? this.client.users.add(await this.client.getRESTUser(userId));
    }

    /**
     * Get a member from a guild.
     * @param { String } guildId The ID of the guild to get the member from.
     * @param { String } memberId The ID of the member to get.
     * @returns { Object } The guild member object.
     */
    async getMember(guildId, memberId) {
        const guild = await this.getGuild(guildId);
        return guild && (guild.members.get(memberId) ?? guild.members.add(await this.client.getRESTGuildMember(guildId, memberId)));
    }
}