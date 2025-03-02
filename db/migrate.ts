import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

// This script will run the migrations to set up the database
async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client);

  console.log('Running migrations...');

  // This will automatically run needed migrations
  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Migrations completed!');

  await client.close();
}

main().catch((e) => {
  console.error('Migration failed:');
  console.error(e);
  process.exit(1);
});
