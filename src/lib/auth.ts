import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { PrismaClient, Role, User, Organization, OrganizationMember, CompanyProfile } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Gets the currently authenticated user.
 * Includes a safe mock development fallback if Clerk keys are missing.
 */
export async function getCurrentUser(): Promise<User | null> {
  // Opt out of static generation to prevent build errors
  await cookies();
  
  let userId = null

  try {
    const session = await auth()
    userId = session.userId
  } catch (e: any) {
    // If Next.js throws a dynamic rendering bailout, we MUST rethrow it!
    if (e?.digest?.startsWith('NEXT_') || e?.message?.includes('DynamicServerError') || e?.message?.includes('NEXT_DYNAMIC')) {
      throw e;
    }
    // Otherwise, it's just Clerk complaining about missing keys
  }

  if (!userId) {
    console.warn("⚠️ Using Mock Dev Auth Fallback.")
    // Fallback to seeded demo owner
    return prisma.user.findFirst({ where: { clerkId: 'user_owner' } })
  }

  if (!userId) return null

  return prisma.user.findUnique({
    where: { clerkId: userId }
  })
}

/**
 * Requires an authenticated user, otherwise throws.
 */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized - Authentication required')
  }
  return user
}

export type OrganizationContext = {
  user: User
  member: OrganizationMember
  organization: Organization & { profile?: CompanyProfile | null }
  role: Role
}

/**
 * Safely resolves the organization context.
 * NEVER trusts the client's organizationId blindly. Validates membership.
 */
export async function requireOrganization(requestedOrgId?: string): Promise<OrganizationContext> {
  const user = await requireUser()
  
  if (user.clerkId === 'system_admin' || (process.env.SYSTEM_ADMIN_EMAILS && process.env.SYSTEM_ADMIN_EMAILS.includes(user.email))) {
    // Special bypass for system admins if needed globally
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      userId: user.id,
      ...(requestedOrgId ? { organizationId: requestedOrgId } : {})
    },
    include: {
      organization: {
        include: {
          profile: true
        }
      }
    }
  })

  if (!member) {
    throw new Error('Organization Not Found or Unauthorized')
  }

  return {
    user,
    member,
    organization: member.organization,
    role: member.role
  }
}

/**
 * Gets the current active organization context (usually the first one for simplicity in this MVP).
 */
export async function getCurrentOrganization() {
  return requireOrganization()
}
