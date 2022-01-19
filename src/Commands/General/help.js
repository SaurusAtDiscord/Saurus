'use strict';

const Command = require('@core/Command');
const ButtonHelper = require('@units/ComponentHandler');
const InteractionCollector = require('@units/InteractionCollector');

const { Constants } = require('eris');
const _ = require('underscore');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Provides bot assets or basic information',
            
            options: [{
                'name': 'command_or_category',
                'description': 'Get information on a specific command or category',
                'type': Constants.ApplicationCommandOptionTypes.STRING
            }]
        });
    }

    execute(interaction, args) {
        if (_.isEmpty(args)) {
            const component = new ButtonHelper();
            const uniId = _.uniqueId('help_@');

            this.client.categories.forEach(category => component.createButton(category, 2, `${uniId} ${interaction.member.id} ${category}`));
            
            interaction.createFollowup({ 
                embed: {
                    title: 'Help',
                    description: `You can observe available categories by clicking the buttons below.`
                },
                components: component.parse()
            });
            
            return new InteractionCollector(this.client, {
                time: 60000,
                filter: i => (i.data.custom_id.split(' ')[0] === uniId) && (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
            })
            .on('collect', async res => {
                await res.acknowledge();
                const data = res.data.custom_id;
                const is_category = this.client.categories.find(category => category === data.split(' ')[2]);
                const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => Object.assign({}, { name: cmd.name, value: cmd.description }));

                component.disable(data);
                interaction.editOriginalMessage({ 
                    embed: {
                        title: is_category,
                        description: `This category consists of ${fields.length} commands.`,
                        fields,
                        footer: { text: 'You can also use the help command to view info about a command!' }
                    },
                    components: component.parse()
                });
            })
            .on('end', () => {
                component.disable('all');
                interaction.editOriginalMessage({ components: component.parse() });
            });
        }

        const is_cmd = this.client.commands.find(cmd => cmd.name === args.command_or_category.toLowerCase());
        const is_category = this.client.categories.find(category => category.toLowerCase() === args.command_or_category.toLowerCase());

        if (is_category) {
            const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => Object.assign({}, { name: cmd.name, value: cmd.description }));
            return interaction.createFollowup({ embed: {
                title: is_category,
                description: `This category consists of ${fields.length} commands.`,
                fields
            }});
        } else if (is_cmd) {
            let usage = `**/**${is_cmd.name} `;
            is_cmd.options?.forEach(option => { usage += option.required ? `[${option.name}]` : `(${option.name})` });
            return interaction.createFollowup({ embed: {
                title: `${is_cmd.category} : ${this.client.extensions.string.upperFirst(is_cmd.name)}`,
                fields: [
                    { name: 'Description', value: is_cmd.description ?? 'No description provided' },
                    { name: 'Usage', value: usage.split(' ')[1] ? `${usage.split(' ')[0]} \`${usage.split(' ')[1]}\`` : 'No usage-example provided'  }
                ],
                footer: { text: '[ ] = Required Arguments      ( ) = Optional Arguments' }
            }});
        }

        return interaction.createFollowup({ embed: { description: `\`${args.command_or_category}\` **is not a valid command/category, try once more.**` }});
    }
}