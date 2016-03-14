'use strict';

const Graphql           = require('graphql');

const queries           = require('./queries');
const mutations         = require('./mutations');

module.exports = new Graphql.GraphQLSchema({
  query: queries,
  mutation: mutations
});
