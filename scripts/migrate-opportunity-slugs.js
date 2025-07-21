// Migration script to generate slugs for all existing opportunities
import mongoose from 'mongoose';
import Opportunity from '../models/opportunity.js';
import { generateUniqueSlug } from '../utils/slug.js';
import dotenv from 'dotenv';
dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const opportunities = await Opportunity.find({});
  let updated = 0;
  for (const opp of opportunities) {
    if (!opp.slug) {
      opp.slug = await generateUniqueSlug(opp.title);
      await opp.save();
      updated++;
      console.log(`Updated: ${opp.title} -> ${opp.slug}`);
    }
  }
  console.log(`Migration complete. Slugs added to ${updated} opportunities.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
