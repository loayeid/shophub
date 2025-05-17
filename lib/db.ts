import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'shophub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(sql, params);
    return (rows as any[])[0] || null;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  return await queryOne('SELECT * FROM users WHERE email = ?', [email]);
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const id = uuidv4(); // Generate UUID for user ID
  const sql = 'INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)';
  const result = await query(sql, [id, name, email, password]);
  return { id, name, email };
}

export async function getAllStaff() {
  return await query('SELECT id, name, email, role FROM users WHERE role IN ("admin", "manager")');
}

export async function updateUserRole(userId: string, role: string) {
  return await query('UPDATE users SET role=? WHERE id=?', [role, userId]);
}

export async function inviteStaff({ name, email, role }: { name: string; email: string; role: string }) {
  const id = uuidv4();
  // In a real app, generate a temp password or invite link and email it
  const sql = 'INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)';
  await query(sql, [id, name, email, role]);
  return { id, name, email, role };
}
