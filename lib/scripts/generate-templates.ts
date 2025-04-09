import fs from "fs/promises";
import path from "path";
import { render } from "@react-email/render";
import { glob } from "glob";
import dotenv from "dotenv";
import * as ts from "typescript";

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
      
      // Get the full file path
      const templatePath = path.join(process.cwd(), "components/templates", file);
      
      // Extract props from the template file
      const propNames = await extractPropsFromTemplate(templatePath);
      console.log(`📊 Found props:`, propNames);
      
      // Generate placeholder props based on extracted prop names
      const placeholderProps = generatePlaceholderProps(propNames);
      
      // Dynamic import the template component
      const templateModule = await import(templatePath);
      const Template = templateModule.default;
      
      // Render the template to get the HTML structure with placeholders
      const html = await render(Template(placeholderProps), { pretty: false });
      
      // Create the output file
      const outputPath = path.join(generatedDir, `${templateName}.ts`);
      await fs.writeFile(
        outputPath,
        `// Generated from ${templateName}.tsx - DO NOT EDIT DIRECTLY\n\n` +
        `// Available placeholders: [${propNames.join(', ')}]\n` +
        `export const html = ${JSON.stringify(html)};\n`
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
 * Extract props from a template file by analyzing its TypeScript interface
 */
async function extractPropsFromTemplate(filePath: string): Promise<string[]> {
  // Read the source file
  const fileContent = await fs.readFile(filePath, 'utf-8');
  
  // Use TypeScript to parse the file
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );
  
  const propNames: string[] = [];
  
  // Find the props interface (usually named *Props or ends with Props)
  function visit(node: ts.Node) {
    // Look for interfaces ending with "Props"
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      // Extract prop names from the interface
      node.members.forEach(member => {
        if (ts.isPropertySignature(member) && member.name) {
          // Get property name
          let propName: string;
          if (ts.isIdentifier(member.name)) {
            propName = member.name.text;
          } else if (ts.isStringLiteral(member.name)) {
            propName = member.name.text;
          } else {
            return; // Skip if name is not a simple identifier
          }
          
          // Add to our list of props
          propNames.push(propName);
        }
      });
    }
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  // Always include darkMode for theme control
  if (!propNames.includes('darkMode')) {
    propNames.push('darkMode');
  }
  
  return propNames;
}

/**
 * Generate placeholder props based on extracted prop names
 */
function generatePlaceholderProps(propNames: string[]): Record<string, any> {
  const placeholderProps: Record<string, any> = {};
  
  // Create placeholders for each prop
  propNames.forEach(propName => {
    if (propName === 'darkMode') {
      // Keep darkMode as boolean for correct rendering
      placeholderProps[propName] = false;
    } else {
      // Generate placeholder tokens for other props
      placeholderProps[propName] = `{{${propName}}}`;
    }
  });
  
  return placeholderProps;
}

// Run the generator
generateTemplates().catch(err => {
  console.error("Failed to generate templates:", err);
  process.exit(1);
});
