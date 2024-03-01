import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: "parola",
    host: "localhost",
    port: 5432,
    database: "afterschool"
});

export default pool;