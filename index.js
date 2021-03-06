/**
 * Created by Adriano on 25/02/2017.
 */
const Server = require('./server/middleware/server');
const DotEnv = require('dotenv');
const routes = require('./server/routes');
const httpRoutes = routes().filter(route => route.http);
const path = require('path');

// Setup DotEnv
DotEnv.config({
    silent: true
});

const app = new Server(path.resolve(__dirname));
app.setPort(process.env.PORT);
app.start();
app.serveRoutes(httpRoutes);
