require("module-alias/register");
require("dotenv").config();

const SaurusNode = require("@structures/Client");
void new SaurusNode(process.env.KEY).Initiate();