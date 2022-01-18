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
			],
            disableEvents: { TYPING_START: true }
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
            this.categories.push(f);
            const directory = readdirSync(`${dir}/${f}`).filter(file => file.endsWith('.js'));
            directory.map(file => require(`${dir}/${f}/${file}`)).forEach(cmd => this.commands.push(Object.assign(new cmd(this), { category: f })));
        });
    }

    loadEvents(dir) {        
        readdirSync(dir).filter(file => file.endsWith('.js'))
        .forEach(ev => {
            const event = require(`${dir}/${ev}`);
            const loaded = new event(this);
            this[event.name === 'ready' ? 'once' : 'on'](event.name, loaded.execute.bind(loaded));
        });
    }

    loadMisc() {
        const _extensions = this.extensions;
        Object.defineProperties(Eris.CommandInteraction.prototype, {
            getUser: { value(self) { return _extensions.eris.getUser(self) }},
            getMember: { value(...self) { return _extensions.eris.getMember(...self) }},
            getGuild: { value(self) { return _extensions.eris.getGuild(self || this.guild) }}
        });
    }

    initiate() {
        this.loadCommands(join(__dirname, '../commands'));
        this.loadEvents(join(__dirname, '../events'));
        this.loadMisc();

        init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
        this.connect();
    }
}