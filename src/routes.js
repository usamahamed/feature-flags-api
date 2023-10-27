const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const firebaseMiddleware = require('express-firebase-middleware');

router.use((req, res, next) => {
  next();
});

router.use('/api', firebaseMiddleware.auth);

router.get('/', (req, res) => {
  res.json({
    message: 'Home',
  });
});

const db = admin.firestore();
// Fetch all feature flags
router.get('/flags', async (req, res) => {
    try {
      console.log(req, res)
    const flagsRef = db.collection('featureFlags');
    const snapshot = await flagsRef.get();

    let flags = {};
    snapshot.forEach((doc) => {
      flags[doc.id] = doc.data();
    });

    res.json(flags);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flags' });
  }
});

// Add/Update a feature flag
router.post('/flags', async (req, res) => {
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
router.delete('/flags/:name', async (req, res) => {
  const flagName = req.params.name;

  try {
    await db.collection('featureFlags').doc(flagName).delete();
    res.json({ status: `Feature flag ${flagName} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting feature flag' });
  }
});

router.get('/api/hello', (req, res) => {
  res.json({
    message: `You're logged in as ${res.locals.user.email} with Firebase UID: ${res.locals.user.uid}`,
  });
});

module.exports = router;
