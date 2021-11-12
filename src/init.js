'use strict';

require('module-alias/register');
require('dotenv').config();

const Saurus = require('@structures/Client');
new Saurus(process.env.KEY).Initiate();