const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const RESOURCES_PATH = path.join(__dirname, 'data', 'resources.json');
const REQUESTS_PATH = path.join(__dirname, 'data', 'help-requests.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readJSON(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Make sure the help-requests file exists
if (!fs.existsSync(REQUESTS_PATH)) {
  writeJSON(REQUESTS_PATH, []);
}

// GET /api/resources?category=shelter
app.get('/api/resources', (req, res) => {
  const resources = readJSON(RESOURCES_PATH, []);
  const { category, search } = req.query;

  let filtered = resources;

  if (category && category !== 'all') {
    filtered = filtered.filter(r => r.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

// GET a single resource
app.get('/api/resources/:id', (req, res) => {
  const resources = readJSON(RESOURCES_PATH, []);
  const resource = resources.find(r => r.id === req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json(resource);
});

// POST /api/help-requests - someone asking for help, or referring someone
app.post('/api/help-requests', (req, res) => {
  const { name, contact, situation, urgency } = req.body;

  if (!situation || situation.trim().length === 0) {
    return res.status(400).json({ error: 'Please describe the situation.' });
  }

  const requests = readJSON(REQUESTS_PATH, []);
  const newRequest = {
    id: Date.now().toString(36),
    name: name && name.trim() ? name.trim() : 'Not given',
    contact: contact && contact.trim() ? contact.trim() : 'Not given',
    situation: situation.trim(),
    urgency: urgency || 'standard',
    submittedAt: new Date().toISOString(),
    status: 'new'
  };

  requests.push(newRequest);
  writeJSON(REQUESTS_PATH, requests);

  res.status(201).json({ message: 'Request received', id: newRequest.id });
});

// GET /api/help-requests - for volunteers/admins reviewing submissions
app.get('/api/help-requests', (req, res) => {
  const requests = readJSON(REQUESTS_PATH, []);
  res.json(requests.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
});

app.listen(PORT, () => {
  console.log(`Homeless Assistance app running at http://localhost:${PORT}`);
});
