const path = require('path');
module.exports = {
    client: 'oracledb',
    connection:{
        host: '192.168.74.3:1521',
        user: 'mobilehealthcare',
        password: 'mobilehealthcare',
        database: 'orcl'
    },
    fetchAsString: ['number','clob'],
    useNullAsDefault: false
}