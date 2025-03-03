import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL || 'file:./local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  console.log('Cleaning up database...');

  // Delete all shifts first (due to foreign key constraints)
  await client.execute('DELETE FROM shifts');
  console.log('Shifts table cleared');

  // Delete all companies
  await client.execute('DELETE FROM companies');
  console.log('Companies table cleared');

  console.log('Database cleanup completed!');

  await client.close();
}

main().catch((e) => {
  console.error('Database cleanup failed:');
  console.error(e);
  process.exit(1);
});
