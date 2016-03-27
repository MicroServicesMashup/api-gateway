'use strict';

const DISCOVERY_URLS    = (process.env.DISCOVERY_URLS || '').split(',').concat(['http://46.101.251.23:8500']);
const http              = require('lc-http-client')({ discoveryServers: DISCOVERY_URLS });

const accountSeedData   = require('../seeds/accounts.json');

module.exports = () => {
  const addAccountSeeds = http
    .post('couchdb', '/accounts/_bulk_docs', { docs: accountSeedData })
    .then(data => {
      console.log('Bulk update account seeds done.');

      const stats = data.reduce((state, next) => {
        if(next.error == 'conflict') state.conflict += 1;
        else if(next.error) state.error += 1;
        else state.success += 1;
        return state;
      },{conflict: 0, success: 0, error: 0});

      console.log(stats);

      return data;
    });

  return Promise.all([
    addAccountSeeds
  ]);
};
