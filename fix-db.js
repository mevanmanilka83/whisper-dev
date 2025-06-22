import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDatabase() {
  try {
    console.log('🔍 Checking for orphaned accounts...');
    
    // First, get all account IDs
    const allAccounts = await prisma.account.findMany({
      select: { id: true, userId: true }
    });

    // Find orphaned accounts (accounts with userId that don't exist in users table)
    const orphanedAccounts = [];
    for (const account of allAccounts) {
      const user = await prisma.user.findUnique({
        where: { id: account.userId }
      });
      if (!user) {
        orphanedAccounts.push(account.id);
      }
    }

    console.log(`Found ${orphanedAccounts.length} orphaned accounts`);

    if (orphanedAccounts.length > 0) {
      console.log('🗑️  Deleting orphaned accounts...');
      
      // Delete orphaned accounts
      const deleteResult = await prisma.account.deleteMany({
        where: {
          id: { in: orphanedAccounts }
        }
      });

      console.log(`✅ Deleted ${deleteResult.count} orphaned accounts`);
    }

    // Also check for orphaned sessions
    console.log('🔍 Checking for orphaned sessions...');
    
    const allSessions = await prisma.session.findMany({
      select: { id: true, userId: true }
    });

    const orphanedSessions = [];
    for (const session of allSessions) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId }
      });
      if (!user) {
        orphanedSessions.push(session.id);
      }
    }

    console.log(`Found ${orphanedSessions.length} orphaned sessions`);

    if (orphanedSessions.length > 0) {
      console.log('🗑️  Deleting orphaned sessions...');
      
      const deleteSessionsResult = await prisma.session.deleteMany({
        where: {
          id: { in: orphanedSessions }
        }
      });

      console.log(`✅ Deleted ${deleteSessionsResult.count} orphaned sessions`);
    }

    console.log('✅ Database cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during database cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase(); 