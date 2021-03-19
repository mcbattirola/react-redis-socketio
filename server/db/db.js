let db = null;

const getDb = () => {
    if (!db) {
        db = require('knex')({
            client: 'pg',
            connection: {
                host : '127.0.0.1',
                user : 'postgres',
                password : 'postgres',
                database : 'postgres'
              },
            searchPath: ['public'],
          });
    }

    return db;
}

module.exports = getDb; 