require("module-alias/register");
require("dotenv").config();

const SaurusNode = require("@structures/Client");
new SaurusNode(process.env.KEY).Initiate();
