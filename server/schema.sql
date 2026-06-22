-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  target_role VARCHAR(100),
  target_company VARCHAR(100),
  days_left INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Problems table (our DSA problem bank)
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  platform_link TEXT,
  companies TEXT[],
  prerequisite_topic VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Attempts table (every time a user tries a problem)
CREATE TABLE attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  verdict VARCHAR(20) CHECK (verdict IN ('Solved', 'Failed', 'Hint_Used')),
  time_taken_minutes INTEGER,
  code_submitted TEXT,
  ai_feedback TEXT,
  next_review_date DATE,
  ease_factor FLOAT DEFAULT 2.5,
  review_interval INTEGER DEFAULT 1,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Roadmap table (the AI-generated study plan)
CREATE TABLE roadmap (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'skipped')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Notes table (AI-generated session summaries)
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);