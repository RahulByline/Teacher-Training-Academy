import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crm_new',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
   await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.query(`USE \`${dbConfig.database}\``);

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(191) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        role ENUM('admin', 'manager', 'user') DEFAULT 'user',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL
      )
    `);

    // Create companies table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        website VARCHAR(255),
        linkedin_url VARCHAR(255),
        facebook_url VARCHAR(255),
        twitter_url VARCHAR(255),
        industry VARCHAR(100),
        num_employees INT,
        annual_revenue BIGINT,
        total_funding BIGINT,
        latest_funding BIGINT,
        latest_funding_amount BIGINT,
        last_raised_at DATE,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        phone VARCHAR(50),
        seo_description TEXT,
        keywords TEXT,
        subsidiary_of INT,
        custom_fields JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_name (name),
        INDEX idx_industry (industry),
        FOREIGN KEY (subsidiary_of) REFERENCES companies(id) ON DELETE SET NULL
      )
    `);

    // Create company_locations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS company_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT NOT NULL,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        phone VARCHAR(50),
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
      )
    `);

    // Create contacts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        title VARCHAR(100),
        seniority VARCHAR(100),
        department_id INT,
        company_id INT,
        owner_id INT,
        stage VARCHAR(100),
        lists TEXT,
        last_contacted DATE,
        person_linkedin_url VARCHAR(255),
        contact_owner INT,
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        postal_code VARCHAR(20),
        custom_fields JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (contact_owner) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_company_id (company_id),
        INDEX idx_department_id (department_id),
        INDEX idx_owner_id (owner_id)
      )
    `);

    // Create emails table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS emails (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        email VARCHAR(191) NOT NULL,
        type ENUM('primary', 'secondary', 'tertiary') DEFAULT 'primary',
        status VARCHAR(50),
        source VARCHAR(100),
        confidence VARCHAR(50),
        catch_all_status VARCHAR(50),
        last_verified_at DATE,
        is_primary BOOLEAN DEFAULT FALSE,
        unsubscribe BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
        INDEX idx_email (email),
        INDEX idx_contact_id (contact_id)
      )
    `);

    // Create phones table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS phones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        phone VARCHAR(50) NOT NULL,
        type ENUM('work', 'home', 'mobile', 'corporate', 'other') DEFAULT 'work',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
        INDEX idx_contact_id (contact_id)
      )
    `);

    // Create intent_scores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS intent_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        topic VARCHAR(100),
        score FLOAT,
        type ENUM('primary', 'secondary') DEFAULT 'primary',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
      )
    `);

    // Create activity_logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contact_id INT NOT NULL,
        type ENUM('email_sent', 'email_open', 'email_bounced', 'replied', 'demoed') NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

// Initialize database on startup
testConnection().then(() => {
  initializeDatabase();
});

export default pool;