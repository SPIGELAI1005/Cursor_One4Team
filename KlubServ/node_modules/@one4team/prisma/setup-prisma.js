const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Setting up Prisma...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma@latest generate', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Prisma client generated successfully!');
  
  // Run migrations
  console.log('🔄 Running database migrations...');
  execSync('npx prisma@latest migrate dev --name init', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Database migrations completed!');
  
  // Seed the database
  console.log('🌱 Seeding database...');
  execSync('npx tsx@latest seed.ts', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Database seeded successfully!');
  console.log('🎉 Prisma setup completed!');
  
} catch (error) {
  console.error('❌ Error during Prisma setup:', error.message);
  process.exit(1);
} 