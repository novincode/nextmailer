/**
 * Email Template Loader
 *
 * This utility allows loading email templates in both Node and Edge environments.
 * In Node: Renders React components on demand
 * In Edge: Uses pre-generated HTML from the build step
 */

export async function loadEmailTemplate(templateName: string, props: any = {}) {
  const isEdge = process.env.NEXT_PUBLIC_RUNTIME === "edge";

  if (isEdge) {
    try {
      // In Edge, load the pre-generated HTML
      const { html } = await import(
        `../../components/templates/generated/${templateName}`
      );
      return html;
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
