'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');
const componentHelper = require('@units/ComponentHandler');
const interactionCollector = require('@units/InteractionCollector');
const modLogs = require('@units/ModLogs');
const enc = require('crypto');

module.exports = class Mute extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Mute a specified member',

            clientPermissions: ['moderateMembers'],
            userPermissions: ['moderateMembers'],
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.USER,
                name: 'member',
                description: 'The member to mute',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, args) {
        const member = interaction.data.resolved?.members?.get(args.member);
        const guild = interaction.member.guild;
        const bot = interaction.data.resolved?.members?.get(this.client.user.id);
        
        if (!member) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find provided member.'));
        if (member.bot) return interaction.createFollowup(this.client.utils.errorEmbed('I refuse to mute another bot.'));
        if (member.id === interaction.member.id) return interaction.createFollowup(this.client.utils.errorEmbed('You cannot mute yourself, silly.'));
        
        const isSuperior = (this.client.utils.superior(bot, member) && this.client.utils.superior(interaction.member, member));
        if (!isSuperior) return interaction.createFollowup(this.client.utils.errorEmbed('I cannot take action against this user due to them owning the server or having a higher position than you or I.'));

        const identId = enc.randomUUID().substring(0, 5);
        const buttonHolder = new componentHelper();

        const time_enums = { '60 Seconds': 60, '5 Minutes': 300, '10 Minutes': 600, '30 Minutes': 1800, '1 Hour': 3600, '12 Hours': 43200, '1 Day': 86400, '1 Week': 604800 };
        Object.entries(time_enums).forEach(time => buttonHolder.createButton(time[0], Constants.ButtonStyles.SECONDARY, `id${identId} ${interaction.member.id} time${time[0]}`));
        buttonHolder.createButton('Cancel', Constants.ButtonStyles.DANGER, `id${identId} ${interaction.member.id} timecancel`);
        
        interaction.createFollowup({
            embed: {
                title: 'Mute',
                description: 'Click one of the buttons below to determine the duration of the mute.\n**You have 1 minute to respond**.',
                footer: { text: `Mute for ${member.username}#${member.discriminator}` },
                color: 0xFDFD96
            },
            components: buttonHolder.parse()
        });
        
        const choice = await new interactionCollector(this.client, {
            time: 60000,
            maxMatches: 1,
            filter: i => (i.data.custom_id.match(/(?<iden>^id)(?<id>.{5})/).groups.id === identId) && (i.message.channel.id === interaction.channel.id) && (interaction.member.id === i.member.id)
        }).lastInteraction;
        if (!choice.length) return interaction.editOriginalMessage(Object.assign(this.client.utils.errorEmbed('You did not respond in time.'), { components: [] }));
        
        const time = choice[0].interaction.data.custom_id.match(/(?<iden>time)(?<time>.+)/).groups.time;
        if (time === 'cancel') return interaction.editOriginalMessage({ embed: { description: 'Cancelled mute.', color: 0xCDE9F6 }, components: [] });

        const oldCDU = member.communicationDisabledUntil;
        try { 
            await guild.editMember(member.id, { communicationDisabledUntil: new Date(Date.now() + (time_enums[time] * 1000)).toISOString() });
        } catch {
            return interaction.editOriginalMessage(Object.assign(this.client.utils.errorEmbed('The user has administrator permissions or an unknown error occured while muting them.'), { components: [] }));
        }

        const poop = oldCDU ? 'Changed mute time for' : 'Muted';
        const poop2 = oldCDU ? 'to' : 'for';

        interaction.editOriginalMessage({ embed: { description: `${poop} \`${member.username}#${member.discriminator}\` ${poop2} **${time}**`, color: 0x77DD77 }, components: [] });
        return (new modLogs(this.client, interaction)).postModLog(`$${interaction.member.mention} has muted ${member.mention} for **${time}**`, {
            name: 'Information',
            value: `• Moderator: \`${interaction.member.username}#${interaction.member.discriminator}\`\n• Action Against: ${member.username}#${member.discriminator}`
        });
    }
}