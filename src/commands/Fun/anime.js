'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

const fetch = require('node-fetch');

module.exports = class Anime extends Command {
    constructor(client) {
        super(client, {
            name: 'anime',
            description: 'Scrapes anilist.co for what you query',

            options: [{
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: 'query',
                description: 'The anime to search for',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, { query }) {
        const _query = `
            query ($name: String) {
                Media (search: $name, type: ANIME) {
                    siteUrl
                    coverImage { large }
                    title { english, native }
                    description
                    episodes
                    isAdult
                }
            }
        `

        const queried = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ query: _query, variables: { name: query }})
        });

        let result = await (queried?.json()?.then(res => res.errors ? null : res));
        if (!result) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find any results based on what you searched.'));
        result = result.data.Media;
        
        const description = (result.description.replace(/<[^>]+>/ig, '')).replace(/\(Source: .+\)/gm, '');
        return interaction.createFollowup({ embed: {
            author: {
                name: (result.title.english ?? result.title.native ?? result.title.romaji),
                url: result.siteUrl
            },
            description: `*${description.trim()}*`,
            fields: [{
                name: 'Details',
                value: `• **${result.episodes}** episode(s)\n• Adult content: ${result.isAdult ? '✅' : '❌'}`
            }],
            image: { url: result.coverImage?.large }
        }});
    }
}