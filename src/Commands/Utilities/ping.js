"use strict";

const Command = require("@structures/Command");
const Embed = require("@components/Embed");

module.exports = class Ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Informs you of my ping",
            category: "Utilities"
        });
    }

    execute(Interaction) {
        return Interaction.createFollowup(new Embed({ description: `Pong! \`${Interaction.member ? Interaction.member.guild.shard.latency : 'N/A'} ms\`` }).parse());
    }
}