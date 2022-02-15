'use strict';

const Command = require('@core/Command');
const ButtonHelper = require('@units/ComponentHandler');
const InteractionCollector = require('@units/InteractionCollector');

const { Constants } = require('eris');
const enc = require('crypto');

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

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        if (Object.keys(args).length === 0) {
            const component = new ButtonHelper();
            const uniId = enc.randomUUID().substring(0, 5);

            this.client.categories.forEach(category => component.createButton(category, Constants.ButtonStyles.SECONDARY, `${uniId} ${interaction.member.id} ${category}`));
            
            component.createRow();
            component.createButton('Our Discord', Constants.ButtonStyles.LINK, 'https://discord.gg/DEHSHTEj3h');

            interaction.createFollowup({ 
                embed: {
                    title: 'Help',
                    description: `You can observe available categories by clicking the buttons below.`
                },
                components: component.parse()
            });
            
            const collector = await new InteractionCollector(this.client, {
                time: 60000,
                filter: i => (i.data.custom_id.split(' ')[0] === uniId) && (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
            });
            return collector.on('collect', res => {
                const data = res.data.custom_id;
                const is_category = this.client.categories.find(category => category === data.split(' ')[2]);
                const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => { return { name: cmd.name, value: cmd.description }});

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
            const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => { return { name: cmd.name, value: cmd.description }});
            return interaction.createFollowup({ embed: {
                title: is_category,
                description: `This category consists of ${fields.length} commands.`,
                fields
            }});
        } else if (is_cmd) {
            let usage = `**/**${is_cmd.name} `;
            is_cmd.options?.forEach(option => { usage += option.required ? `[${option.name}]` : `(${option.name})` });

            usage = usage.split(' ');
            return interaction.createFollowup({ embed: {
                title: `${is_cmd.category} : ${this.client.stringUtils.upperFirst(is_cmd.name)}`,
                fields: [
                    { name: 'Description', value: is_cmd.description ?? 'No description provided' },
                    { name: 'Usage', value: usage[1] ? `${usage[0]} \`${usage[1]}\`` : 'No usage-example provided' },
                    { name: 'Permissions', value: `• User: \`${is_cmd.userPermissions?.join(', ') ?? 'None'}\`\n• Me: \`${is_cmd.clientPermissions?.join(', ') ?? 'None'}\`` }
                ],
                footer: { text: '[ ] = Required Arguments      ( ) = Optional Arguments' }
            }});
        }

        return interaction.createFollowup({ embed: { description: `\`${args.command_or_category}\` **is not a valid command/category, try once more.**` }});
    }
}