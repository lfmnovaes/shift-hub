import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { newCompanySchema, newShiftSchema } from './validation';
import { ZodError } from 'zod';

const sampleCompanies = [
  {
    name: 'City General Hospital',
    location: 'Downtown, City Center',
  },
  {
    name: 'Riverside Medical Center',
    location: 'Riverside District',
  },
  {
    name: 'Northside Health Clinic',
    location: 'North County',
  },
];

const createSampleShifts = (companyIds: Record<string, number>) => [
  {
    companyId: companyIds['City General Hospital'],
    date: '2025-03-02',
    hour: '07:00 - 15:00',
    position: 'Emergency Room Nurse',
    serviceDescription: 'Emergency department nursing care',
    payment: '$50/hr',
    requirements: 'RN license, ER experience, ACLS certification',
    benefits: 'Sunday premium pay, meal voucher',
  },
  {
    companyId: companyIds['Riverside Medical Center'],
    date: '2025-03-02',
    hour: '08:00 - 16:00',
    position: 'Family Physician',
    serviceDescription: 'Urgent care clinic coverage',
    payment: '$140/hr',
    requirements: 'Board certified in Family Medicine',
    benefits: 'Sunday differential, CME allowance',
  },
  {
    companyId: companyIds['City General Hospital'],
    date: '2025-03-03',
    hour: '09:00 - 17:00',
    position: 'Cardiologist',
    serviceDescription: 'Outpatient cardiology consultations',
    payment: '$180/hr',
    requirements: 'Board certified in Cardiology',
    benefits: 'Premium parking, research opportunities',
  },
  {
    companyId: companyIds['Northside Health Clinic'],
    date: '2025-03-03',
    hour: '10:00 - 18:00',
    position: 'Occupational Therapist',
    serviceDescription: 'Rehabilitation services',
    payment: '$55/hr',
    requirements: 'OT license, 2+ years experience',
    benefits: 'Flexible schedule, CEU credits',
  },
  {
    companyId: companyIds['Riverside Medical Center'],
    date: '2025-03-04',
    hour: '07:00 - 19:00',
    position: 'Labor & Delivery Nurse',
    serviceDescription: '12-hour shift in L&D unit',
    payment: '$58/hr',
    requirements: 'RN license, L&D experience, NRP certification',
    benefits: '12-hour shift differential, meal provided',
  },
  {
    companyId: companyIds['City General Hospital'],
    date: '2025-03-04',
    hour: '14:00 - 22:00',
    position: 'Pharmacist',
    serviceDescription: 'Hospital pharmacy coverage',
    payment: '$75/hr',
    requirements: 'PharmD, hospital experience',
    benefits: 'Evening differential, education stipend',
  },
  {
    companyId: companyIds['Northside Health Clinic'],
    date: '2025-03-05',
    hour: '08:00 - 16:00',
    position: 'Speech Therapist',
    serviceDescription: 'Pediatric speech therapy',
    payment: '$60/hr',
    requirements: 'SLP certification, pediatric experience',
    benefits: 'Child-friendly schedule, CEU allowance',
  },
  {
    companyId: companyIds['Riverside Medical Center'],
    date: '2025-03-05',
    hour: '11:00 - 19:00',
    position: 'Radiologist',
    serviceDescription: 'Diagnostic imaging interpretation',
    payment: '$200/hr',
    requirements: 'Board certified in Radiology',
    benefits: 'Remote reading options available',
  },
  {
    companyId: companyIds['City General Hospital'],
    date: '2025-03-06',
    hour: '06:00 - 14:00',
    position: 'Operating Room Tech',
    serviceDescription: 'Surgical technologist duties',
    payment: '$35/hr',
    requirements: 'Surgical Tech certification',
    benefits: 'Early shift differential, scrubs provided',
  },
  {
    companyId: companyIds['Northside Health Clinic'],
    date: '2025-03-06',
    hour: '12:00 - 20:00',
    position: 'Mental Health Counselor',
    serviceDescription: 'Outpatient counseling services',
    payment: '$45/hr',
    requirements: 'LMHC, experience with anxiety/depression',
    benefits: 'Flexible schedule, supervision hours',
  },
  {
    companyId: companyIds['Riverside Medical Center'],
    date: '2025-03-07',
    hour: '15:00 - 23:00',
    position: 'NICU Nurse',
    serviceDescription: 'Neonatal intensive care',
    payment: '$65/hr',
    requirements: 'RN license, NICU experience',
    benefits: 'Evening differential, specialized training',
  },
  {
    companyId: companyIds['City General Hospital'],
    date: '2025-03-07',
    hour: '10:00 - 18:00',
    position: 'Physical Medicine Physician',
    serviceDescription: 'PM&R consultations',
    payment: '$160/hr',
    requirements: 'Board certified in PM&R',
    benefits: 'Research opportunities, CME allowance',
  },
  {
    companyId: companyIds['Northside Health Clinic'],
    date: '2025-03-08',
    hour: '09:00 - 17:00',
    position: 'Dietitian',
    serviceDescription: 'Nutritional counseling',
    payment: '$40/hr',
    requirements: 'RD certification',
    benefits: 'Weekend differential, flexible hours',
  },
  {
    companyId: companyIds['Riverside Medical Center'],
    date: '2025-03-08',
    hour: '19:00 - 07:00',
    position: 'Critical Care Nurse',
    serviceDescription: 'ICU night shift coverage',
    payment: '$70/hr',
    requirements: 'RN license, ICU experience, CCRN preferred',
    benefits: 'Night + weekend differential, breakfast provided',
  },
];

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:local.db',
    syncUrl: process.env.SYNC_DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  console.log('Initializing database...');
  console.log('Seeding database with sample data...');
  console.log('Adding companies...');
  const companyIds: Record<string, number> = {};

  for (const company of sampleCompanies) {
    try {
      const validatedCompany = newCompanySchema.parse(company);

      await db.insert(schema.companies).values({
        name: validatedCompany.name,
        location: validatedCompany.location,
        createdAt: new Date(),
      });

      const companyResult = await db
        .select({ id: schema.companies.id })
        .from(schema.companies)
        .where(eq(schema.companies.name, validatedCompany.name))
        .limit(1);

      if (companyResult.length > 0) {
        companyIds[validatedCompany.name] = companyResult[0].id;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`Invalid company data: ${error.message}`);
        continue;
      }
      throw error;
    }
  }

  console.log('Adding shifts...');
  const sampleShifts = createSampleShifts(companyIds);

  for (const shift of sampleShifts) {
    try {
      const validatedShift = newShiftSchema.parse(shift);

      await db.insert(schema.shifts).values({
        companyId: validatedShift.companyId,
        date: validatedShift.date,
        hour: validatedShift.hour,
        position: validatedShift.position,
        serviceDescription: validatedShift.serviceDescription,
        payment: validatedShift.payment,
        requirements: validatedShift.requirements,
        benefits: validatedShift.benefits,
        createdAt: new Date(),
      });
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`Invalid shift data: ${error.message}`);
        continue;
      }
      throw error;
    }
  }

  console.log('Database initialization completed!');

  await client.close();
}

main().catch((e) => {
  console.error('Database initialization failed:');
  console.error(e);
  process.exit(1);
});
