'use strict';

const Graphql           = require('graphql');
const GraphQLRelay      = require('graphql-relay');

const nodeDefinitions   = require('./definitions');
const types             = require('./types');
const resolver          = require('./resolver');

module.exports = new Graphql.GraphQLObjectType({
  name: 'Root',
  node: nodeDefinitions.nodeField,
  fields: {
    store: {
      type: types.StoreType,
      resolve: () => Promise.resolve({accounts: []})
    },
    accountById: {
      type: types.AccountType,
      args: {
        id: { type: Graphql.GraphQLID }
      },
      resolve: (_, args) => resolver.accounts.load(GraphQLRelay.fromGlobalId(args.id).id)
    },
  }
});
