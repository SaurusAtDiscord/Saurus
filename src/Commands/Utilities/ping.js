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

    async execute(Interaction) {
        return Interaction.createFollowup(new Embed({ description: `My ping is \`${Interaction.member ? Interaction.member.guild.shard.latency : "N/A"}\`.` }).parse());
    }
}