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
     * Get the user with the given uuid, or create a new user with that uuid.
     * @param { String } uuid The user's uuid.
     * @returns { Object } The user object.
     */
    async getUser(uuid) {
        return await this.#prismaClient.user.findUnique({ where: { uuid }}) ?? await this.#prismaClient.user.create({ data: { uuid }});
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
    async deleteUser(uuid) {
        await this.#prismaClient.user.delete({ where: { uuid }});
    }
}