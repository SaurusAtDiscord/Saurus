'use strict';

const { PrismaClient } = require('@prisma/client');

module.exports = class Database {
    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getUser(uuid) {
        return await this.prismaClient.user.findUnique({ where: { uuid }}) ?? await this.prismaClient.user.create({ data: { uuid }});
    }

    async updateUser(uuid, data) {
        return this.prismaClient.user.update({ where: { uuid }, data });
    }

    async deleteUser(uuid) {
        await this.prismaClient.user.delete({ where: { uuid }});
    }
}