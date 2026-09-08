import mongoose from 'mongoose';
import initDb from '../src/config/db.js';
import config from '../src/config/index.js';
import User from '../src/models/User.js';
import Lead from '../src/models/Lead.js';
import Note from '../src/models/Note.js';
import { hashPassword } from '../src/utils/AuthHelper.js';

const firstNames = [
  'Aarav', 'Aditi', 'Amit', 'Ananya', 'Anil', 'Anushka', 'Arjun', 'Bhavin', 'Chetan', 'Deepak',
  'Divya', 'Gaurav', 'Harsh', 'Isha', 'Jatin', 'Kavita', 'Kiran', 'Kunal', 'Manish', 'Meera',
  'Mohit', 'Neha', 'Nikhil', 'Nisha', 'Pooja', 'Pranav', 'Priya', 'Rahul', 'Rajesh', 'Rakesh',
  'Rani', 'Ravi', 'Ritu', 'Rohan', 'Sachin', 'Sameer', 'Sandhya', 'Sanjay', 'Santosh', 'Shalini',
  'Shikha', 'Shivam', 'Shruti', 'Siddharth', 'Sneha', 'Suresh', 'Swati', 'Tanvi', 'Varun', 'Vikas',
  'Vikram', 'Vinay', 'Vishal', 'Yash', 'Zoya', 'Alex', 'David', 'Emma', 'James', 'Michael',
  'Olivia', 'Robert', 'Sarah', 'William', 'Sophia', 'Daniel', 'Emily', 'Lucas', 'Mia', 'Noah'
];

const lastNames = [
  'Sharma', 'Patel', 'Verma', 'Kulkarni', 'Mehta', 'Deshmukh', 'Singhania', 'Gupta', 'Joshi', 'Chopra',
  'Reddy', 'Nair', 'Iyer', 'Bose', 'Chatterjee', 'Das', 'Pandey', 'Mishra', 'Yadav', 'Singh',
  'Bhatia', 'Malhotra', 'Kapoor', 'Khanna', 'Agarwal', 'Shah', 'Trivedi', 'Vyas', 'Shukla', 'Dubey',
  'Saxena', 'Rawat', 'Choudhary', 'Thakur', 'Tripathi', 'Goswami', 'Rao', 'Pillai', 'Menon', 'Hegde',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'
];

const domains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'vidyasetu.com', 'techcorp.in', 'globalinnovations.com',
  'apexsolutions.io', 'nexusgroup.com', 'singhaniaexports.com', 'academicsplus.org', 'cloudscale.net',
  'edusmart.org', 'fintechpro.com', 'enterprises.in', 'infotech.io', 'bizconnect.co', 'venturehub.com'
];

const sources = [
  'Website Contact Form',
  'LinkedIn Inbound',
  'Referral Partner',
  'Education Expo 2026',
  'Web Inbound',
  'Google Search Ads',
  'Direct Inbound',
  'Webinar Attendee',
  'Cold Email Campaign',
  'Industry Conference',
  'Facebook / Meta Ads',
  'Partner Network'
];

const statuses = ['new', 'contacted', 'qualified', 'lost'];

const sampleNotes = [
  'Inquired about enterprise CRM features and pricing tiers.',
  'Initial phone call completed. Interested in multi-branch setup.',
  'Budget confirmed for annual subscription plan.',
  'Requested a live product demonstration for management.',
  'Downloaded product whitepaper and feature checklist.',
  'Follow-up scheduled for next week.',
  'Decision maker was in a meeting; callback requested.',
  'Interested in API integrations with their legacy database.',
  'Proposal and quotation sent for final review.',
  'Client requested a discount on multi-user license.'
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting MongoDB database seeding (3,000 Leads)...');
    await initDb();

    // 1. Clear existing data
    await Promise.all([
      Note.deleteMany({}),
      Lead.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing database collections.');

    // 2. Create Developer Admin User & System Admin User
    const hashedDevPassword = await hashPassword(config.DEV_ADMIN_PASSWORD);
    const devAdmin = await User.create({
      name: 'Developer Admin',
      email: config.DEV_ADMIN_EMAIL,
      password: hashedDevPassword,
    });
    console.log(`✅ Seeded Developer User: ${devAdmin.email} (Password: ${config.DEV_ADMIN_PASSWORD})`);

    const hashedAdminPassword = await hashPassword(config.SYSTEM_ADMIN_PASSWORD);
    const admin = await User.create({
      name: 'System Admin',
      email: config.SYSTEM_ADMIN_EMAIL,
      password: hashedAdminPassword,
    });
    console.log(`✅ Seeded System Admin User: ${admin.email} (Password: ${config.SYSTEM_ADMIN_PASSWORD})`);

    // 3. Generate 3,000 Unique Leads in Batches
    const TOTAL_LEADS = 3000;
    console.log(`⚡ Generating ${TOTAL_LEADS} lead documents...`);

    const leadsToInsert = [];
    const now = Date.now();

    for (let i = 1; i <= TOTAL_LEADS; i++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${fn} ${ln}`;
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${domain}`;
      const phone = `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const source = sources[Math.floor(Math.random() * sources.length)];

      const daysAgo = Math.floor(Math.random() * 90);
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(Math.random() * 86400000));

      leadsToInsert.push({
        _id: new mongoose.Types.ObjectId(),
        name: fullName,
        email,
        phone,
        status,
        source,
        isDeleted: false,
        createdAt,
        updatedAt: createdAt,
      });
    }

    console.log('⚡ Inserting leads into MongoDB in chunks...');
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < leadsToInsert.length; i += CHUNK_SIZE) {
      const chunk = leadsToInsert.slice(i, i + CHUNK_SIZE);
      await Lead.insertMany(chunk, { ordered: false });
    }

    // 4. Generate and Insert Notes for approx 50% of leads
    console.log('⚡ Generating notes for leads...');
    const notesToInsert = [];

    for (const lead of leadsToInsert) {
      if (Math.random() > 0.5) {
        const noteCount = Math.floor(1 + Math.random() * 3);
        for (let n = 0; n < noteCount; n++) {
          const noteText = sampleNotes[Math.floor(Math.random() * sampleNotes.length)];
          notesToInsert.push({
            leadId: lead._id,
            content: noteText,
            createdBy: 'Developer Admin',
            isDeleted: false,
            createdAt: lead.createdAt,
            updatedAt: lead.createdAt,
          });
        }
      }
    }

    for (let i = 0; i < notesToInsert.length; i += CHUNK_SIZE) {
      const chunk = notesToInsert.slice(i, i + CHUNK_SIZE);
      await Note.insertMany(chunk, { ordered: false });
    }

    console.log(`✅ Successfully seeded ${leadsToInsert.length} leads and ${notesToInsert.length} notes!`);
    console.log('🎉 MongoDB Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
