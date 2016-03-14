'use strict';

const DISCOVERY_URLS = (process.env.DISCOVERY_URLS || '').split(',').concat(['http://46.101.175.234:8500']);
const accountSeeds = require('./seeds/accounts.json');

const DataLoader = require('dataloader');
const http = require('lc-http-client')({
  discoveryServers: DISCOVERY_URLS
});

const accounts = new DataLoader(keys => {
  return http
    .post('couchdb1', '/accounts/_all_docs?include_docs=true', { keys: keys })
    .then(data => data.rows.map(row => {
      row.doc.id = row.doc._id;
      return row.doc;
    }));
});

accounts.all = () => http
    .get('couchdb1', '/accounts/_all_docs?include_docs=true')
    .then(data => data.rows.map(row => {
      row.doc.id = row.doc._id;
      return row.doc;
    }));

module.exports = {
  accounts: accounts
};
