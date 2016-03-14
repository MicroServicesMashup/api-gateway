'use strict';

const Graphql           = require('graphql');
const GraphQLRelay      = require('graphql-relay');

const nodeDefinitions   = require('./definitions');
const types             = require('./types');
const resolver          = require('./resolver');

const UpsertAccountMutation = GraphQLRelay.mutationWithClientMutationId({
  name: 'UpsertAccount',
  inputFields: {
    id: { type: Graphql.GraphQLString },
    email: { type: Graphql.GraphQLString },
    name: { type: Graphql.GraphQLString },
    password: { type: Graphql.GraphQLString },
  },
  outputFields: {
    account: {
      type: types.AccountType,
      resolve: args => resolver.accounts.load(args.localAccountId)
    },
  },
  mutateAndGetPayload: (args) => {
    const localAccountId = GraphQLRelay.fromGlobalId(args.id).id;
    // upsertAccount(localAccountId, args);
    return Promise.resolve({localAccountId});
  },
});

const LoginMutation = GraphQLRelay.mutationWithClientMutationId({
  name: 'Login',
  inputFields: {
    name: { type: Graphql.GraphQLString },
    password: { type: Graphql.GraphQLString }
  },
  outputFields: {
    token: {
      type: Graphql.GraphQLString,
      resolve: args => args.globalAccountId
    }
  },
  mutateAndGetPayload: (args) => {
    return resolver.accounts
      .load(args.name)
      .then(result => {
        if(result.password !== args.password) return Promise.reject(new Error('Bad credentials'));
        const globalAccountId = GraphQLRelay.toGlobalId(args.name);
        return {globalAccountId};
      })
      .catch(error => Promise.reject(new Error('Bad credentials')));
  },
});

module.exports = new Graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    upsertAccount: UpsertAccountMutation,
    login: LoginMutation,
  })
});
