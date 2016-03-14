'use strict';

const express         = require('express');
const cors            = require('cors');
const ejs             = require('ejs');
const bodyParser      = require('body-parser');
const graphql         = require('graphql').graphql;

const buildAppTask        = require('./tasks/build-app');
const buildGraphIQLTask   = require('./tasks/build-graphiql');
const schema              = require('./schema');

const SERVICE_PORT    = process.env.PORT || 8080;

const app = express();

app.enable('trust proxy');
app.disable('x-powered-by');
app.set('json spaces', 2);
app.set('etag', false);
app.set('views', __dirname + '/app/public');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/app/public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.options('*', cors());

app.all('/graphql', (req, res) => {
  graphql(schema, req.query.query || req.body.query || req.body, null, req.body.variables)
    .then(result => res.send(JSON.stringify(result, null, 4)));
});

app.use('/graphiql', (req, res) => {
  res.render('graphiql');
});

app.get('*', (req, res) => {
  res.render('app');
});

buildAppTask()
  .then(buildGraphIQLTask)
  .then(() => app.listen(SERVICE_PORT, () => console.log(`Listen on: ${SERVICE_PORT}`)));
