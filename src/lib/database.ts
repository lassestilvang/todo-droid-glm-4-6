import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'tasks.db');

// Create data directory if it doesn't exist
import { mkdirSync } from 'fs';
const dataDir = join(process.cwd(), 'data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch {
  // Directory already exists
}

export const db = new Database(dbPath);

// Initialize database schema
export function initializeDatabase() {
  // Create task lists table
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_lists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#3b82f6',
      icon TEXT,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create labels table
  db.exec(`
    CREATE TABLE IF NOT EXISTS labels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#6b7280',
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      date DATETIME,
      deadline DATETIME,
      estimate TEXT,
      actual_time TEXT,
      priority TEXT DEFAULT 'none',
      is_recurring INTEGER DEFAULT 0,
      recurring_type TEXT,
      recurring_interval INTEGER,
      recurring_days_of_week TEXT,
      recurring_day_of_month INTEGER,
      recurring_end_date DATETIME,
      attachments TEXT,
      is_completed INTEGER DEFAULT 0,
      list_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (list_id) REFERENCES task_lists (id)
    )
  `);

  // Create subtasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      task_id TEXT NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  // Create task labels junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS task_labels (
      task_id TEXT NOT NULL,
      label_id TEXT NOT NULL,
      PRIMARY KEY (task_id, label_id),
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (label_id) REFERENCES labels (id) ON DELETE CASCADE
    )
  `);

  // Create activity logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      action TEXT NOT NULL,
      changes TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  // Create reminders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      reminder_time DATETIME NOT NULL,
      is_sent INTEGER DEFAULT 0,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `);

  // Insert default "Inbox" list if it doesn't exist
  const inboxExists = db.prepare('SELECT 1 FROM task_lists WHERE is_default = 1').get();
  if (!inboxExists) {
    db.exec(`
      INSERT INTO task_lists (id, name, color, icon, is_default)
      VALUES ('inbox', 'Inbox', '#3b82f6', '📥', 1)
    `);
  }

  // Insert default labels
  const defaultLabels = [
    { id: 'work', name: 'Work', color: '#3b82f6', icon: '💼' },
    { id: 'personal', name: 'Personal', color: '#10b981', icon: '🏠' },
    { id: 'urgent', name: 'Urgent', color: '#ef4444', icon: '🚨' },
    { id: 'shopping', name: 'Shopping', color: '#f59e0b', icon: '🛒' },
    { id: 'health', name: 'Health', color: '#8b5cf6', icon: '💪' },
  ];

  const stmt = db.prepare('INSERT OR IGNORE INTO labels (id, name, color, icon) VALUES (?, ?, ?, ?)');
  defaultLabels.forEach(label => {
    stmt.run(label.id, label.name, label.color, label.icon);
  });
}

// Task CRUD operations
export const taskQueries = {
  create: db.prepare(`
    INSERT INTO tasks (
      id, name, description, date, deadline, estimate, actual_time,
      priority, is_recurring, recurring_type, recurring_interval,
      recurring_days_of_week, recurring_day_of_month, recurring_end_date,
      attachments, is_completed, list_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),

  update: db.prepare(`
    UPDATE tasks SET
      name = ?, description = ?, date = ?, deadline = ?, estimate = ?,
      actual_time = ?, priority = ?, is_recurring = ?, recurring_type = ?,
      recurring_interval = ?, recurring_days_of_week = ?, recurring_day_of_month = ?,
      recurring_end_date = ?, attachments = ?, is_completed = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `),

  delete: db.prepare('DELETE FROM tasks WHERE id = ?'),

  getById: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE t.id = ?
    GROUP BY t.id
  `),

  getAll: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `),

  getByList: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE t.list_id = ?
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `),

  getToday: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE date(t.date) = date('now')
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `),

  getNext7Days: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE date(t.date) >= date('now') AND date(t.date) <= date('now', '+7 days')
    GROUP BY t.id
    ORDER BY t.date ASC
  `),

  getUpcoming: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE (t.date IS NULL OR date(t.date) >= date('now'))
    GROUP BY t.id
    ORDER BY 
      CASE 
        WHEN t.date IS NULL THEN '9999-12-31'
        ELSE t.date 
      END ASC
  `),

  search: db.prepare(`
    SELECT 
      t.*,
      JSON_GROUP_ARRAY(
        JSON_OBJECT(
          'id', sl.id,
          'title', sl.title,
          'isCompleted', sl.is_completed
        )
      ) as subtasks
    FROM tasks t
    LEFT JOIN subtasks sl ON t.id = sl.task_id
    WHERE t.name LIKE ? OR t.description LIKE ?
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `),
};

// Task list CRUD operations
export const listQueries = {
  create: db.prepare('INSERT INTO task_lists (id, name, color, icon) VALUES (?, ?, ?, ?)'),
  update: db.prepare('UPDATE task_lists SET name = ?, color = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
  delete: db.prepare('DELETE FROM task_lists WHERE id = ? AND is_default = 0'),
  getAll: db.prepare('SELECT * FROM task_lists ORDER BY is_default DESC, created_at ASC'),
  getById: db.prepare('SELECT * FROM task_lists WHERE id = ?'),
};

// Label CRUD operations
export const labelQueries = {
  create: db.prepare('INSERT INTO labels (id, name, color, icon) VALUES (?, ?, ?, ?)'),
  update: db.prepare('UPDATE labels SET name = ?, color = ?, icon = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM labels WHERE id = ?'),
  getAll: db.prepare('SELECT * FROM labels ORDER BY created_at ASC'),
  getById: db.prepare('SELECT * FROM labels WHERE id = ?'),
};

// Subtask CRUD operations
export const subtaskQueries = {
  create: db.prepare('INSERT INTO subtasks (id, title, is_completed, task_id) VALUES (?, ?, ?, ?)'),
  update: db.prepare('UPDATE subtasks SET title = ?, is_completed = ? WHERE id = ?'),
  delete: db.prepare('DELETE FROM subtasks WHERE id = ?'),
  getByTask: db.prepare('SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at ASC'),
};

// Task label junction operations
export const taskLabelQueries = {
  add: db.prepare('INSERT OR IGNORE INTO task_labels (task_id, label_id) VALUES (?, ?)'),
  remove: db.prepare('DELETE FROM task_labels WHERE task_id = ? AND label_id = ?'),
  getByTask: db.prepare(`
    SELECT l.* FROM labels l
    JOIN task_labels tl ON l.id = tl.label_id
    WHERE tl.task_id = ?
  `),
  removeByTask: db.prepare('DELETE FROM task_labels WHERE task_id = ?'),
};

// Activity log operations
export const activityQueries = {
  create: db.prepare('INSERT INTO activity_logs (id, task_id, action, changes) VALUES (?, ?, ?, ?)'),
  getByTask: db.prepare('SELECT * FROM activity_logs WHERE task_id = ? ORDER BY timestamp DESC'),
  getAll: db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC'),
};

// Reminder operations
export const reminderQueries = {
  create: db.prepare('INSERT INTO reminders (id, task_id, reminder_time) VALUES (?, ?, ?)'),
  delete: db.prepare('DELETE FROM reminders WHERE id = ?'),
  getByTask: db.prepare('SELECT * FROM reminders WHERE task_id = ? ORDER BY reminder_time ASC'),
  deleteByTask: db.prepare('DELETE FROM reminders WHERE task_id = ?'),
  getPending: db.prepare('SELECT * FROM reminders WHERE reminder_time <= datetime("now") AND is_sent = 0'),
  markAsSent: db.prepare('UPDATE reminders SET is_sent = 1 WHERE id = ?'),
};

// Helper function to parse JSON arrays from SQLite
export function parseJsonArray<T>(jsonString: string | null): T[] {
  if (!jsonString || jsonString === '[]') return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
}

// Initialize the database on import
initializeDatabase();
