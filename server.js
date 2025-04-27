const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const EXCEL_PATH = path.join(__dirname, 'attendance.xlsx');
const SHEET_NAME = 'Attendance';

// If the file doesn’t exist, create it with headers
if (!fs.existsSync(EXCEL_PATH)) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet([], { header: ['Name','Time'] });
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_PATH);
}

app.post('/api/attendance', (req, res) => {
  const { name, time } = req.body;
  if (!name || !time) return res.status(400).json({ error: 'Missing name/time' });

  // load workbook & sheet
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets[SHEET_NAME];
  const data = XLSX.utils.sheet_to_json(ws);

  data.push({ Name: name, Time: time });
  const newWs = XLSX.utils.json_to_sheet(data, { header: ['Name','Time'] });
  wb.Sheets[SHEET_NAME] = newWs;
  XLSX.writeFile(wb, EXCEL_PATH);

  res.json({ status: 'ok' });
});

app.get('/api/attendance/download', (req, res) => {
  res.download(EXCEL_PATH, 'attendance.xlsx');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
