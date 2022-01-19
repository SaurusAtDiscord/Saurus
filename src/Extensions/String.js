'use strict';

module.exports = {
    /**
     * A function that takes a string and returns the first letter capitalized.
     * @param { String } string The string to be uppercased.
     * @returns { String } The string with the first letter capitalized.
     */
    upperFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    /**
     * *Split a string into an array of numbers.*
     * @param { String } string The string to be split.
     * @returns { String } The string with all non-numeric characters removed.
     */
    splitNumbers(string) {
        return string.replace(/[^0-9]/g, '');
    }
}