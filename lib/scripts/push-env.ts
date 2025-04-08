import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

// Load environment variables from .env
dotenv.config();

async function pushEnvToCloudflare() {
  console.log('🚀 Pushing environment variables to Cloudflare Pages...');
  
  // Always process the main .env file first for production settings
  const envFiles = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local')
  ];
  
  // Keep track of variables already set to avoid overriding production with local
  const processedVars = new Set<string>();
  let successCount = 0;
  let failureCount = 0;
  let skippedCount = 0;
  
  for (const envPath of envFiles) {
    if (!fs.existsSync(envPath)) {
      console.log(`ℹ️ File ${path.basename(envPath)} not found, skipping...`);
      continue;
    }
    
    const isLocalEnv = envPath.includes('.env.local');
    
    console.log(`📄 Processing ${path.basename(envPath)}...`);
    
    const fileStream = fs.createReadStream(envPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      // Skip comments and empty lines
      if (line.startsWith('#') || line.trim() === '') {
        continue;
      }
      
      // Extract variable name and value
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, name, value] = match;
        
        // Skip if this variable was already processed (from .env) and we're in .env.local
        if (isLocalEnv && processedVars.has(name)) {
          console.log(`⏭️ Skipping ${name} from .env.local as it's already set from .env (production)`);
          skippedCount++;
          continue;
        }
        
        // Mark this variable as processed
        processedVars.add(name);
        
        const trimmedValue = value.replace(/^["'](.*)["']$/, '$1'); // Remove quotes if present
        
        // Create the temp file outside of try/catch for scope access
        const tempFile = path.join(process.cwd(), '.temp-secret');
        fs.writeFileSync(tempFile, trimmedValue);
        
        try {
          // Use wrangler pages command to set the secret
          console.log(`Setting ${name}...`);
          
          // Use the correct flag: --project-name instead of --site
          execSync(`wrangler pages secret put ${name} --project-name codeidealv2 < ${tempFile}`, {
            stdio: 'inherit'
          });
          
          successCount++;
        } catch (e) {
          const error = e as Error;
          console.error(`❌ Failed to set ${name}: ${error.message}`);
          failureCount++;
          
          // Alternative approach if the project name is causing issues
          console.log(`Trying alternative approach without project name specification...`);
          try {
            // Try without project flag - it might use the project from wrangler.toml
            execSync(`wrangler pages secret put ${name} < ${tempFile}`, {
              stdio: 'inherit'
            });
            console.log(`✅ Successfully set ${name} without project flag`);
            successCount++;
            failureCount--; // Subtract the previous failure
          } catch (altError) {
            console.error(`❌ Both approaches failed for ${name}`);
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
  
  console.log(`✅ Done! Successfully pushed ${successCount} variables to Cloudflare Pages.`);
  if (skippedCount > 0) {
    console.log(`⏭️ Skipped ${skippedCount} local variables to preserve production settings.`);
  }
  if (failureCount > 0) {
    console.log(`❌ Failed to push ${failureCount} variables.`);
  }
  console.log(`\n📝 Note: You can manually set secrets with this command:
  wrangler pages secret put MY_SECRET_NAME --project-name codeidealv2
  `);
}

// Run the function
pushEnvToCloudflare().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
