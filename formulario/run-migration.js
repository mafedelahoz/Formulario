const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_EZyA8zek0VTp@ep-sweet-night-ahw5bea9-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: connectionString,
});

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, 'database', 'migration_add_enrichment.sql');
    const migration = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Conectando a la base de datos...');
    const client = await pool.connect();
    
    console.log('Ejecutando migración...');
    await client.query(migration);
    
    console.log('✓ Migración ejecutada exitosamente');
    console.log('✓ Columnas ticket_promedio y segmento agregadas');
    console.log('✓ Índice creado');
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('Error al ejecutar migración:', error.message);
    process.exit(1);
  }
}

runMigration();
