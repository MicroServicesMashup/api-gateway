'use strict';

const GraphQLRelay      = require('graphql-relay')

const resolver          = require('./resolver');

module.exports = GraphQLRelay.nodeDefinitions(globalId => {
  var idInfo = GraphQLRelay.fromGlobalId(globalId);
  if (idInfo.type == 'Account') return resolver.accountsLoader.load(idInfo.id);
  return null;
}, (obj) => {
  return null;
});
