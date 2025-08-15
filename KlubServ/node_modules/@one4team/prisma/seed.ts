import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create sample clubs with proper UUIDs for multi-tenant setup
  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440001' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Elite Fitness Club',
        description: 'Premium fitness and wellness center',
        address: '123 Fitness Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: 'info@elitefitness.com',
        website: 'https://elitefitness.com',
        timezone: 'America/New_York',
        currency: 'USD'
      }
    }),
    prisma.club.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440002' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Community Sports Center',
        description: 'Family-friendly sports and recreation facility',
        address: '456 Community Ave, City, State 12345',
        phone: '+1 (555) 987-6543',
        email: 'info@communitysports.com',
        website: 'https://communitysports.com',
        timezone: 'America/Chicago',
        currency: 'USD'
      }
    })
  ])

  const club = clubs[0] // Use first club for primary data
  const secondClub = clubs[1] // Second club for multi-tenant testing

  console.log('✅ Created club:', club.name)

  // Create sample trainers
  const trainers = await Promise.all([
    prisma.trainer.upsert({
      where: { id: 'trainer_001' },
      update: {},
      create: {
        id: 'trainer_001',
        clerkId: 'clerk_trainer_001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@elitefitness.com',
        phone: '+1 (555) 111-2222',
        bio: 'Certified personal trainer with 8 years of experience in strength training and HIIT.',
        specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
        status: 'ACTIVE',
        hireDate: new Date('2022-01-15'),
        hourlyRate: 75.00,
        clubId: club.id
      }
    }),
    prisma.trainer.upsert({
      where: { id: 'trainer_002' },
      update: {},
      create: {
        id: 'trainer_002',
        clerkId: 'clerk_trainer_002',
        name: 'Mike Chen',
        email: 'mike.chen@elitefitness.com',
        phone: '+1 (555) 333-4444',
        bio: 'Yoga and Pilates instructor specializing in mindfulness and flexibility.',
        specialties: ['Yoga', 'Pilates', 'Mindfulness'],
        status: 'ACTIVE',
        hireDate: new Date('2022-03-20'),
        hourlyRate: 65.00,
        clubId: club.id
      }
    })
  ])

  console.log('✅ Created trainers:', trainers.map(t => t.name))

  // Create sample members
  const members = await Promise.all([
    prisma.member.upsert({
      where: { id: 'member_001' },
      update: {},
      create: {
        id: 'member_001',
        clerkId: 'clerk_member_001',
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1 (555) 555-1234',
        birthdate: new Date('1990-05-15'),
        address: '456 Main St, City, State 12345',
        emergencyContact: 'Jane Smith',
        emergencyPhone: '+1 (555) 555-5678',
        status: 'ACTIVE',
        joinDate: new Date('2023-01-10'),
        membershipType: 'PREMIUM',
        clubId: club.id
      }
    }),
    prisma.member.upsert({
      where: { id: 'member_002' },
      update: {},
      create: {
        id: 'member_002',
        clerkId: 'clerk_member_002',
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        phone: '+1 (555) 555-9876',
        birthdate: new Date('1988-12-03'),
        address: '789 Oak Ave, City, State 12345',
        emergencyContact: 'Robert Davis',
        emergencyPhone: '+1 (555) 555-4321',
        status: 'ACTIVE',
        joinDate: new Date('2023-02-15'),
        membershipType: 'BASIC',
        clubId: club.id
      }
    }),
    prisma.member.upsert({
      where: { id: 'member_003' },
      update: {},
      create: {
        id: 'member_003',
        clerkId: 'clerk_member_003',
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        phone: '+1 (555) 555-2468',
        birthdate: new Date('1995-08-22'),
        address: '321 Pine Rd, City, State 12345',
        emergencyContact: 'Lisa Wilson',
        emergencyPhone: '+1 (555) 555-1357',
        status: 'ACTIVE',
        joinDate: new Date('2023-03-01'),
        membershipType: 'VIP',
        clubId: club.id
      }
    })
  ])

  console.log('✅ Created members:', members.map(m => m.name))

  // Create sample classes
  const classes = await Promise.all([
    prisma.class.upsert({
      where: { id: 'class_001' },
      update: {},
      create: {
        id: 'class_001',
        name: 'Morning HIIT',
        description: 'High-intensity interval training to start your day with energy',
        category: 'Cardio',
        difficulty: 'INTERMEDIATE',
        maxCapacity: 20,
        duration: 45,
        startTime: new Date('2024-01-15T06:00:00Z'),
        endTime: new Date('2024-01-15T06:45:00Z'),
        isRecurring: true,
        recurrence: 'WEEKLY',
        location: 'Studio A',
        price: 15.00,
        isFree: false,
        clubId: club.id,
        trainerId: trainers[0].id
      }
    }),
    prisma.class.upsert({
      where: { id: 'class_002' },
      update: {},
      create: {
        id: 'class_002',
        name: 'Yoga Flow',
        description: 'Gentle yoga flow for all levels focusing on flexibility and mindfulness',
        category: 'Mind & Body',
        difficulty: 'ALL_LEVELS',
        maxCapacity: 15,
        duration: 60,
        startTime: new Date('2024-01-15T18:00:00Z'),
        endTime: new Date('2024-01-15T19:00:00Z'),
        isRecurring: true,
        recurrence: 'WEEKLY',
        location: 'Studio B',
        price: 20.00,
        isFree: false,
        clubId: club.id,
        trainerId: trainers[1].id
      }
    }),
    prisma.class.upsert({
      where: { id: 'class_003' },
      update: {},
      create: {
        id: 'class_003',
        name: 'Strength Training',
        description: 'Build muscle and increase strength with proper form',
        category: 'Strength',
        difficulty: 'BEGINNER',
        maxCapacity: 12,
        duration: 50,
        startTime: new Date('2024-01-16T17:00:00Z'),
        endTime: new Date('2024-01-16T17:50:00Z'),
        isRecurring: true,
        recurrence: 'WEEKLY',
        location: 'Weight Room',
        price: 18.00,
        isFree: false,
        clubId: club.id,
        trainerId: trainers[0].id
      }
    })
  ])

  console.log('✅ Created classes:', classes.map(c => c.name))

  // Create sample class enrollments
  const enrollments = await Promise.all([
    prisma.classEnrollment.upsert({
      where: { id: 'enrollment_001' },
      update: {},
      create: {
        id: 'enrollment_001',
        memberId: members[0].id,
        classId: classes[0].id,
        status: 'ENROLLED',
        attended: true
      }
    }),
    prisma.classEnrollment.upsert({
      where: { id: 'enrollment_002' },
      update: {},
      create: {
        id: 'enrollment_002',
        memberId: members[1].id,
        classId: classes[1].id,
        status: 'ENROLLED',
        attended: false
      }
    }),
    prisma.classEnrollment.upsert({
      where: { id: 'enrollment_003' },
      update: {},
      create: {
        id: 'enrollment_003',
        memberId: members[2].id,
        classId: classes[2].id,
        status: 'ENROLLED',
        attended: true
      }
    })
  ])

  console.log('✅ Created class enrollments:', enrollments.length)

  // Create sample payments
  const payments = await Promise.all([
    prisma.payment.upsert({
      where: { id: 'payment_001' },
      update: {},
      create: {
        id: 'payment_001',
        amount: 89.99,
        currency: 'USD',
        status: 'PAID',
        type: 'MEMBERSHIP_FEE',
        description: 'Monthly Premium Membership - January 2024',
        dueDate: new Date('2024-01-01'),
        paidAt: new Date('2024-01-01'),
        memberId: members[0].id,
        clubId: club.id
      }
    }),
    prisma.payment.upsert({
      where: { id: 'payment_002' },
      update: {},
      create: {
        id: 'payment_002',
        amount: 15.00,
        currency: 'USD',
        status: 'PAID',
        type: 'CLASS_FEE',
        description: 'Morning HIIT Class - January 15, 2024',
        dueDate: new Date('2024-01-15'),
        paidAt: new Date('2024-01-14'),
        memberId: members[0].id,
        clubId: club.id
      }
    }),
    prisma.payment.upsert({
      where: { id: 'payment_003' },
      update: {},
      create: {
        id: 'payment_003',
        amount: 49.99,
        currency: 'USD',
        status: 'PENDING',
        type: 'MEMBERSHIP_FEE',
        description: 'Monthly Basic Membership - February 2024',
        dueDate: new Date('2024-02-01'),
        memberId: members[1].id,
        clubId: club.id
      }
    })
  ])

  console.log('✅ Created payments:', payments.length)

  // Create sample announcements
  const announcements = await Promise.all([
    prisma.announcement.upsert({
      where: { id: 'announcement_001' },
      update: {},
      create: {
        id: 'announcement_001',
        title: 'New Year, New You - Special Offers!',
        content: 'Start your fitness journey with our special New Year offers. 20% off all memberships this month!',
        type: 'PROMOTION',
        targetAudience: 'ALL',
        isPublished: true,
        publishedAt: new Date('2024-01-01'),
        clubId: club.id
      }
    }),
    prisma.announcement.upsert({
      where: { id: 'announcement_002' },
      update: {},
      create: {
        id: 'announcement_002',
        title: 'Equipment Maintenance Notice',
        content: 'The cardio machines in Studio A will be under maintenance on January 20th. Alternative equipment will be available.',
        type: 'MAINTENANCE',
        targetAudience: 'MEMBERS',
        isPublished: true,
        publishedAt: new Date('2024-01-10'),
        clubId: club.id
      }
    })
  ])

  console.log('✅ Created announcements:', announcements.length)

  // Create sample data for second club to demonstrate multi-tenant isolation
  const secondClubTrainer = await prisma.trainer.upsert({
    where: { id: 'trainer_003' },
    update: {},
    create: {
      id: 'trainer_003',
      clerkId: 'clerk_trainer_003',
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@communitysports.com',
      phone: '+1 (555) 777-8888',
      bio: 'Youth sports specialist with focus on soccer and basketball.',
      specialties: ['Youth Sports', 'Soccer', 'Basketball'],
      status: 'ACTIVE',
      hireDate: new Date('2023-06-01'),
      hourlyRate: 55.00,
      clubId: secondClub.id
    }
  })

  const secondClubMember = await prisma.member.upsert({
    where: { id: 'member_004' },
    update: {},
    create: {
      id: 'member_004',
      clerkId: 'clerk_member_004',
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 555-9999',
      birthdate: new Date('1992-03-10'),
      address: '789 Community St, City, State 12345',
      emergencyContact: 'Carlos Garcia',
      emergencyPhone: '+1 (555) 555-0000',
      status: 'ACTIVE',
      joinDate: new Date('2023-07-15'),
      membershipType: 'BASIC',
      clubId: secondClub.id
    }
  })

  const secondClubClass = await prisma.class.upsert({
    where: { id: 'class_004' },
    update: {},
    create: {
      id: 'class_004',
      name: 'Youth Soccer Training',
      description: 'Fun and engaging soccer training for kids aged 8-12',
      category: 'Youth Sports',
      difficulty: 'BEGINNER',
      maxCapacity: 15,
      duration: 60,
      startTime: new Date('2024-01-16T16:00:00Z'),
      endTime: new Date('2024-01-16T17:00:00Z'),
      isRecurring: true,
      recurrence: 'WEEKLY',
      location: 'Outdoor Field',
      price: 25.00,
      isFree: false,
      clubId: secondClub.id,
      trainerId: secondClubTrainer.id
    }
  })

  console.log('✅ Created second club data for multi-tenant testing')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 