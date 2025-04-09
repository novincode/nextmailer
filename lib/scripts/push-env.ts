import * as dotenv from "dotenv";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Load environment variables from .env
dotenv.config();

// Function to get project name from Wrangler config files
function getProjectName(): string {
  // Try to read from wrangler.toml first
  const wranglerTomlPath = path.join(process.cwd(), 'wrangler.toml');
  if (fs.existsSync(wranglerTomlPath)) {
    const tomlContent = fs.readFileSync(wranglerTomlPath, 'utf8');
    const nameMatch = tomlContent.match(/name\s*=\s*["']([^"']+)["']/);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1];
    }
  }

  // Then try wrangler.jsonc
  const wranglerJsoncPath = path.join(process.cwd(), 'wrangler.jsonc');
  if (fs.existsSync(wranglerJsoncPath)) {
    try {
      // Read the JSONC file content
      const jsonContent = fs.readFileSync(wranglerJsoncPath, 'utf8');
      
      // Improved regex-based approach to find the name property
      // This avoids having to parse the entire JSON and handles unquoted property names
      const nameMatch = jsonContent.match(/["']?name["']?\s*:\s*["']([^"']+)["']/);
      if (nameMatch && nameMatch[1]) {
        return nameMatch[1];
      }
    } catch (error) {
      console.warn('Error reading wrangler.jsonc:', error);
    }
  }

  // Check for package.json name - this is reliable
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.name) {
        return packageJson.name;
      }
    }
  } catch (error) {
    console.warn('Error reading package.json:', error);
  }

  // Fall back to environment variable
  if (process.env.CLOUDFLARE_PROJECT_NAME) {
    return process.env.CLOUDFLARE_PROJECT_NAME;
  }

  // Use the actual project name from the output - fixing the hardcoded value
  const actualProjectName = 'nextmailer';
  console.warn(`WARNING: Using "${actualProjectName}" as the project name.`);
  console.warn('Add CLOUDFLARE_PROJECT_NAME to your .env file to override.');
  return actualProjectName;
}

// Identify variables that should never be pushed from .env.local to production
const PROTECTED_PRODUCTION_VARS = [
  'NEXT_PUBLIC_APP_URL',  // URLs should be production in prod
  'DATABASE_URL',         // Database connection strings
  'RESEND_DOMAIN',        // Email domains
  'NEXT_PUBLIC_RUNTIME',  // Runtime settings
];

async function pushEnvToCloudflare() {
  console.log("🚀 Pushing environment variables to Cloudflare Pages...");

  // Get the project name for reporting
  const projectName = getProjectName();
  
  // Always process the main .env file first for production settings
  const envFiles = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
  ];

  // Keep track of variables already set to avoid overriding production with local
  const processedVars = new Set<string>();
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  let protectedCount = 0;

  console.log(`🔍 Using project name: ${projectName}`);
  console.log(`⚠️ PROTECTED VARIABLES that will not be overridden by .env.local:`);
  PROTECTED_PRODUCTION_VARS.forEach(v => console.log(`   - ${v}`));

  for (const envPath of envFiles) {
    if (!fs.existsSync(envPath)) {
      console.log(`ℹ️ File ${path.basename(envPath)} not found, skipping...`);
      continue;
    }

    const isLocalEnv = envPath.includes(".env.local");
    const envType = isLocalEnv ? "LOCAL DEV" : "PRODUCTION";

    console.log(`\n📄 Processing ${path.basename(envPath)} (${envType} environment)...`);

    const fileStream = fs.createReadStream(envPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Skip comments and empty lines
      if (line.startsWith("#") || line.trim() === "") {
        continue;
      }

      // Extract variable name and value
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, name, value] = match;

        // Skip if this variable was already processed AND 
        // (it's a local env OR it's a protected production variable)
        if (processedVars.has(name)) {
          if (isLocalEnv) {
            if (PROTECTED_PRODUCTION_VARS.includes(name)) {
              console.log(
                `🛡️ PROTECTED: ${name} from .env.local will not override production value`
              );
              protectedCount++;
            } else {
              console.log(
                `⏭️ Skipping ${name} from .env.local as it's already set from .env`
              );
              skippedCount++;
            }
            continue;
          }
        }

        // If it's a local environment and the variable is protected,
        // we need to check if it was already processed from .env
        if (isLocalEnv && PROTECTED_PRODUCTION_VARS.includes(name) && processedVars.has(name)) {
          console.log(
            `🛡️ PROTECTED: ${name} from .env.local will not override production value`
          );
          protectedCount++;
          continue;
        }

        // Mark this variable as processed
        processedVars.add(name);

        const trimmedValue = value.replace(/^["'](.*)["']$/, "$1"); // Remove quotes if present

        // For important variables, log what's being set (but mask secrets)
        const isSensitive = name.toLowerCase().includes('key') || 
                           name.toLowerCase().includes('secret') || 
                           name.toLowerCase().includes('password');
        
        const logValue = isSensitive ? '********' : trimmedValue;
        console.log(`Setting ${name}=${logValue} from ${isLocalEnv ? '.env.local' : '.env'}`);

        // Create the temp file outside of try/catch for scope access
        const tempFile = path.join(process.cwd(), ".temp-secret");
        fs.writeFileSync(tempFile, trimmedValue);

        try {
          // Get the project name dynamically
          console.log(`Using Cloudflare project name: ${projectName}`);

          // Use the correct flag: --project-name instead of --site
          execSync(
            `wrangler pages secret put ${name} --project-name ${projectName} < ${tempFile}`,
            {
              stdio: "inherit",
            },
          );

          successCount++;
        } catch (e) {
          const error = e as Error;
          console.error(`❌ Failed to set ${name}: ${error.message}`);
          failureCount++;

          // Alternative approach if the project name is causing issues
          console.log(
            `Trying alternative approach without project name specification...`,
          );
          try {
            // Try without project flag - it might use the project from wrangler.toml
            execSync(`wrangler pages secret put ${name} < ${tempFile}`, {
              stdio: "inherit",
            });
            console.log(`✅ Successfully set ${name} without project flag`);
            successCount++;
            failureCount--; // Subtract the previous failure
          } catch (altError) {
            console.error(`❌ Both approaches failed for ${name}`);
            console.log((altError as Error).message)
          }
        } finally {
          // Always clean up the temp file, whether successful or not
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }
        }
      }
    }
  }

  console.log(
    `\n✅ Done! Successfully pushed ${successCount} variables to Cloudflare Pages.`,
  );
  if (skippedCount > 0) {
    console.log(
      `⏭️ Skipped ${skippedCount} local variables to preserve production settings.`,
    );
  }
  if (protectedCount > 0) {
    console.log(
      `🛡️ Protected ${protectedCount} production variables from being overridden by local values.`,
    );
  }
  if (failureCount > 0) {
    console.log(`❌ Failed to push ${failureCount} variables.`);
  }
  console.log(`\n📝 Note: You can manually set secrets with this command:
  wrangler pages secret put MY_SECRET_NAME --project-name ${projectName}
  `);
}

// Run the function
pushEnvToCloudflare().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
