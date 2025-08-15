# Trainer Area Guide - One4Team

## Overview

The Trainer Area is a comprehensive management interface for sports club trainers to manage players, training sessions, schedules, and development notes. It provides tools for player evaluation, training plan creation, schedule management, and progress tracking.

## Features

### 🏠 Dashboard
- **Overview Statistics**: Total players, sessions, ratings, and notes
- **Quick Actions**: Direct access to key functions
- **Recent Sessions**: Latest training activities
- **Performance Overview**: Top performers and improvements

### 👥 Players Management
- **Player Grid**: View all players with key information
- **Search & Filter**: Find players by name, team, position, or status
- **Player Cards**: Individual player profiles with ratings
- **Evaluation System**: Rate players across 6 categories (1-5 stars)
- **Performance Tracking**: Monitor player development over time

### 📚 Training Management
- **Training Plans**: Create and manage training templates
- **Session Scheduling**: Schedule training sessions with time slots
- **Template System**: Reuse and customize training plans
- **Difficulty Levels**: Beginner, Intermediate, Advanced, All Levels
- **Focus Areas**: Technical, Tactical, Physical, Mental skills

### 📅 Schedule Management
- **Weekly Calendar**: Interactive calendar interface
- **Time Slot Booking**: Book available time slots
- **Conflict Detection**: Prevent scheduling overlaps
- **Session Status**: Track scheduled, in-progress, completed sessions
- **Upcoming Sessions**: Overview of planned activities

### 📝 Player Notes
- **Development Journal**: Track player progress and observations
- **Tag System**: Organize notes with custom tags
- **Privacy Controls**: Public and private notes
- **Search & Filter**: Find notes by player, tags, or content
- **Timeline View**: Chronological note history

## Access & Authentication

### Prerequisites
1. **Clerk Account**: Must have a Clerk account with trainer role
2. **Database Setup**: Prisma schema must be migrated
3. **API Server**: Backend API must be running

### Access URL
```
http://localhost:3000/dashboard/trainer
```

### Role Requirements
- **User Role**: Must have "trainer" role in Clerk
- **Authentication**: Must be signed in to Clerk
- **Authorization**: Role-based access control enforced

## Setup Instructions

### 1. Database Migration

Run the Prisma migration to create trainer-specific tables:

```bash
cd packages/prisma
npx prisma migrate dev --name add-trainer-models
```

### 2. Seed Data (Optional)

Add sample data for testing:

```bash
cd packages/prisma
npx prisma db seed
```

### 3. API Server

Start the backend API server:

```bash
cd apps/api
npm run dev
```

### 4. Frontend Application

Start the Next.js frontend:

```bash
cd apps/web
npm run dev
```

## API Endpoints

### Players Management
- `GET /api/trainer/players` - Get all players
- `POST /api/trainer/players/:playerId/evaluations` - Create player evaluation
- `GET /api/trainer/players/:playerId/evaluations` - Get player evaluations

### Training Management
- `GET /api/trainer/training/plans` - Get training plans
- `POST /api/trainer/training/plans` - Create training plan
- `PUT /api/trainer/training/plans/:id` - Update training plan
- `DELETE /api/trainer/training/plans/:id` - Delete training plan
- `GET /api/trainer/training/sessions` - Get training sessions
- `POST /api/trainer/training/sessions` - Create training session

### Schedule Management
- `GET /api/trainer/schedule` - Get schedule for date range
- `POST /api/trainer/schedule/book` - Book time slot
- `GET /api/trainer/schedule/available/:date` - Get available slots
- `PATCH /api/trainer/schedule/sessions/:id/status` - Update session status

### Notes Management
- `GET /api/trainer/notes` - Get all notes
- `POST /api/trainer/notes` - Create note
- `PUT /api/trainer/notes/:id` - Update note
- `DELETE /api/trainer/notes/:id` - Delete note
- `GET /api/trainer/notes/player/:playerId` - Get player notes
- `GET /api/trainer/notes/stats/overview` - Get note statistics

## Database Schema

### New Models Added

#### Player
```prisma
model Player {
  id           String   @id @default(cuid())
  memberId     String   @unique
  member       Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)
  position     String?
  team         String?
  jerseyNumber Int?
  status       PlayerStatus @default(ACTIVE)
  evaluations  Evaluation[]
  notes        Note[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Evaluation
```prisma
model Evaluation {
  id        String   @id @default(cuid())
  trainerId String
  playerId  String
  score     Int      // 1-5 rating
  comment   String?
  category  EvaluationCategory @default(OVERALL)
  date      DateTime @default(now())
  trainer   Trainer  @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  player    Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
}
```

#### Note
```prisma
model Note {
  id        String   @id @default(cuid())
  playerId  String
  trainerId String
  title     String
  content   String
  tags      String[]
  isPrivate Boolean  @default(false)
  player    Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
  trainer   Trainer  @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### TrainingPlan
```prisma
model TrainingPlan {
  id          String   @id @default(cuid())
  trainerId   String
  name        String
  description String?
  focus       String
  duration    Int      // minutes
  drills      String   // JSON or rich text
  difficulty  TrainingDifficulty @default(BEGINNER)
  isTemplate  Boolean  @default(false)
  trainer     Trainer  @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  sessions    TrainingSession[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### TrainingSession
```prisma
model TrainingSession {
  id            String   @id @default(cuid())
  planId        String?
  trainerId     String
  name          String
  description   String?
  startTime     DateTime
  endTime       DateTime
  location      String?
  maxPlayers    Int?
  status        SessionStatus @default(SCHEDULED)
  plan          TrainingPlan? @relation(fields: [planId], references: [id])
  trainer       Trainer  @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

### Enums
```prisma
enum PlayerStatus {
  ACTIVE
  INACTIVE
  INJURED
  SUSPENDED
}

enum EvaluationCategory {
  OVERALL
  TECHNICAL
  TACTICAL
  PHYSICAL
  MENTAL
  ATTITUDE
}

enum TrainingDifficulty {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  ALL_LEVELS
}

enum SessionStatus {
  SCHEDULED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

## Usage Guide

### Managing Players

1. **View Players**: Navigate to Players page to see all team members
2. **Search & Filter**: Use filters to find specific players
3. **Player Evaluation**: Click "Evaluate" on player cards to rate performance
4. **Performance Tracking**: Monitor ratings and improvements over time

### Creating Training Plans

1. **Access Training**: Go to Training Management page
2. **Create Plan**: Click "Create Training" button
3. **Fill Details**: Enter name, focus area, duration, and drills
4. **Save Template**: Optionally save as reusable template
5. **Schedule Session**: Use plan to schedule actual training sessions

### Managing Schedule

1. **View Calendar**: Navigate to Schedule page
2. **Select Date**: Click on specific date to view time slots
3. **Book Slot**: Click available time slots to book sessions
4. **Session Details**: Add session name, location, and description
5. **Conflict Prevention**: System prevents double-booking

### Taking Player Notes

1. **Access Notes**: Go to Notes page
2. **Create Note**: Click "Add Note" button
3. **Select Player**: Choose player from dropdown
4. **Add Content**: Write observations and feedback
5. **Add Tags**: Use tags for organization
6. **Privacy**: Set note as public or private
7. **Search**: Use search and filters to find specific notes

## Security Features

### Authentication
- **Clerk Integration**: JWT-based authentication
- **Role-Based Access**: Trainer role required
- **Session Management**: Secure session handling

### Authorization
- **Data Ownership**: Trainers can only access their own data
- **Player Access**: Trainers can only access players in their club
- **API Protection**: All endpoints protected with role validation

### Data Privacy
- **Private Notes**: Sensitive notes can be marked private
- **Secure Storage**: Data encrypted in database
- **Access Logging**: Track data access for audit purposes

## Troubleshooting

### Common Issues

1. **Access Denied (403)**
   - Ensure user has "trainer" role in Clerk
   - Check authentication status
   - Verify database permissions

2. **Database Errors**
   - Run Prisma migrations: `npx prisma migrate dev`
   - Check database connection
   - Verify schema changes

3. **API Connection Issues**
   - Ensure API server is running
   - Check API endpoint URLs
   - Verify CORS configuration

4. **Component Loading Errors**
   - Check browser console for errors
   - Verify all dependencies installed
   - Clear browser cache

### Development Tips

1. **Mock Data**: Use mock data for testing before API integration
2. **Console Logs**: Check browser console for debugging
3. **Network Tab**: Monitor API calls in browser dev tools
4. **Database Queries**: Use Prisma Studio for database inspection

## Future Enhancements

### Planned Features
- **Real-time Updates**: Live notifications for schedule changes
- **Advanced Analytics**: Performance trends and insights
- **Mobile App**: Native mobile application
- **Integration**: Connect with external training platforms
- **Reporting**: Generate detailed reports and exports

### Performance Optimizations
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Add pagination for large datasets
- **Image Optimization**: Optimize player photos and documents
- **Bundle Optimization**: Reduce frontend bundle size

## Support

For technical support or questions about the Trainer Area:

1. **Documentation**: Check this guide and API documentation
2. **Issues**: Report bugs through project issue tracker
3. **Development**: Contact development team for feature requests
4. **Training**: Request training sessions for new users

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Compatibility**: One4Team v1.0+ 