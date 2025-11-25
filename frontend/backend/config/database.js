/**
 * Configuration de la connexion à la base de données MySQL
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de connexions (recommandé pour les applications)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'plateforme_location_etudiants',
  waitForConnections: true,
  connectionLimit: 10, // Nombre maximum de connexions simultanées
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4' // Support des emojis
});

/**
 * Test de connexion à la base de données
 * @returns {Promise<boolean>} true si connecté, false sinon
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie !');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error.message);
    console.error('   Vérifiez vos paramètres dans le fichier .env');
    return false;
  }
}

/**
 * Exécuter une requête SQL
 * @param {string} query - Requête SQL
 * @param {Array} params - Paramètres de la requête
 * @returns {Promise<Array>} Résultat de la requête
 */
async function query(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Erreur SQL:', error.message);
    throw error;
  }
}

/**
 * Obtenir une connexion du pool
 * @returns {Promise<Connection>} Connexion MySQL
 */
async function getConnection() {
  return await pool.getConnection();
}

module.exports = {
  pool,
  testConnection,
  query,
  getConnection
};


