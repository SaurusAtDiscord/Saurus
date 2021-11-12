"use strict";

const Command = require("@structures/Command");

const ButtonHelper = require("@components/ComponentHandler");
const Embed = require("@components/Embed");
const { collectInteractions } = require("@components/InteractionCollector");

const { Constants } = require("eris");

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "Provides bot assets or basic information",
            usage: "help (command_or_category)",
            category: "General",
            
            options: [{
                "name": "command_or_category",
                "description": "Get information on a specific command or category.",
                "type": Constants.ApplicationCommandOptionTypes.STRING
            }]
        });
    }

    async execute(interaction, args) {
        if (Object.keys(args).length === 0) {
            const component = new ButtonHelper();
            const buttonColors = [1, 2];

            this.client.categories.forEach(category => {
                component.createButton(category, buttonColors[1], `help.${interaction.member?.id} ${category}`);
                buttonColors.reverse();
            });
            
            interaction.createFollowup(new Embed({
                title: "Help",
                description: `Selectable categories: \`${this.client.categories.join(", ")}\``
            }).addComponents(component.parse()));

            return collectInteractions({
                client: this.client,
                interaction,
                time: 60000,
                filter: i => (i.message.channel.id === interaction.channel.id) && (interaction.member?.id === this.client.extensions.string.splitNumbers(i.data?.custom_id))
            })
            .on("collect", res => {
                const is_category = this.client.categories.find(category => category.toLowerCase() === res.data.custom_id.split(" ")[1].toLowerCase());
                
                const fields = [];
                this.client.commands.filter(cmd => cmd.category === is_category).forEach(cmd => fields.push({ name: cmd.name, value: cmd.description }));
                
                res.acknowledge();
                return interaction.editOriginalMessage(new Embed({
                    title: is_category,
                    description: `This category consists of ${this.client.commands.filter(cmd => cmd.category === is_category).length} commands.`,
                    fields
                }).parse());
            })
            .on("end", () => {
                interaction.editOriginalMessage(new Embed({ description: "This embed has been timed-out.\nSuggestion: Press the `Dismiss Message` button" }).addComponents(null))
            });
        } else {
            const is_cmd = this.client.commands.find(cmd => cmd.name === args.command_or_category.toLowerCase());
            const is_category = this.client.categories.find(category => category.toLowerCase() === args.command_or_category.toLowerCase());

            if (is_category) {
                const fields = [];
                this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => fields.push({ name: cmd.name, value: cmd.description }));

                return interaction.createFollowup(new Embed({
                    title: is_category,
                    description: `This category consists of ${this.client.commands.filter(cmd => cmd.category === is_category).length} commands.`,
                    fields
                }).parse());
            } else if (is_cmd) {
                return interaction.createFollowup(new Embed({
                    title: `${is_cmd.category} : ${this.client.extensions.string.upperFirst(is_cmd.name)}`,
                    fields: [
                        { name: "Description", value: is_cmd.description ?? "No description provided" },
                        { name: "Usage", value: `**/**${is_cmd.usage}` ?? "No example provided" }
                    ]
                }).parse());
            }

            return interaction.createFollowup(new Embed({ description: `\`${args.command_or_category}\` **is not a valid command/category, try once more.**` }).parse());
        }
    }
}