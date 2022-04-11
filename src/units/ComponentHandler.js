'use strict';

const { Constants } = require('eris');

module.exports = class ButtonHelper { // Credit to Spencer0003 and DonovanDMC
    /**
     * @param [maxRows=5] The maximum number of rows that the component row can have. 5 is the max.
     */
    constructor(maxRows = 5) {
        this.maxRows = maxRows;
        this.rows = [];
    }

    /**
     * Create a new row in the rows array.
     */
    createRow() {
        this.rows.push({ type: Constants.ComponentTypes.ACTION_ROW, components: [] });
    }

    /**
     * If the last row in the table has reached the maximum number of rows, or if the last row in the table has no components, then create a new row.
     */
    #addRowIfRequired() {
        if (this.rows.length === 0 || this.rows[this.rows.length - 1].components.length >= this.maxRows || this.rows[this.rows.length - 1].components[0]?.type === 3) this.createRow();
    }

    /**
     * Remove any row that has no components in it.
     */
    #removeEmptyRows() {
        this.rows.filter(row => row.components.length === 0).forEach(row => this.rows.splice(this.rows.indexOf(row), 1));
    }

    /**
     * Disable all the components in the form.
     * @param { String } input Provide all to disable all components(buttons) or a custom_id.
     */
    disable(input) {
        this.rows.forEach(row => row.components.forEach(component => { component.disabled = (input === 'all' || component.custom_id === input) }));
    }

    /**
     * Return the components inside of the rows array.
     * @returns { Array } The parsed and cleansed rows.
     */
    parse() {
        this.#removeEmptyRows();
        return this.rows;
    }

    /**
     * Create a button.
     * @param { String } label The text to display on the button.
     * @param { Number } style The style of the button.
     * @param { String } custom_id A custom ID for the button. This is used to identify the button in callback.
     * @param { String } [emoji] The emoji to use for the button.
     * @param { Boolean } [disabled] The choice of disabling the button.
     */
    createButton(label, style, custom_id, emoji, disabled) {
        this.#addRowIfRequired();
        this.rows[this.rows.length - 1].components.push({
            type: Constants.ComponentTypes.BUTTON,
            label,
            style,
            [style === Constants.ButtonStyles.LINK ? 'url' : 'custom_id']: custom_id,
            emoji,
            disabled
        });
    }
}