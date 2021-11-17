'use strict';

const Eris = require('eris');

const { init } = require('@sentry/node');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = class SaurusNode extends Eris.Client {
    constructor(key) {
        super(key, {
            restMode: true,
            maxShards: 'auto',
            
			intents: [
				'guildBans',
				'guildMembers',
				'guildMessageReactions',
				'guildMessages',
				'guilds'
			]
        });
        
        this.commands = [ ];
        this.categories = [ ];
        
        this.extensions = {
            eris: new (require('@extensions/Eris'))(this),
            string: require('@extensions/String')
        }
    }

    loadCommands(dir) {
        readdirSync(dir)
        .forEach(f => {
            const directory = readdirSync(`${dir}/${f}`).filter(file => file.endsWith('.js'));
            directory.map(file => require(`${dir}/${f}/${file}`)).forEach(cmd => this.commands.push(new cmd(this)));
        });
    }

    loadEvents(dir) {        
        readdirSync(dir).filter(file => file.endsWith('.js'))
        .forEach(ev => {
            const event = require(`${dir}/${ev}`);
            this[event.name === 'ready' ? 'once' : 'on'](event.name, (...args) => (new event(this)).execute(...args));
        });
    }

    loadMisc() {
        const _extensions = this.extensions;
        Object.defineProperties(Eris.CommandInteraction.prototype, {
            getUser: { value(self) { return _extensions.eris.getUser(self) }},
            getMember: { value(...self) { return _extensions.eris.getMember(...self) }},
            getGuild: { value(self) { return _extensions.eris.getGuild(self || this.guildID) }}
        });

        readdirSync('./src/commands/').forEach(dir => this.categories.push(dir));
    }

    Initiate() {
        this.loadCommands(join(__dirname, '../Commands'));
        this.loadEvents(join(__dirname, '../Events'));
        this.loadMisc();

        init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
        this.connect();
    }
}