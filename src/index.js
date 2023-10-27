require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');


const app = express();
const PORT = 3000;
app.use(cors());

// Initialize Firestore
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware
app.use(bodyParser.json());

// Fetch all feature flags
app.get('/flags', async (req, res) => {
    try {
        const flagsRef = db.collection('featureFlags');
        const snapshot = await flagsRef.get();

        let flags = {};
        snapshot.forEach(doc => {
            flags[doc.id] = doc.data();
        });

        res.json(flags);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching flags' });
    }
});


// Add/Update a feature flag with an auto-generated extid
app.post('/flags', async (req, res) => {
    const flagData = req.body;
    flagData.creationDate = admin.firestore.Timestamp.now().toDate();
    flagData.modifiedDate = admin.firestore.Timestamp.now().toDate();
    flagData.extid = generateExtId(); // Call a function to generate extid

    try {
        await db.collection('featureFlags').doc(flagData.extid).set(flagData);
        res.json({ status: 'Feature added/updated successfully', extid: flagData.extid });
    } catch (error) {
        res.status(500).json({ error: 'Error saving feature flag' });
    }
});

// Generate a random alphanumeric extid (you can customize this function)
function generateExtId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const extidLength = 8; // You can adjust the length as needed
    let extid = '';
    for (let i = 0; i < extidLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        extid += characters.charAt(randomIndex);
    }
    return extid;
}

// Get a feature flag by extid
app.get('/flags/:extid', async (req, res) => {
    const extid = req.params.extid;

    try {
        const flagRef = db.collection('featureFlags').doc(extid);
        const doc = await flagRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Feature flag not found' });
        }

        const flagData = doc.data();
        res.json(flagData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching feature flag' });
    }
});


// Add/Update a feature flag
app.post('/flags', async (req, res) => {
    const flagData = req.body;
    flagData.creationDate = admin.firestore.Timestamp.now().toDate();
    flagData.modifiedDate = admin.firestore.Timestamp.now().toDate();

    try {
        await db.collection('featureFlags').doc(flagData.name).set(flagData);
        res.json({ status: 'Feature added/updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving feature flag' });
    }
});

// Delete a feature flag by name
app.delete('/flags/:extid', async (req, res) => {
    const extid = req.params.extid;

    try {
        await db.collection('featureFlags').doc(extid).delete();
        res.json({ status: `Feature flag ${extid} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting feature flag' });
    }
});

// Update a feature flag
app.put('/flags/:extid', async (req, res) => {
    const extid = req.params.extid;
    const updatedData = req.body;

    try {
        const flagRef = db.collection('featureFlags').doc(extid);
        const doc = await flagRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Feature flag not found' });
        }

        const existingData = doc.data();
        // Merge existing data with updated data. This ensures that if some fields are omitted in the update,
        // the existing values are preserved. The modifiedDate is always updated.
        const mergedData = {
            ...existingData,
            ...updatedData,
            modifiedDate: admin.firestore.Timestamp.now().toDate()
        };

        await flagRef.set(mergedData);
        res.json({ status: 'Feature updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating feature flag' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
