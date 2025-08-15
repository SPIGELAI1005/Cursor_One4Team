const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up One4Team database using global Prisma...');

// Check if .env.local exists in the root directory
const rootEnvPath = path.join(__dirname, '../../.env.local');
if (!fs.existsSync(rootEnvPath)) {
  console.error('❌ .env.local file not found in One4Team root directory');
  console.log('Please create .env.local with your Supabase connection string');
  process.exit(1);
}

console.log('✅ .env.local file found');

try {
  // Copy .env.local to .env for Prisma
  const envContent = fs.readFileSync(rootEnvPath, 'utf8');
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Environment variables copied');

  // Use global Prisma directly
  console.log('📦 Generating Prisma client using global Prisma...');
  execSync('prisma generate --schema=./schema.prisma', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Prisma client generated successfully!');
  
  // Run migrations using global Prisma
  console.log('🔄 Running database migrations...');
  execSync('prisma migrate dev --schema=./schema.prisma --name init', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Database migrations completed!');
  
  // Seed the database using npx tsx
  console.log('🌱 Seeding database...');
  execSync('npx tsx@latest seed.ts', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Database seeded successfully!');
  console.log('🎉 Database setup completed!');
  
  // Clean up temporary .env file
  fs.unlinkSync(path.join(__dirname, '.env'));
  console.log('🧹 Cleaned up temporary files');
  
} catch (error) {
  console.error('❌ Error during database setup:', error.message);
  
  // Clean up temporary .env file if it exists
  const tempEnvPath = path.join(__dirname, '.env');
  if (fs.existsSync(tempEnvPath)) {
    fs.unlinkSync(tempEnvPath);
  }
  
  process.exit(1);
} 