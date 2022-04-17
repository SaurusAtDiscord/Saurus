'use strict';

const Command = require('@core/Command');
const { Constants } = require('eris');

const { searchAmazon } = require('unofficial-amazon-search');

module.exports = class Amazon extends Command {
    constructor(client) {
        super(client, {
            name: 'amazon',
            description: 'Scrapes Amazon.com products for what you query',

            options: [{
                type: Constants.ApplicationCommandOptionTypes.STRING,
                name: 'query',
                description: 'The products to search for',
                required: true
            }]
        });
    }

    /* Calling the method "execute" on Command class. */
    async execute(interaction, { query }) {
        let queryFor = (await searchAmazon(query, { includeSponsoredResults: false }))?.searchResults;
        if (!queryFor) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find any results based on what you searched.'));
        
        const oldLength = queryFor.length;
        const title = query.length >= 125 ? `${query.substring(0, 125)}...` : query;
        
        if (queryFor.length > 5) queryFor = queryFor.slice(0, 5);
        return interaction.createFollowup({ embed: {
            title: `Results for ${title}`,
            description: `Found \`${oldLength}\` results, only displaying \`5\`, some results may not be relevant.`,
            fields: queryFor.map(product => ({
                name: product.title,
                value: `[WebPage](https://amazon.com${product.productUrl})\n• Rating: \`${Math.max(0, Math.min(product.rating.score, 5))}/5\``
            })),
            image: { url: queryFor[0]?.imageUrl }
        }});
    }
}