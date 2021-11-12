'use strict';

const { Constants } = require('eris');

module.exports = class ButtonHelper {
    constructor(maxRows) {
        this.maxRows = maxRows ?? 5;
        this.rows = [];
    }

    _createRow() {
        this.rows.push({ type: Constants.ComponentTypes.ACTION_ROW, components: [] });
    }

    _addRowIfRequired() {
        if (this.rows.length === 0 || this.rows[this.rows.length - 1].components.length >= this.maxRows || this.rows[this.rows.length - 1].components[0]?.type === 3) this._createRow();
    }

    _removeEmptyRows() {
        this.rows.filter(row => row.components.length === 0).forEach(row => this.rows.splice(this.rows.indexOf(row), 1));
    }

    parse() {
        this._removeEmptyRows();
        return this.rows;
    }

    createButton(label, style, custom_id, disabled) {    
        this._addRowIfRequired();
        this.rows[this.rows.length - 1].components.push({
            type: Constants.ComponentTypes.BUTTON,
            label,
            style,
            custom_id,
            disabled: disabled ?? false
        });
    }
}