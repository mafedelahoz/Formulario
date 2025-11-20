const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_EZyA8zek0VTp@ep-sweet-night-ahw5bea9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function runSchema() {
  try {
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Conectando a la base de datos...');
    const client = await pool.connect();
    
    console.log('Ejecutando schema...');
    await client.query(schema);
    
    console.log('✓ Schema ejecutado exitosamente');
    console.log('✓ Tabla "leads" creada');
    console.log('✓ Índices creados');
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('Error al ejecutar schema:', error.message);
    process.exit(1);
  }
}

runSchema();
