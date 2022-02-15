'use strict';

require('module-alias/register');
require('dotenv').config();

/* The code below is creating a new Saurus client and then initiating it. */
const Saurus = require('@core/Client');
new Saurus(process.env.KEY).initiate();