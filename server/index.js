import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function convertJsonToXml(jsonInput) {
  const { action, data } = jsonInput;
  
  if (action === 'say') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${data.message || data.text || ''}</Say>
</Response>`;
  }
  
  if (action === 'gather') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather action="${data.action || ''}" method="POST">
    ${data.message ? `<Say>${data.message}</Say>` : ''}
  </Gather>
</Response>`;
  }
  
  if (action === 'hangup') {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Action not supported</Say>
</Response>`;
}

app.post('/api/v1/pabbly/convert', (req, res) => {
  try {
    const xml = convertJsonToXml(req.body);
    res.json({ xml });
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.post('/api/v1/convert', (req, res) => {
  try {
    const xml = convertJsonToXml(req.body);
    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
