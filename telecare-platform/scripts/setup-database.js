#!/usr/bin/env node

// Database setup script for Cloudflare D1
// Run with: node scripts/setup-database.js [environment]

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const env = process.argv[2] || "dev";
const validEnvs = ["dev", "staging", "prod"];

if (!validEnvs.includes(env)) {
  console.error(
    `Invalid environment: ${env}. Must be one of: ${validEnvs.join(", ")}`
  );
  process.exit(1);
}

const envSuffix = env === "dev" ? "" : `:${env}`;
const dbName = `telecare-platform-${env}`;

console.log(`🗄️  Setting up Cloudflare D1 database for ${env} environment...`);

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

  // Create database
  console.log(`📦 Creating database: ${dbName}...`);
  try {
    const createResult = execSync(`npx wrangler d1 create ${dbName}`, {
      encoding: "utf8",
      stdio: "pipe",
    });

    // Extract database ID from output
    const dbIdMatch = createResult.match(/database_id = "([^"]+)"/);
    if (dbIdMatch) {
      const dbId = dbIdMatch[1];
      console.log(`✅ Database created with ID: ${dbId}`);

      // Update wrangler.toml with the database ID
      const wranglerPath = path.join(__dirname, "..", "wrangler.toml");
      if (fs.existsSync(wranglerPath)) {
        let wranglerContent = fs.readFileSync(wranglerPath, "utf8");
        const envSection =
          env === "dev" ? "development" : env === "prod" ? "production" : env;
        const regex = new RegExp(
          `(\\[env\\.${envSection}\\.d1_databases\\][\\s\\S]*?database_id = ")([^"]*)(")`,
          "g"
        );
        wranglerContent = wranglerContent.replace(regex, `$1${dbId}$3`);
        fs.writeFileSync(wranglerPath, wranglerContent);
        console.log(`✅ Updated wrangler.toml with database ID`);
      }
    }
  } catch (error) {
    if (error.message.includes("already exists")) {
      console.log(
        `⚠️  Database ${dbName} already exists, skipping creation...`
      );
    } else {
      throw error;
    }
  }

  // Run migrations
  const migrationFiles = [
    "./migrations/0001_initial_schema.sql",
    "./migrations/0002_seed_data.sql",
  ];

  const envFlag =
    env === "dev"
      ? "--env development"
      : env === "prod"
        ? "--env production --remote"
        : `--env ${env}`;

  for (const migrationFile of migrationFiles) {
    const migrationPath = path.join(__dirname, "..", migrationFile);
    if (fs.existsSync(migrationPath)) {
      console.log(`🔄 Running migration: ${migrationFile}...`);
      try {
        execSync(
          `npx wrangler d1 execute DB --file=${migrationFile} ${envFlag}`,
          {
            stdio: "inherit",
          }
        );
        console.log(`✅ Migration completed: ${migrationFile}`);
      } catch (error) {
        console.error(`❌ Migration failed: ${migrationFile}`);
        throw error;
      }
    } else {
      console.warn(`⚠️  Migration file not found: ${migrationFile}`);
    }
  }

  // Verify database setup
  console.log("🔍 Verifying database setup...");
  const verifyResult = execSync(
    `npx wrangler d1 execute DB --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';" ${envFlag}`,
    {
      encoding: "utf8",
      stdio: "pipe",
    }
  );

  if (verifyResult.includes("table_count")) {
    console.log("✅ Database verification successful");
  }

  console.log(`\n🎉 Database setup completed for ${env} environment!`);
  console.log(`\nNext steps:`);
  console.log(`1. Update your environment variables with the database binding`);
  console.log(`2. Deploy your application: npm run cf:deploy${envSuffix}`);
  console.log(`3. Test the database connection in your application`);

  if (env === "dev") {
    console.log(`\nFor development, you can also:`);
    console.log(`- View tables: npm run db:console`);
    console.log(`- Reset database: npm run db:reset`);
  }
} catch (error) {
  console.error("❌ Database setup failed:", error.message);
  process.exit(1);
}
