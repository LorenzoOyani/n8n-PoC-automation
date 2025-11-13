require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {Pool} = require('pg');


const app = express();
const PORT = process.env.PORT || 3000;


const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.path}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({status: 'healthy', timeStamp: new Date().toISOString()});
});

/// EndPoint 1 - get Wallet balance for n8n.
app.get('/api/get-wallet-balance', async (req, res) => {
    try {
        const {id} = req.query;

        if (!id) {
            return res.status(400).json({error: `Missing parameter: id`});
        }

        const result = await pool.query(
            'SELECT wallet_balance FROM subscribers WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'subscriber not found'
            });
        }

        const walletBalance = parseFloat(result.rows[0].wallet_balance);
        console.log(`Fetched wallet balance for subscriber ${id}: $${walletBalance}`);

        res.json({
            walletBalance: walletBalance,
            subscriber_id: id
        });

    } catch (err) {
        console.error('Error fetching wallet balance: ', err);
        res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
});

///API Endpoint 2:
app.post('/api/trigger-wallet-email', async (req, res) => {
  try {
    const { subscriberId } = req.body;

    if (!subscriberId) {
      return res.status(400).json({
        error: 'Missing required parameter: subscriberId'
      });
    }

    // Verify subscriber exists
    const checkResult = await pool.query(
      'SELECT id, email, first_name FROM subscribers WHERE id = $1',
      [subscriberId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    const subscriber = checkResult.rows[0];
    console.log(`Triggering n8n workflow for ${subscriber.email}...`);

    // Trigger n8n webhook
    const n8nResponse = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      { subscriberId: subscriberId },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log(`n8n workflow triggered successfully for subscriber ${subscriberId}`);

    res.json({
      success: true,
      message: 'Workflow triggered successfully',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        name: subscriber.first_name
      },
      n8n_response: n8nResponse.data
    });

  } catch (error) {
    console.error('Error triggering workflow:', error);

    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: 'Cannot connect to n8n',
        message: 'Make sure n8n is running and the webhook URL is correct'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});


// Get single subscriber (helper endpoint)
// app.get('/api/subscribers/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//
//     const result = await pool.query(
//       'SELECT * FROM subscribers WHERE id = $1',
//       [id]
//     );
//
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Subscriber not found' });
//     }
//
//     res.json(result.rows[0]);
//
//   } catch (error) {
//     console.error('Error fetching subscriber:', error);
//     res.status(500).json({
//       error: 'Internal server error',
//       message: error.message
//     });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`
    Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}           ║

  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing database pool...');
  await pool.end();
  process.exit(0);
});
