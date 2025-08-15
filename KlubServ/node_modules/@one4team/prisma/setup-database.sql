-- One4Team Database Setup SQL
-- Run this in your Supabase SQL Editor

-- Create enums
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'CHECK');
CREATE TYPE "ClassType" AS ENUM ('GROUP', 'PRIVATE', 'SEMI_PRIVATE');
CREATE TYPE "ClassStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "AnnouncementType" AS ENUM ('GENERAL', 'EVENT', 'REMINDER', 'URGENT');

-- Create Club table
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- Create Member table
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- Create Trainer table
CREATE TABLE "Trainer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "specialization" TEXT,
    "bio" TEXT,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("id")
);

-- Create Class table
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ClassType" NOT NULL,
    "status" "ClassStatus" NOT NULL DEFAULT 'SCHEDULED',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "maxCapacity" INTEGER,
    "currentEnrollment" INTEGER NOT NULL DEFAULT 0,
    "trainerId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- Create ClassEnrollment table
CREATE TABLE "ClassEnrollment" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    CONSTRAINT "ClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- Create Payment table
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "memberId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- Create Announcement table
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "AnnouncementType" NOT NULL DEFAULT 'GENERAL',
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraints
ALTER TABLE "Member" ADD CONSTRAINT "Member_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Class" ADD CONSTRAINT "Class_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Trainer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Class" ADD CONSTRAINT "Class_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClassEnrollment" ADD CONSTRAINT "ClassEnrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert sample data
INSERT INTO "Club" ("id", "name", "description", "address", "phone", "email", "website") VALUES
('club_1', 'Fitness First', 'Premium fitness club with state-of-the-art equipment', '123 Main St, City', '+1-555-0123', 'info@fitnessfirst.com', 'https://fitnessfirst.com'),
('club_2', 'Sports Elite', 'Professional sports training facility', '456 Oak Ave, Town', '+1-555-0456', 'contact@sportselite.com', 'https://sportselite.com');

INSERT INTO "Trainer" ("id", "name", "email", "specialization", "bio", "clubId") VALUES
('trainer_1', 'John Smith', 'john@fitnessfirst.com', 'Strength Training', 'Certified personal trainer with 10+ years experience', 'club_1'),
('trainer_2', 'Sarah Johnson', 'sarah@sportselite.com', 'Cardio Fitness', 'Former professional athlete turned trainer', 'club_2');

INSERT INTO "Member" ("id", "name", "email", "birthdate", "status", "clubId") VALUES
('member_1', 'Alice Brown', 'alice@email.com', '1990-05-15', 'ACTIVE', 'club_1'),
('member_2', 'Bob Wilson', 'bob@email.com', '1985-08-22', 'ACTIVE', 'club_1'),
('member_3', 'Carol Davis', 'carol@email.com', '1992-03-10', 'ACTIVE', 'club_2');

INSERT INTO "Class" ("id", "name", "description", "type", "status", "startTime", "endTime", "maxCapacity", "currentEnrollment", "trainerId", "clubId") VALUES
('class_1', 'Morning Yoga', 'Gentle yoga for all levels', 'GROUP', 'SCHEDULED', '2024-01-15 07:00:00', '2024-01-15 08:00:00', 20, 15, 'trainer_1', 'club_1'),
('class_2', 'Strength Training', 'Intensive strength building', 'GROUP', 'SCHEDULED', '2024-01-15 18:00:00', '2024-01-15 19:30:00', 15, 12, 'trainer_2', 'club_2');

INSERT INTO "ClassEnrollment" ("id", "memberId", "classId", "status") VALUES
('enrollment_1', 'member_1', 'class_1', 'ENROLLED'),
('enrollment_2', 'member_2', 'class_1', 'ENROLLED'),
('enrollment_3', 'member_3', 'class_2', 'ENROLLED');

INSERT INTO "Payment" ("id", "amount", "status", "method", "memberId", "clubId") VALUES
('payment_1', 99.99, 'COMPLETED', 'CREDIT_CARD', 'member_1', 'club_1'),
('payment_2', 149.99, 'COMPLETED', 'BANK_TRANSFER', 'member_2', 'club_1'),
('payment_3', 199.99, 'PENDING', 'CREDIT_CARD', 'member_3', 'club_2');

INSERT INTO "Announcement" ("id", "title", "content", "type", "clubId") VALUES
('announcement_1', 'New Equipment Arrival', 'We have new state-of-the-art equipment arriving next week!', 'GENERAL', 'club_1'),
('announcement_2', 'Holiday Schedule', 'Please note our modified hours during the holiday season', 'REMINDER', 'club_2');

-- Create indexes for better performance
CREATE INDEX "Member_email_idx" ON "Member"("email");
CREATE INDEX "Member_clubId_idx" ON "Member"("clubId");
CREATE INDEX "Class_trainerId_idx" ON "Class"("trainerId");
CREATE INDEX "Class_clubId_idx" ON "Class"("clubId");
CREATE INDEX "ClassEnrollment_memberId_idx" ON "ClassEnrollment"("memberId");
CREATE INDEX "ClassEnrollment_classId_idx" ON "ClassEnrollment"("classId");
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");
CREATE INDEX "Payment_clubId_idx" ON "Payment"("clubId"); 