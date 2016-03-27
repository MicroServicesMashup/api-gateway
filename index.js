'use strict';

const express         = require('express');
const cors            = require('cors');
const ejs             = require('ejs');
const bodyParser      = require('body-parser');
const endpoints       = require('express-endpoints');
const graphql         = require('graphql').graphql;

const SERVICE_PORT    = process.env.PORT || 8080;
const DISCOVERY_URLS  = (process.env.DISCOVERY_URLS || '').split(',').concat(['http://46.101.251.23:8500']);
const SERVICE_NAME    = process.env.SERVICE_NAME || 'music-store-management';

const schema              = require('./schema');
const buildAppTask        = require('./tasks/build-app');
const buildGraphIQLTask   = require('./tasks/build-graphiql');
const initSeedsTask       = require('./tasks/init-seeds');

const app   = express();

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

app.all('/graphiql', (req, res) => res.render('graphiql'));
app.get('/endpoints', endpoints());
app.get('/', (req, res) => res.render('app'));

buildAppTask()
  .then(buildGraphIQLTask)
  .then(initSeedsTask)
  .then(() => app.listen(SERVICE_PORT, () => console.log(`Listen on: ${SERVICE_PORT}`)))
  .catch(error => console.error(error));
