#!/usr/bin/env node

const process = require('process');
const path = require('path');
const Testla = require('../src/testla');

const configPath = path.resolve(__dirname, process.argv[2]);
const t = new Testla(configPath);

t.runTests();
