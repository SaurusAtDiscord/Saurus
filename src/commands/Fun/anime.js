'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

const axios = require('axios');

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
        const ql = `
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
        
        let result;
        try {
            result = await axios({
                method: 'post',
                url: 'https://graphql.anilist.co',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                data: JSON.stringify({ query: ql, variables: { name: query }})
            });
        } catch (err) {
            if (axios.isAxiosError(err)) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find any results based on what you searched.'));
        }
        
        result = result.data.data.Media;
        let description = result.description;
        [/<[^>]+>/ig, /\(Source: .+\)/gm].forEach(reg => { description = description.replace(reg, '') });
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