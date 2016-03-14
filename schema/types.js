'use strict';

const Graphql           = require('graphql');
const GraphQLRelay      = require('graphql-relay');

const nodeDefinitions   = require('./definitions');
const resolver          = require('./resolver');

const AccountType = new Graphql.GraphQLObjectType({
  name: 'Account',
  interfaces: [nodeDefinitions.nodeInterface],
  fields: () => ({
    id: GraphQLRelay.globalIdField('Account'),
    email: { type: Graphql.GraphQLString },
    name: { type: Graphql.GraphQLString },
    password: { type: Graphql.GraphQLString },
  })
});

const StoreType = new Graphql.GraphQLObjectType({
  name: 'Store',
  fields: () => ({
    accounts: {
      type: new Graphql.GraphQLList(AccountType),
      resolve: resolver.accounts.all
    }
  })
});

module.exports = {
  AccountType: AccountType,
  StoreType: StoreType,
};
