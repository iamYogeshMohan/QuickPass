const mongoose = require('mongoose');

const test = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/quickpass');
  const db = mongoose.connection.db;
  const visitors = await db.collection('visitors').find({}).toArray();
  console.log('Visitors found:', visitors.length);
  if (visitors.length > 0) {
    const id = visitors[0]._id.toString();
    console.log('First visitor ID:', id);
    try {
      const res = await fetch(`http://localhost:5000/visitor/${id}`);
      const data = await res.json();
      console.log('Fetch result Status:', res.status);
      console.log('Fetch result Data:', data);
    } catch(e) {
      console.error('Fetch error:', e.message);
    }
  } else {
    console.log('No visitors to test with. Create one from UI first.');
  }
  process.exit(0);
};

test();
