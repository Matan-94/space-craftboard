const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/space_relay', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const SpacecraftSchema = new mongoose.Schema({
    name: String,
    transmissions: [{ message: String, timestamp: Date }]
});

const Spacecraft = mongoose.model('Spacecraft', SpacecraftSchema);

// Generate random transmissions automatically
const spacecraftNames = ["Apollo", "Voyager", "Orion", "Pioneer", "Discovery", "Atlantis", "Endeavour", "Columbia", "Challenger", "Galileo"];
const messages = [
    "מערכות תקינות", "מבצע תמרון", "בודק חיישנים", "מעביר נתונים", "מתקן תקלה", "התחלת ניווט מחדש", "טוען דלק", "משדר אות חירום"
];

const generateRandomTransmission = async () => {
    const existingCount = await Spacecraft.countDocuments();
    if (existingCount < 10) {
        const name = spacecraftNames[existingCount % spacecraftNames.length];
        let spacecraft = await Spacecraft.findOne({ name });
        if (!spacecraft) {
            spacecraft = new Spacecraft({ name, transmissions: [] });
        }
        const newMessage = messages[Math.floor(Math.random() * messages.length)];
        spacecraft.transmissions.push({ message: newMessage, timestamp: new Date() });
        await spacecraft.save();
    }
};
setInterval(generateRandomTransmission, 30000); // Every 30 seconds

// Get all spacecraft transmissions
app.get('/transmissions', async (req, res) => {
    const spacecrafts = await Spacecraft.find();
    res.json(spacecrafts);
});

// Get transmissions by spacecraft name
app.get('/transmissions/:name', async (req, res) => {
    const spacecraft = await Spacecraft.findOne({ name: req.params.name });
    if (!spacecraft) return res.status(404).json({ error: 'Spacecraft not found' });
    res.json(spacecraft.transmissions);
});

// Add a new transmission
app.post('/transmissions', async (req, res) => {
    const { name, message } = req.body;
    let spacecraft = await Spacecraft.findOne({ name });
    if (!spacecraft) {
        spacecraft = new Spacecraft({ name, transmissions: [] });
    }
    spacecraft.transmissions.push({ message, timestamp: new Date() });
    await spacecraft.save();
    res.json({ success: true, transmissions: spacecraft.transmissions });
});

app.listen(5000, () => console.log('Server running on port 5000'));
