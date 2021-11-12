require("module-alias");
require("dotenv").config();

const Saurus = require("@structures/Client");
new Saurus(process.env.KEY).Initiate();