import mongoose from 'mongoose';
// const mongoose = require('mongoose');

// console.log('Data connection string ==> ', process.env.MONGODB_URI);
// Establish a DB connection with mongoDB
// Handle the initial connection error
async function connect() {
  mongoose.set('strictQuery', false);
  try {
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // family: 4,
    });
    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.log('Error in Initial DB connection' + error);
  }
}

async function disconnect() {
  if (process.env.NODE_ENV === 'production') {
    await mongoose.disconnect();
  }
  console.log('DB not disconnected in', process.env.NODE_ENV);
}

// Here doc is a mongodb document
// convertDocToObj is a helper function which convert mongoose
// document to pure JavaScript object
async function convertDocToObj(doc) {
  const docData = doc;
  docData._id = await doc._id.toString();
  docData.createdAt = await doc.createdAt.toString();
  docData.updatedAt = await doc.updatedAt.toString();
  return docData;
}

const db = { connect, disconnect, convertDocToObj };

export default db;
