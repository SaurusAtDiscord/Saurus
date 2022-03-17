'use strict';

const Eris = require('eris');

const { init } = require('@sentry/node');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = class SaurusNode extends Eris.Client {
    /**
     * Create Saurus Node.
     * @param { String } key The bot's token.
     */
    constructor(key) {
        super(key, {
            restMode: true,
            compress: true,
            maxShards: 'auto',
			intents: [
                'directMessages',
				'guildBans',
				'guildMembers',
				'guilds'
			],
            disableEvents: { TYPING_START: true }
        });
         
        this.commands = []
        this.categories = []

        this.database = new (require('@units/databasehandler'));
        this.utils = new (require('@extensions/utils'))(this);
        this.stringUtils = require('@extensions/stringUtils');
    }

    /**
     * Loads all the commands in the commands directory.
     * @param { String } dir The directory to load commands from.
     */
    #loadCommands(dir) {
        readdirSync(dir)
        .forEach(f => {
            this.categories.push(f);
            const directory = readdirSync(`${dir}/${f}`).filter(file => file.endsWith('.js'));
            directory.map(file => require(`${dir}/${f}/${file}`)).forEach(cmd => this.commands.push(Object.assign(new cmd(this), { category: f })));
        });
    }

    /**
     * Load all the JavaScript files in the events directory and execute them.
     * @param { String } dir The directory to load events from.
     */
    #loadEvents(dir) {        
        readdirSync(dir).filter(file => file.endsWith('.js'))
        .forEach(ev => {
            const event = require(`${dir}/${ev}`);
            const loaded = new event(this);
            this[event.name === 'ready' ? 'once' : 'on'](event.name, loaded.execute.bind(loaded));
        });
    }

    /**
     * Loads the commands and events from the commands and events directories and then connects to the Discord API.
     */
    initiate() {
        this.#loadCommands(join(__dirname, '../commands'));
        this.#loadEvents(join(__dirname, '../events'));

        init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV, attachStacktrace: true });
        Promise.all([this.database.fire('$connect'), this.connect()]);
    }
}