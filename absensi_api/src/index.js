require('dotenv').config({ path: 'src/.env' }); 

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes'); 
const app = express();
const port = process.env.PORT || 3000;

require('./config/db'); 

app.use(cors()); 
app.use(express.json()); 
app.use('/api', apiRoutes); 

app.get('/', (req, res) => {
    res.send('Selamat Datang di API Absensi RFID!');
});

app.listen(port, () => {
    console.log(`Server API berjalan di http://localhost:${port}`);
});