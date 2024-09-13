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

app.http('deleteTodoList', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const id = request.query.id;
        if (!id) {
            return { status: 400, body: { message: 'ID is required' } };
        }

        try {
            await sql.connect(config);
            await sql.query`DELETE FROM ToDo WHERE id = ${id}`;
            return { status: 200, body: { message: 'ToDo item deleted' } };
        } catch (err) {
            context.log.error(err);
            return { status: 500, body: { message: 'Internal Server Error' } };
        } finally {
            await sql.close();
        }
    }
});
