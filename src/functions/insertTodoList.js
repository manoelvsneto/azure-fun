const { app } = require('@azure/functions');

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

app.http('insertTodoList', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const { title, description } = request.body;
        if (!title) {
            return { status: 400, body: { message: 'Title is required' } };
        }

        try {
            await sql.connect(config);
            await sql.query`INSERT INTO ToDo (title, description) VALUES (${title}, ${description})`;
            return { status: 201, body: { message: 'ToDo item created' } };
        } catch (err) {
            context.log.error(err);
            return { status: 500, body: { message: 'Internal Server Error' } };
        } finally {
            await sql.close();
        }
    }
});