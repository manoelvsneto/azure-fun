const { app } = require('@azure/functions');
const sql = require('mssql');

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true, // Use encryption
        trustServerCertificate: true // Change this based on your environment
    }
};

app.http('getTodoList', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.id;
        try {
            await sql.connect(config);
            const result = id
                ? await sql.query`SELECT * FROM ToDo WHERE id = ${id}`
                : await sql.query`SELECT * FROM ToDo`;

            return { status: 200, body: result.recordset };
        } catch (err) {
            context.log.error(err);
            return { status: 500, body: { message: 'Internal Server Error' } };
        } finally {
            await sql.close();
        }
    }
});
