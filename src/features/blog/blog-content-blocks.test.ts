import { describe, expect, it } from "vitest";

import {
  dropBlocksCoveredByExcerpt,
  getBlogInlineImageInsertIndex,
  joinBlogContentBlocks,
  splitBlogContentBlocks,
} from "@/features/blog/blog-content-blocks";

describe("getBlogInlineImageInsertIndex", () => {
  it("places the figure after the body when the article is short", () => {
    expect(getBlogInlineImageInsertIndex([])).toBe(0);
    expect(getBlogInlineImageInsertIndex(["<p>A</p>"])).toBe(1);
    expect(getBlogInlineImageInsertIndex(["<p>A</p>", "<p>B</p>"])).toBe(2);
  });

  it("places the figure at the midpoint when there is enough copy", () => {
    expect(getBlogInlineImageInsertIndex(["<p>A</p>", "<p>B</p>", "<p>C</p>"])).toBe(2);
    expect(getBlogInlineImageInsertIndex(["<p>A</p>", "<p>B</p>", "<p>C</p>", "<p>D</p>"])).toBe(2);
  });

  it("does not insert the figure immediately after a heading", () => {
    const blocks = ["<p>A</p>", "<p>B</p>", "<h2>Title</h2>", "<p>C</p>", "<p>D</p>"];
    expect(getBlogInlineImageInsertIndex(blocks)).toBe(4);
  });
});

describe("dropBlocksCoveredByExcerpt", () => {
  it("removes leading paragraphs that repeat the excerpt", () => {
    const blocks = ["<p>Lead sentence.</p>", "<p>Second sentence.</p>", "<h2>Next</h2>"];
    expect(dropBlocksCoveredByExcerpt(blocks, "Lead sentence. Second sentence.")).toEqual(["<h2>Next</h2>"]);
  });

  it("keeps all blocks when the excerpt is not a prefix", () => {
    const blocks = ["<p>Unique body.</p>"];
    expect(dropBlocksCoveredByExcerpt(blocks, "Different dek.")).toEqual(blocks);
  });
});

describe("splitBlogContentBlocks", () => {
  it("wraps newline-separated plain text and promotes short heading lines", () => {
    const html = splitBlogContentBlocks(
      "Opening paragraph with a period.\nTechnical requirements\nNext paragraph continues.",
    );
    expect(html).toEqual([
      "<p>Opening paragraph with a period.</p>",
      "<h2>Technical requirements</h2>",
      "<p>Next paragraph continues.</p>",
    ]);
  });

  it("splits top-level HTML paragraphs", () => {
    const html = splitBlogContentBlocks("<p>One</p><p>Two</p><p>Three</p>");
    expect(html).toEqual(["<p>One</p>", "<p>Two</p>", "<p>Three</p>"]);
  });

  it("returns an empty list for blank input", () => {
    expect(splitBlogContentBlocks("   ")).toEqual([]);
  });
});

describe("joinBlogContentBlocks", () => {
  it("concatenates blocks for prose rendering", () => {
    expect(joinBlogContentBlocks(["<p>A</p>", "<p>B</p>"])).toBe("<p>A</p><p>B</p>");
  });
});
