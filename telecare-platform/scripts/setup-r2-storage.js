#!/usr/bin/env node

// R2 Storage setup script for Cloudflare R2
// Run with: node scripts/setup-r2-storage.js [environment]

const { execSync } = require("child_process");

const env = process.argv[2] || "all";
const validEnvs = ["dev", "staging", "prod", "all"];

if (!validEnvs.includes(env)) {
  console.error(
    `Invalid environment: ${env}. Must be one of: ${validEnvs.join(", ")}`
  );
  process.exit(1);
}

console.log(`🪣 Setting up Cloudflare R2 storage for ${env} environment(s)...`);

const buckets = {
  dev: "telecare-platform-storage-dev",
  staging: "telecare-platform-storage-staging",
  prod: "telecare-platform-storage-prod",
};

const envsToSetup = env === "all" ? ["dev", "staging", "prod"] : [env];

try {
  // Check if wrangler is available
  try {
    execSync("npx wrangler --version", { stdio: "pipe" });
  } catch (error) {
    console.error("❌ Wrangler CLI not found. Please install it first:");
    console.error("   npm install wrangler --save-dev");
    process.exit(1);
  }

  // Check if user is logged in
  try {
    execSync("npx wrangler whoami", { stdio: "pipe" });
  } catch (error) {
    console.log("🔐 Please log in to Cloudflare first...");
    execSync("npx wrangler login", { stdio: "inherit" });
  }

  // Create buckets
  for (const targetEnv of envsToSetup) {
    const bucketName = buckets[targetEnv];
    console.log(`📦 Creating R2 bucket: ${bucketName}...`);

    try {
      execSync(`npx wrangler r2 bucket create ${bucketName}`, {
        stdio: "inherit",
      });
      console.log(`✅ R2 bucket created: ${bucketName}`);
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log(`⚠️  R2 bucket ${bucketName} already exists, skipping...`);
      } else {
        console.error(`❌ Failed to create bucket ${bucketName}:`, error.message);
        throw error;
      }
    }
  }

  // Configure CORS for file uploads
  console.log("\n🔧 Configuring CORS settings...");
  
  const corsConfig = {
    AllowedOrigins: [
      "https://telecare-platform.pages.dev",
      "https://*.telecare-platform.pages.dev",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
    AllowedHeaders: ["*"],
    ExposeHeaders: ["ETag"],
    MaxAgeSeconds: 3600
  };

  // Apply CORS to each bucket
  for (const targetEnv of envsToSetup) {
    const bucketName = buckets[targetEnv];
    console.log(`🔧 Configuring CORS for ${bucketName}...`);
    
    try {
      // Create temporary CORS file
      const corsFile = `cors-${targetEnv}.json`;
      require("fs").writeFileSync(corsFile, JSON.stringify([corsConfig], null, 2));
      
      execSync(`npx wrangler r2 bucket cors set ${bucketName} --file ${corsFile}`, {
        stdio: "pipe",
      });
      
      // Clean up temp file
      require("fs").unlinkSync(corsFile);
      
      console.log(`✅ CORS configured for ${bucketName}`);
    } catch (error) {
      console.warn(`⚠️  Failed to configure CORS for ${bucketName}: ${error.message}`);
    }
  }

  // Test bucket access
  console.log("\n🧪 Testing bucket access...");
  
  for (const targetEnv of envsToSetup) {
    const bucketName = buckets[targetEnv];
    try {
      execSync(`npx wrangler r2 bucket list | grep ${bucketName}`, {
        stdio: "pipe",
      });
      console.log(`✅ Bucket ${bucketName} is accessible`);
    } catch (error) {
      console.warn(`⚠️  Could not verify access to ${bucketName}`);
    }
  }

  console.log(`\n🎉 R2 storage setup completed for ${env} environment(s)!`);
  console.log(`\nNext steps:`);
  console.log(`1. Your R2 buckets are ready for file uploads`);
  console.log(`2. CORS is configured for web uploads`);
  console.log(`3. Update your application to use R2 storage binding`);
  
  if (env === "prod" || env === "all") {
    console.log(`4. Deploy your application: npm run cf:deploy:prod`);
  }

} catch (error) {
  console.error("❌ R2 setup failed:", error.message);
  process.exit(1);
}