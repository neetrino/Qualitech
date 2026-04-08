import sanitizeHtml from "sanitize-html";

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "span",
    "div",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "strike",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "pre",
    "code",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "width", "height"],
    "*": ["style", "class"],
  },
  allowedStyles: {
    "*": {
      color: [/^#[0-9a-fA-F]{3,8}$/i, /^rgb/i, /^hsl/i],
      "background-color": [/^#[0-9a-fA-F]{3,8}$/i, /^rgb/i, /^hsl/i, /^transparent$/i],
      "text-align": [/^left$/i, /^right$/i, /^center$/i, /^justify$/i],
      "font-size": [/^[\d.]+(px|em|rem|%)$/],
    },
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
  },
};

/**
 * Server-side HTML cleanup for machine descriptions (admin WYSIWYG output).
 */
export function sanitizeMachineDescriptionHtml(raw: string): string {
  return sanitizeHtml(raw.trim(), OPTIONS);
}
