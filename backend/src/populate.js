//populating the database


const mongoose = require('mongoose');





const uri = 'mongodb+srv://abdelrhmanmersal:merso2003@main.y2sz6.mongodb.net/main?retryWrites=true&w=majority';

const connectDb = async () => {
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');
};

const populateAnalytics = async () => {
  const analyticsSchema = new mongoose.Schema({
    analyticsId: String,
    userId: String,
    completionPercentage: Number,
    averageScore: Number,
    engagementModules: [String],
    engagementTime: [Number],
    createdAt: Date,
  });

  const Analytics = mongoose.model('Analytics', analyticsSchema);

  await Analytics.create({
    analyticsId: '123456789',
    userId: 'student123',
    completionPercentage: 85,
    averageScore: 92,
    engagementModules: ['Module 1', 'Module 2'],
    engagementTime: [45, 30],
    createdAt: new Date(),
  });

  console.log('Sample data inserted');
  process.exit();
};

connectDb().then(populateAnalytics);
