import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupOrphanedSessionsAndAccounts() {
  // Get all valid user IDs
  const users = await prisma.user.findMany({ select: { id: true } })
  const userIds = users.map(u => u.id)

  // Delete sessions with missing users
  const orphanedSessions = await prisma.session.findMany({
    where: {
      NOT: {
        userId: { in: userIds },
      },
    },
    select: { sessionToken: true },
  })
  const sessionTokens = orphanedSessions.map(s => s.sessionToken)
  if (sessionTokens.length > 0) {
    await prisma.session.deleteMany({
      where: { sessionToken: { in: sessionTokens } },
    })
    console.log(`Deleted ${sessionTokens.length} orphaned sessions.`)
  } else {
    console.log('No orphaned sessions found.')
  }

  // Delete accounts with missing users
  const orphanedAccounts = await prisma.account.findMany({
    where: {
      NOT: {
        userId: { in: userIds },
      },
    },
    select: { id: true },
  })
  const accountIds = orphanedAccounts.map(a => a.id)
  if (accountIds.length > 0) {
    await prisma.account.deleteMany({
      where: { id: { in: accountIds } },
    })
    console.log(`Deleted ${accountIds.length} orphaned accounts.`)
  } else {
    console.log('No orphaned accounts found.')
  }
}

cleanupOrphanedSessionsAndAccounts()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 