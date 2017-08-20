const chai = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const rewire = require('rewire');

global.assert = chai.assert;
global.sinon = sinon;
global.proxyquire = proxyquire;
global.rewire = rewire;
