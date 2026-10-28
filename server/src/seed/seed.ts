import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGODB_URI } from '../config/constants';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { SEED_JOBS } from './seedData';

async function runSeed() {
  try {
    console.log(`[Seed] Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to database.');

    // 1. Seed Jobs
    const existingJobCount = await Job.countDocuments();
    if (existingJobCount === 0) {
      console.log(`[Seed] Seeding ${SEED_JOBS.length} realistic verified job postings...`);
      await Job.insertMany(SEED_JOBS);
      console.log('[Seed] Jobs seeded successfully.');
    } else {
      console.log(`[Seed] Database already has ${existingJobCount} jobs. Skipping job reseed.`);
    }

    // 2. Seed Demo User
    const demoEmail = 'demo@careerpilot.ai';
    const existingDemoUser = await User.findOne({ email: demoEmail });
    if (!existingDemoUser) {
      console.log('[Seed] Creating default demo user: demo@careerpilot.ai...');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('Password123!', salt);

      const demoUser = new User({
        name: 'Demo Professional',
        email: demoEmail,
        passwordHash,
        emailVerified: true,
        careerProfile: {
          careerStage: 'Fresher',
          targetRoles: ['Full-Stack Developer', 'Frontend Engineer'],
          skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'SQL', 'Docker', 'Git'],
          experienceLevel: 'Entry',
          preferredLocations: ['Remote', 'San Francisco', 'New York'],
          workMode: 'remote',
          preferredIndustries: ['Technology', 'Fintech', 'SaaS'],
          careerGoals: 'To build high-performance distributed web applications at a high-growth tech company.'
        },
        preferences: {
          aiProcessingConsent: true,
          resumeRetentionDays: 365,
          emailNotifications: true,
          theme: 'dark'
        }
      });

      await demoUser.save();
      console.log('[Seed] Demo user created: demo@careerpilot.ai / Password123!');
    } else {
      console.log('[Seed] Demo user already exists.');
    }

    console.log('[Seed] Finished seeding successfully.');
    process.exit(0);
  } catch (err: any) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

runSeed();
