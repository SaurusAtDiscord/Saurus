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
    async execute(interaction, args) {
        let queryFor = await searchAmazon(args.query, { includeSponsoredResults: false });
        if (!queryFor) return interaction.createFollowup(this.client.utils.errorEmbed('Could not find any results based on what you searched.'));
        queryFor = queryFor.searchResults;
        
        const oldLength = queryFor.length;
        const title = args.query.length >= 125 ? (args.query.substring(0, 125) + '...') : args.query;
        
        if (queryFor.length > 5) queryFor = queryFor.slice(0, 5);
        return interaction.createFollowup({ embed: {
            title: `Results for ${title}`,
            description: `Found \`${oldLength}\` results, only displaying \`5\` of them, some results may not be relevant.`,
            fields: queryFor.map(product => {
                if (product.rating.score < 0) product.rating.score = 0;
                return {
                    name: product.title,
                    value: `[WebPage](https://amazon.com${product.productUrl})\n• Rating: \`${product.rating.score}/5\``
                }
            }),
            image: { url: queryFor[0]?.imageUrl },
        }});
    }
}