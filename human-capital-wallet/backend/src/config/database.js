import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export const query = (text, params) => pool.query(text, params)

export async function getClient() {
  const client = await pool.connect()
  const release  = client.release.bind(client)
  const timeout  = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!')
  }, 5000)
  client.release = () => { clearTimeout(timeout); release() }
  return client
}

export default pool
