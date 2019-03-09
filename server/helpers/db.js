const Datastore = require('nedb');
const db = new Datastore({
    filename: './db/csgo.dat',
    autoload: true
});

db.loadDatabase();

module.exports = db