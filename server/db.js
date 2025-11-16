import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Function to read and execute a SQL file
const executeSQLFile = async (filePath) => {
  const sql = fs.readFileSync(path.resolve(filePath), 'utf8');
  try {
    const client = await pool.connect();
    await client.query(sql);
    client.release();
    console.log('SQL file executed successfully');
  } catch (err) {
    console.error('Error executing SQL file:', err);
  }
};

// Example usage
executeSQLFile('setup.sql');

export default pool;
