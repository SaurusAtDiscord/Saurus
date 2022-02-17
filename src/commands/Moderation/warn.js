'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

module.exports = class Warn extends Command {
    constructor(client) {
        super(client, {
            name: 'warn',
            description: 'Warn a specified user',

            clientPermissions: ['moderateMembers'],
            subCommandUserPermissions: { add: ['moderateMembers'], remove: ['moderateMembers'], clear: ['moderateMembers'] },
            
            options: [{
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'add',
                description: 'Add warning to a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to warn',
                    required: true
                }, {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'reason',
                    description: 'The reason for the following warning'
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'list',
                description: 'List all warnings for a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to list warnings',
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'remove',
                description: 'Remove a warning from a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to remove a warn from',
                    required: true
                }, {
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    name: 'id',
                    description: 'The id of the warning to remove, use list to view ids',
                    required: true
                }]
            }, {
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                name: 'clear',
                description: 'Clear warnings from a user',
                options: [{
                    type: Constants.ApplicationCommandOptionTypes.USER,
                    name: 'target',
                    description: 'The user to clear warnings from',
                    required: true
                }]
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    execute(interaction, data) {
        const { subCommand, args } = data;
        switch(subCommand) {
          case 'add':
            break;
          case 'list':
            break;
          case 'remove':
            break;
          case 'clear':
            break;
          default:
            interaction.createFollowup({ embed: { description: 'Invalid sub command' }});
            break;
        }
    }
}