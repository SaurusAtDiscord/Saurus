'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const componentHelper = require('@units/ComponentHandler');
const interactionCollector = require('@units/InteractionCollector');
const enc = require('crypto');

module.exports = class Mute extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Mute a specified user',

            clientPermissions: ['moderateMembers'],
            userPermissions: ['moderateMembers'],
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'target',
                description: 'The user to mute',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const guild = await this.client.utils.getGuild(interaction.guildID);
        const member = await this.client.utils.getMember(interaction.guildID, args.target).catch(() => {});
        
        if (!member) return interaction.createFollowup({ embed: { description: 'Could not find provided user.' }});
        if (member.bot) return interaction.createFollowup({ embed: { description: 'Muting a bot is not permitted.' }});
        if (member.id === interaction.member.id) return interaction.createFollowup({ embed: { description: 'You cannot mute yourself.' }});

        const identId = enc.randomUUID().substring(0, 5);
        const buttonHolder = new componentHelper();

        const time_enums = { '60Seconds': 60, '5Minutes': 300, '10Minutes': 600, '30Minutes': 1800, '1Hour': 3600, '12Hours': 43200, '1Day': 86400, '1Week': 604800 };
        Object.entries(time_enums).forEach(time => buttonHolder.createButton(time[0].replace(/(\d)([a-z])/gi, '$1 $2'), Constants.ButtonStyles.SECONDARY, `${identId} ${interaction.member.id} ${time[0]}`));
        
        interaction.createFollowup({ 
            embed: {
                title: 'Mute',
                description: 'Click one of the buttons below to determine the duration of the mute.\n**You have 1 minute to respond**.',
                footer: { text: `Mute for ${member.username}#${member.discriminator}` }
            },
            components: buttonHolder.parse()
        });
        
        let choice = await new interactionCollector(this.client, {
            time: 10000,
            maxMatches: 1,
            filter: i => (i.data.custom_id.split(' ')[0] === identId) && (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
        }).collectInteractions();
        if (!choice.length) return interaction.editOriginalMessage({ embed: { description: 'You did not respond in time.' }, components: [] });
        choice = choice[0].interaction.data.custom_id.split(' ')[2];

        const success = await guild.editMember(member.id, { communicationDisabledUntil: new Date(Date.now() + (time_enums[choice] * 1000)).toISOString() });
        if (!success) return interaction.editOriginalMessage({ embed: { description: 'Could not mute user.' }, components: [] });

        interaction.editOriginalMessage({ 
            embed: { 
                description: `Successfully muted \`${member.username}#${member.discriminator}\` for **${choice.replace(/(\d)([a-z])/gi, '$1 $2')}**` 
            },
            components: []
        });
    }
}