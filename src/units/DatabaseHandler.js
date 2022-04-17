'use strict';

const { PrismaClient } = require('@prisma/client');

module.exports = class Database {
    #prismaClient;
    constructor() {
        this.#prismaClient = new PrismaClient();
    }

    /**
     * It takes a user ID and a guild ID, adds them together, and returns the result as a string.
     * @param { String } id The id of the user
     * @param { String } guildId The id of the guild the user is in.
     * @returns { String } The return value is the sum of the two ids.
     */
    toUUID(id, guildId) {
        return (parseInt(id) + parseInt(guildId)).toString();
    }

    /**
     * Connects to the database and returns a client in the form of a Promise.
     * @returns { Promise } Returns a promise that resolves to the database client.
     */
    async connect() {
        return this.#prismaClient.$connect();
    }

    /**
     * It creates a guild if it doesn't exist, and returns the guild from the database if it does.
     * @param { String } guildId The id of the guild.
     * @returns { Promise<Object> } The guild object.
     */
    async getGuild(guildId) {
        return await this.#prismaClient.guild.findUnique({ where: { guildId }}) ?? this.#prismaClient.guild.create({ data: { guildId }});
    }

    /**
     * Update a guilds data with the given guildId.
     * @param { String } guildId The uuid of the user to update.
     * @param { Promise<Object> } data The data to update.
     */
    updateGuild(guildId, data) {
        return this.#prismaClient.guild.update({ where: { guildId }, data });
    }

    /**
     * Delete a guild from the database.
     * @param { String } uuid The uuid of the user to delete.
     */
    deleteGuild(guildId) {
        return this.#prismaClient.guild.delete({ where: { guildId }});
    }

    /**
     * Get the user with the given uuid, or create a new user with that uuid.
     * @param { String } uuid The user's uuid.
     * @returns { Object } The user object.
     */
    async getUser(uuid) {
        return await this.#prismaClient.user.findUnique({ where: { uuid }}) ?? this.#prismaClient.user.create({ data: { uuid }});
    }

    /**
     * Update a user with the given uuid.
     * @param { String } uuid The uuid of the user to update.
     * @param { Object } data The data to update.
     */
    updateUser(uuid, data) {
        return this.#prismaClient.user.update({ where: { uuid }, data });
    }

    /**
     * Delete a user from the database.
     * @param { String } uuid The uuid of the user to delete.
     */
    deleteUser(uuid) {
        return this.#prismaClient.user.delete({ where: { uuid }});
    }

    /**
     * It creates a new blacklist entry in the database.
     * @param { String } type - The type of blacklisting. This can be either "ip" or "fingerPrint".
     * @param { String } fingerPrint - The fingerprint of the user that you want to blacklist.
     */
    createBlacklist(type, fingerPrint) {
        return this.#prismaClient.blacklist.create({ data: { type, fingerPrint }});
    }

    /**
     * Get a blacklist of a certain type and fingerPrint
     * @param { String } type The type of blacklist e.g. "GUILD" or "USER".
     * @param { String } fingerPrint The fingerprint of the blacklist.
     * @returns { Object } The blacklist entry.
     */
    getBlacklist(type, fingerPrint) {
        return this.#prismaClient.blacklist.findFirst({ where: { type, fingerPrint }});
    }

    /**
     * Remove a entry from the blacklist.
     * @param { String } fingerPrint The fingerprint of the blacklist entry to be removed.
     */
    deleteBlacklist(fingerPrint) {
        return this.#prismaClient.blacklist.delete({ where: { fingerPrint }});
    }
}