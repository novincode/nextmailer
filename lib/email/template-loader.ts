/**
 * Email Template Loader
 *
 * This utility allows loading email templates in both Node and Edge environments.
 * In Node: Renders React components on demand
 * In Edge: Uses pre-generated HTML with placeholder substitution
 */

/**
 * Replace placeholder tokens in HTML with actual values
 */
function replacePlaceholders(html: string, props: Record<string, any>) {
  let result = html;
  
  // Handle null/undefined gracefully
  for (const [key, value] of Object.entries(props)) {
    const placeholder = `{{${key}}}`;
    
    // Skip replacement if value is null/undefined to avoid "null" text
    if (value === null || value === undefined) {
      // Remove the placeholder entirely
      result = result.replace(new RegExp(placeholder, 'g'), '');
      continue;
    }
    
    // Convert non-string values to strings
    const stringValue = typeof value === 'string' 
      ? value 
      : String(value);
      
    // Replace all occurrences of the placeholder
    result = result.replace(new RegExp(placeholder, 'g'), stringValue);
  }
  
  return result;
}

export async function loadEmailTemplate(templateName: string, props: Record<string, any> = {}) {
  const isEdge = process.env.NEXT_PUBLIC_RUNTIME === "edge";

  if (isEdge) {
    try {
      // In Edge, load the pre-generated HTML and replace placeholders
      const { html: rawHtml } = await import(
        `../../components/templates/generated/${templateName}`
      );
      
      // Replace placeholders with actual values
      return replacePlaceholders(rawHtml, props);
    } catch (error) {
      throw new Error(
        `Template "${templateName}" not found in generated templates. ` +
        `Run 'npx tsx lib/scripts/generate-templates.ts' first.`,
      );
    }
  } else {
    // In Node, render the component on-demand
    try {
      const { render } = await import("@react-email/render");
      const templateModule = await import(
        `../../components/templates/${templateName}`
      );
      const Template = templateModule.default;
      return await render(Template(props));
    } catch (e) {
      const error = e as Error;
      throw new Error(
        `Failed to render template "${templateName}": ${error.message}`,
      );
    }
  }
}
