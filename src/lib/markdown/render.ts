import { Marked } from "marked";

// Markdown → safe HTML for activity bodies. Works on the server and in the browser.
// Only Markdown-generated tags reach the page: raw HTML is escaped (except <u>, which the editor
// uses for underline), links render as plain text and images are dropped.

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const UNDERLINE_TAG = /^<\/?u>$/i;

const md = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    html({ text }) {
      return UNDERLINE_TAG.test(text.trim()) ? text.trim().toLowerCase() : escapeHtml(text);
    },
    link({ text }) {
      return escapeHtml(text);
    },
    image({ text }) {
      return escapeHtml(text);
    },
  },
});

export function renderMarkdown(source: string): string {
  return md.parse(source, { async: false }) as string;
}
