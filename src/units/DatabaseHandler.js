'use strict';

const { PrismaClient } = require('@prisma/client');

module.exports = class Database {
    #prismaClient;
    constructor() {
        this.#prismaClient = new PrismaClient();
    }

    /**
     * Connects to the database and returns a client in the form of a Promise.
     * @param { Function } func The function to run.
     * @returns { Promise } Returns a promise that resolves to the database client.
     */
    async fire(func) {
        return this.#prismaClient[func]();
    }

    /**
     * It creates a guild if it doesn't exist, and returns the guild from the database if it does.
     * @param { String } guildId The id of the guild.
     * @returns { Object } The guild object.
     */
    async getGuild(guildId) {
        return await this.#prismaClient.guild.findUnique({ where: { guildId }}) ?? this.#prismaClient.guild.create({ data: { guildId }});
    }

    /**
     * Update a guilds data with the given guildId.
     * @param { String } guildId The uuid of the user to update.
     * @param { Object } data The data to update.
     */
    async updateGuild(guildId, data) {
        return this.#prismaClient.guild.update({ where: { guildId }, data });
    }

    /**
     * Delete a guild from the database.
     * @param { String } uuid The uuid of the user to delete.
     */
    deleteGuild(guildId) {
        this.#prismaClient.guild.delete({ where: { guildId }});
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
    async updateUser(uuid, data) {
        return this.#prismaClient.user.update({ where: { uuid }, data });
    }

    /**
     * Delete a user from the database.
     * @param { String } uuid The uuid of the user to delete.
     */
    deleteUser(uuid) {
        this.#prismaClient.user.delete({ where: { uuid }});
    }
}