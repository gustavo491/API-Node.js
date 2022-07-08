async function connect(){
    if(global.connection && global.connection.state !== 'disconnected')
        return global.connection
    
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection( require('../config') );
    
    global.connection = connection;
    return connection;
}

async function query(query, params) {
    try{
        const conn = await connect();
        return await conn.query(query, params);
    } catch (error) {
        return error;
    }
}

module.exports = {
    connect,
    query
}