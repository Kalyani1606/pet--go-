const db = require('./db');
try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables.map(t => t.name));
    
    const userCols = db.prepare("PRAGMA table_info(users)").all();
    console.log('User columns:', userCols.map(c => c.name));
} catch (err) {
    console.error('Check error:', err);
}
