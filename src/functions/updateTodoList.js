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

app.http('updateTodoList', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { id, newTitle, newDescription } = request.body;
        if (!id || !newTitle) {
            return { status: 400, body: { message: 'ID and new title are required' } };
        }

        try {
            await sql.connect(config);
            await sql.query`UPDATE ToDo SET title = ${newTitle}, description = ${newDescription} WHERE id = ${id}`;
            return { status: 200, body: { message: 'ToDo item updated' } };
        } catch (err) {
            context.log.error(err);
            return { status: 500, body: { message: 'Internal Server Error' } };
        } finally {
            await sql.close();
        }
    }
});
