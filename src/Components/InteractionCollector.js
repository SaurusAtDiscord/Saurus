"use strict";

const EventEmitter = require("eventemitter3");

class InteractionHandler extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = options;
    this.ended = false;
    this.collected = [];
    this.listener = (interaction) => this.checkPreConditions(interaction);
    this.options.client.on("interactionCreate", this.listener);

    if (options.time) {
      setTimeout(() => this.stopListening("time"), options.time);
    }
  }

  checkPreConditions(interaction) {
    if (this.options.filter(interaction)) {
      this.emit("collect", interaction);
      this.collected.push({ interaction });

      if (this.collected.length >= this.options.maxMatches) {
        this.stopListening("maxMatches");
        return true;
      }

      return;
    }

    return false;
  }

  /**
   * Stops collecting interactions and removes the listener from the client
   * @param {string} reason The reason for stopping
   */
  stopListening(reason) {
    if (this.ended) return;
    this.ended = true;

    if (!this.permanent) {
      this.options.client.removeListener("interactionCreate", this.listener);
    }

    this.emit("end", this.collected, reason);
  }
}

module.exports = {
  collectInteractions: (options) => {
    return new InteractionHandler(options);
  },
};
