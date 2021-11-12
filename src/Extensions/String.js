"use strict";

module.exports = {
  upperFirst: (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  splitNumbers: (string) => {
    return string.replace(/[^0-9]/g, "");
  },
};
