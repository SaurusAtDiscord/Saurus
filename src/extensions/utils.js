'use strict';

module.exports = class Utils {
    constructor(client) {
        this.client = client;
    }

    /**
     * It returns an embed object with the title set to "Error" and the description set to the error
     * message.
     * @param { String } error The error message to display.
     * @returns { Object } The errorEmbed function returns an object with an embed property.
     */
    errorEmbed(error) {
        return { embed: {
            description: error,
            color: 0xFF6961
        }};
    }

    /**
     * Create a Command.
     * @param { Array } context The context of the command.
     */
    createCommand(context) {
        void (process.env.NODE_ENV === 'development' ? this.client.bulkEditGuildCommands(process.env.DEVELOPMENT, context) : this.client.bulkEditCommands(context));
    }

    /**
     * Edit a Command.
     * @param { Object } command The command object to edit.
     * @param { String } commandId The ID of the command to edit.
     */
    editCommand(command, commandId) {
        void (process.env.NODE_ENV === 'development' ? this.client.editGuildCommand(process.env.DEVELOPMENT, commandId, command) : this.client.editCommand(command, commandId));
    }

    /**
     * Delete a Command.
     * @param { String } commandId The ID of the command to delete.
     */
    deleteCommand(commandId) {
        void (process.env.NODE_ENV === 'development' ? this.client.deleteGuildCommand(process.env.DEVELOPMENT, commandId) : this.client.deleteCommand(commandId));
    }

    /**
     * Returns a guild object from the cache, or from the API if it's not in the cache.
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

    /**
     * It takes a member object and returns the highest role that the member has.
     * @param { Eris.Member } member The member object.
     * @returns { Eris.Role } The highest role that the member has.
    */
    highestRole(member) {
        return member?.roles?.map(role => member?.guild?.roles?.get(role))?.sort((a, b) => b?.position - a?.position)?.[0];
    }
    
    /**
     * If the victim has no roles, or the differ has no roles, return true. If the victim has a higher role
     * than the differ, return false
     * @param { Eris.Member } member1 The user to check.
     * @param { Eris.Member } member2 The user to check against.
     * @returns { Boolean } Whether or not the victim has a higher role than the differ.
     */
    superior(member1, member2) {
        const guildOwner = member1?.guild?.ownerID;

        const isGuildOwner = (member1?.id === guildOwner && member2?.id !== guildOwner);
        const hasAdministrator = member1?.permissions?.has('administrator');
        const higherRole = this.highestRole(member1)?.position <= this.highestRole(member2)?.position;
        return isGuildOwner || higherRole || hasAdministrator;
    }
}