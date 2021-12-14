'use strict';

require('module-alias/register');
require('dotenv').config();

const Saurus = require('@core/Client');
new Saurus(process.env.KEY).initiate();