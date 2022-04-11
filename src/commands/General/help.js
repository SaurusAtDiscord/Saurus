'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const { randomUUID } = require('crypto');
const button = require('@units/ComponentHandler');
const collector = require('@units/InteractionCollector');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Provides bot assets or basic information',
            
            options: [{
                name: 'command_or_category',
                description: 'Get information on a specific command or category',
                type: Constants.ApplicationCommandOptionTypes.STRING
            }]
        });
    }

    /**
     * Create a usage string for a command
     * @param { String } name The name of the command.
     * @param { Array } options An array of objects that describe the options that the command accepts.
     * @returns { String } The usage string.
     */
    createUsage(name, options) {
        let usage = `**/**${name} `;
        options?.forEach(option => { usage += option.required ? `[${option.name}]` : `(${option.name})` });
        return usage;
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        if (!Object.keys(args).length) {
            const component = new button();
            const uniId = randomUUID().substring(0, 5);

            this.client.categories.forEach(category => component.createButton(category, Constants.ButtonStyles.SECONDARY, `${uniId} ${interaction.member.id} ${category}`));
            component.createRow();
            component.createButton('Support', Constants.ButtonStyles.LINK, 'https://discord.gg/DEHSHTEj3h');

            interaction.createFollowup({ 
                embed: {
                    title: 'Help',
                    description: 'You can observe available categories by clicking the buttons below.',
                    color: 0xCDE9F6
                },
                components: component.parse()
            });
            
            return new collector(this.client, {
                time: 60000,
                filter: i => (i.data.custom_id.split(' ')[0] === uniId) && (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
            }).on('collect', res => {
                const data = res.data.custom_id;
                const is_category = this.client.categories.find(category => category === data.split(' ')[2]);
                const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => ({ name: cmd.name, value: cmd.description }));

                component.disable(data);
                interaction.editOriginalMessage({ 
                    embed: {
                        title: is_category,
                        description: `This category consists of ${fields.length} commands.`,
                        fields,
                        footer: { text: 'You can also use the help command to view info about a command!' },
                        color: 0xCDE9F6
                    },
                    components: component.parse()
                });
            })
            .once('end', () => {
                component.disable('all');
                interaction.editOriginalMessage({ components: component.parse() });
            });
        }

        const is_cmd = this.client.commands.find(cmd => cmd.name === args.command_or_category.toLowerCase());
        const is_category = this.client.categories.find(category => category.toLowerCase() === args.command_or_category.toLowerCase());
        
        if (is_category) {
            const fields = this.client.commands.filter(cmd => cmd.category === is_category).map(cmd => ({ name: cmd.name, value: cmd.description }));
            return interaction.createFollowup({ embed: {
                title: is_category,
                description: `This category consists of ${fields.length} commands.`,
                fields,
                color: 0xCDE9F6
            }});
        } else if (is_cmd) {
            const usage = this.createUsage(is_cmd.name, is_cmd.options);

            const [cmdName, ...cmdArgs] = usage.split(' ');
            const subCommands = is_cmd.options?.filter(option => option.type === Constants.ApplicationCommandOptionTypes.SUB_COMMAND);

            const userPermissionsStringed = Object.keys(is_cmd.subCommandUserPermissions).length ? 'Permissions may differ per sub-command' : is_cmd.userPermissions.join(', ');
            const usageStringed = subCommands?.length ? 'This command contains sub-commands, check the embed below' : (cmdArgs[0]?.length ? `${cmdName} \`${cmdArgs}\`` : 'No usage-example');
            
            const embed = { embeds: [{
                title: `${is_cmd.category} : ${this.client.stringUtils.upperFirst(is_cmd.name)}`,
                fields: [
                    { name: 'Description', value: is_cmd.description ?? 'No description provided' },
                    { name: 'Usage', value: usageStringed },
                    { name: 'Permissions', value: `• User: \`${userPermissionsStringed}\`\n• Me: \`${is_cmd.clientPermissions.join(', ')}\`` }
                ],
                footer: { text: '[ ] = Required Arguments      ( ) = Optional Arguments' },
                color: 0xCDE9F6
            }]}

            if (subCommands?.length) embed.embeds.push({ title: 'Sub-Commands', fields: subCommands.map(sub => {
                const subUsage = this.createUsage(`${is_cmd.name} ${sub.name}`, sub.options);

                const subPerms = is_cmd.subCommandUserPermissions[sub.name];
                const [, subName, subArgs] = subUsage.match(/^(.{5}\w+ \w+)\s(.+)/i);
                return { name: sub.name, value: `• Description: ${sub.description}\n• Usage: ${subName} \`${subArgs}\`\n• Permissions: \`${subPerms?.join(', ') ?? 'None'}\`` }
            }), color: 0xCDE9F6 });
            return interaction.createFollowup(embed);
        }

        return interaction.createFollowup(this.client.utils.errorEmbed(`\`${args.command_or_category}\` **is not a valid command/category, try once more.**`));
    }
}