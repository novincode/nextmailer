import fs from "fs/promises";
import path from "path";
import { render } from "@react-email/render";
import { glob } from "glob";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function generateTemplates() {
  console.log("🔍 Scanning for email templates...");
  
  // Directory paths
  const templatesDir = path.resolve(process.cwd(), "components/templates");
  const generatedDir = path.resolve(templatesDir, "generated");
  
  // Ensure the generated directory exists
  await fs.mkdir(generatedDir, { recursive: true });
  
  // Find all TSX files in the templates directory (excluding utilities)
  const templateFiles = await glob("*.tsx", { 
    cwd: templatesDir,
    ignore: ["**/generated/**", "**/utils/**", '**/*.ts'],
  });
  
  console.log(`📋 Found ${templateFiles.length} template files to process`);
  
  // Set environment variables that templates might need
  process.env.NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextMailer';
  process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nextmailer.com';
  process.env.DEFAULT_MAIL_THEME = process.env.DEFAULT_MAIL_THEME || 'light';
  
  console.log(`📝 Using app URL: ${process.env.NEXT_PUBLIC_APP_URL}`);
  
  for (const file of templateFiles) {
    try {
      const templateName = path.basename(file, ".tsx");
      console.log(`⚙️ Processing template: ${templateName}`);
      
      // Dynamic import the template
      const templatePath = path.join(process.cwd(), "components/templates", file);
      const templateModule = await import(templatePath);
      const Template = templateModule.default;
      
      // Use minimal default props - the real props will be passed at runtime
      const minimalProps = getMinimalProps(templateName);
      
      // Render the template to get the HTML structure
      const html = await render(Template(minimalProps), { pretty: false });
      
      // Create the output file
      const outputPath = path.join(generatedDir, `${templateName}.ts`);
      await fs.writeFile(
        outputPath,
        `// Generated from ${templateName}.tsx - DO NOT EDIT DIRECTLY\n\nexport const html = ${JSON.stringify(html)};\n`
      );
      
      console.log(`✅ Generated: ${path.relative(process.cwd(), outputPath)}`);
    } catch (error) {
      console.error(`❌ Error processing template ${file}:`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
    }
  }
  
  console.log("🎉 Template generation complete!");
}

/**
 * Provide minimal props needed to render the template structure
 * These are just placeholders - actual props will be used at runtime
 */
function getMinimalProps(templateName: string) {
  // Just provide the minimum required props to render the template
  const baseProps = {
    darkMode: false
  };
  
  // Add any absolutely required props to avoid template errors
  if (templateName === 'LeadMagnetTemplate') {
    return {
      ...baseProps,
      title: 'Template Preview',
      downloadUrl: '#',
    };
  }
  
  if (templateName === 'LayoutTemplate') {
    return {
      ...baseProps,
      children: 'Template Content',
    };
  }
  
  return baseProps;
}

// Run the generator
generateTemplates().catch(err => {
  console.error("Failed to generate templates:", err);
  process.exit(1);
});
