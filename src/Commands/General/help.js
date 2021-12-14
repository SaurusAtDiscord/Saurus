'use strict';

const Command = require('@core/Command');

const ButtonHelper = require('@units/ComponentHandler');
const Embed = require('@units/Embed');

const { Constants } = require('eris');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Provides bot assets or basic information',
            usage: 'help (command_or_category)',
            category: 'General',
            
            options: [{
                'name': 'command_or_category',
                'description': 'Get information on a specific command or category',
                'type': Constants.ApplicationCommandOptionTypes.STRING
            }]
        });
    }

    execute(interaction, args) {
        if (Object.keys(args).length === 0) {
            const component = new ButtonHelper();
            this.client.categories.forEach(category => component.createButton(category, 2, `help ${interaction.member.id} ${category} ${interaction.channel.id}`));
            
            interaction.createFollowup(new Embed({
                title: 'Help',
                description: `You can observe available categories by clicking the buttons below.`
            }, component.parse()));
            
            return interaction.createMessageComponentCollector(this.client, {
                time: 120000,
                filter: i => (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
            })
            .on('collect', async res => {
                await res.acknowledge();
                const data = res.data.custom_id;
                const is_category = this.client.categories.find(category => category.toLowerCase() === data.split(' ')[2].toLowerCase());
                const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => { return { name: cmd.name, value: cmd.description }});

                component.updateAndDisable(data);
                interaction.editOriginalMessage(new Embed({
                    title: is_category,
                    description: `This category consists of ${fields.length} commands.`,
                    fields
                }, component.parse()));
            })
            .on('end', () => {
                interaction.editOriginalMessage(new Embed({ description: 'This embed has been timed-out.\nSuggestion: Press the `Dismiss Message` button' }, null));
            });
        }

        const is_cmd = this.client.commands.find(cmd => cmd.name === args.command_or_category.toLowerCase());
        const is_category = this.client.categories.find(category => category.toLowerCase() === args.command_or_category.toLowerCase());

        if (is_category) {
            const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => { return { name: cmd.name, value: cmd.description }});
            return interaction.createFollowup(new Embed({
                title: is_category,
                description: `This category consists of ${fields.length} commands.`,
                fields
            }));
        } else if (is_cmd) {
            return interaction.createFollowup(new Embed({
                title: `${is_cmd.category} : ${this.client.extensions.string.upperFirst(is_cmd.name)}`,
                fields: [
                    { name: 'Description', value: is_cmd.description ?? 'No description provided' },
                    { name: 'Usage', value: `**/**${is_cmd.usage}` ?? 'No example provided' }
                ]
            }));
        }

        return interaction.createFollowup(new Embed({ description: `\`${args.command_or_category}\` **is not a valid command/category, try once more.**` }));
    }
}