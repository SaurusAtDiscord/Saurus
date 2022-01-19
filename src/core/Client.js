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
         
        this.commands = [ ]
        this.categories = [ ]
        
        this.utils = new (require('@extensions/Eris'))(this);
        this.stringUtils = require('@extensions/String');
    }

    /**
     * Loads all the commands in the commands directory.
     * @param { String } dir The directory to load commands from.
     * @returns { null }
     */
    loadCommands(dir) {
        readdirSync(dir)
        .forEach(f => {
            this.categories.push(f);
            const directory = readdirSync(`${dir}/${f}`).filter(file => file.endsWith('.js'));
            directory.map(file => require(`${dir}/${f}/${file}`)).forEach(cmd => this.commands.push(Object.assign(new cmd(this), { category: f })));
        });
    }

    /**
     * Load all the JavaScript files in the `events` directory and execute them.
     * @param { String } dir - The directory to load events from.
     * @returns { null }
     */
    loadEvents(dir) {        
        readdirSync(dir).filter(file => file.endsWith('.js'))
        .forEach(ev => {
            const event = require(`${dir}/${ev}`);
            const loaded = new event(this);
            this[event.name === 'ready' ? 'once' : 'on'](event.name, loaded.execute.bind(loaded));
        });
    }

    /**
     * Loads the commands and events from the commands and events directories and then connects to the Discord API.
    * @returns { null }
    */
    initiate() {
        this.loadCommands(join(__dirname, '../commands'));
        this.loadEvents(join(__dirname, '../events'));

        init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
        this.connect();
    }
}