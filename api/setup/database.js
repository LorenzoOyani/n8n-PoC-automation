require('dotenv').config();
const {Pool} = require('pg');

console.log('Loaded DB env vars:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function setupDatabase() {
    const adminPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres',
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    let adminClient;

    try {
        console.log('Setting up database...');

        adminClient = await adminPool.connect();

        // Check if database exists
        const dbCheck = await adminClient.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [process.env.DB_NAME]
        );

        if (dbCheck.rows.length === 0) {
            await adminClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log(`Database '${process.env.DB_NAME}' created`);
        } else {
            console.log(`Database '${process.env.DB_NAME}' already exists`);
        }

    } catch (error) {
        console.error('Error creating database:', error.message);
        throw error;
    } finally {
        if (adminClient) adminClient.release();
        await adminPool.end();
    }

    const appPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    let appClient;

    try {
        appClient = await appPool.connect();

        // Create subscribers table
        await appClient.query(`
            CREATE TABLE IF NOT EXISTS subscribers (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                wallet_balance DECIMAL(10, 2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Subscribers table created');

        const sampleUsers = [
            {email: 'korede@bemamusic.com', first_name: 'Korede', last_name: 'Bema', wallet_balance: 100},
            {email: 'jerumehlawrence@gmail.com', first_name: 'Jerumeh', last_name: 'Lawrence', wallet_balance: 250.50},
        ];

        for (const user of sampleUsers) {
            await appClient.query(
                `INSERT INTO subscribers (email, first_name, last_name, wallet_balance)
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (email) DO UPDATE SET
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    wallet_balance = EXCLUDED.wallet_balance,
                    updated_at = CURRENT_TIMESTAMP`,
                [user.email, user.first_name, user.last_name, user.wallet_balance]
            );
        }

        console.log('Sample data inserted');

        // Display the data
        const result = await appClient.query('SELECT * FROM subscribers ORDER BY id');
        console.log('\nCurrent subscribers:');
        console.table(result.rows);

        console.log('\nDatabase setup complete!');

    } catch (error) {
        console.error('Error setting up tables:', error.message);
        throw error;
    } finally {
        if (appClient) appClient.release();
        await appPool.end();
    }
}

setupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Setup failed:', error);
        process.exit(1);
    });