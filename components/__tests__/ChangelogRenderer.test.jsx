/**
 * Tests for ChangelogRenderer component
 */

import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ChangelogRenderer from "../ChangelogRenderer";

describe("ChangelogRenderer", () => {
  it("should render empty state for no content", () => {
    const { container } = render(<ChangelogRenderer content={[]} />);
    expect(container.textContent).toContain("No content available");
  });

  it("should render empty state for null content", () => {
    const { container } = render(<ChangelogRenderer content={null} />);
    expect(container.textContent).toContain("No content available");
  });

  it("should render a paragraph block", () => {
    const content = [
      {
        id: "block-1",
        type: "paragraph",
        content: [{ type: "text", text: "Hello world" }],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    expect(container.textContent).toContain("Hello world");
  });

  it("should render heading blocks", () => {
    const content = [
      {
        id: "block-1",
        type: "heading",
        props: { level: 1 },
        content: [{ type: "text", text: "Main Title" }],
      },
      {
        id: "block-2",
        type: "heading",
        props: { level: 2 },
        content: [{ type: "text", text: "Subtitle" }],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    expect(container.querySelector("h1")).toBeTruthy();
    expect(container.querySelector("h2")).toBeTruthy();
    expect(container.textContent).toContain("Main Title");
    expect(container.textContent).toContain("Subtitle");
  });

  it("should render bullet list items", () => {
    const content = [
      {
        id: "block-1",
        type: "bulletListItem",
        content: [{ type: "text", text: "First item" }],
      },
      {
        id: "block-2",
        type: "bulletListItem",
        content: [{ type: "text", text: "Second item" }],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    const list = container.querySelector("ul");
    expect(list).toBeTruthy();
    expect(list.querySelectorAll("li").length).toBe(2);
    expect(container.textContent).toContain("First item");
    expect(container.textContent).toContain("Second item");
  });

  it("should render numbered list items", () => {
    const content = [
      {
        id: "block-1",
        type: "numberedListItem",
        content: [{ type: "text", text: "Step 1" }],
      },
      {
        id: "block-2",
        type: "numberedListItem",
        content: [{ type: "text", text: "Step 2" }],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    const list = container.querySelector("ol");
    expect(list).toBeTruthy();
    expect(list.querySelectorAll("li").length).toBe(2);
    expect(container.textContent).toContain("Step 1");
    expect(container.textContent).toContain("Step 2");
  });

  it("should render image blocks", () => {
    const content = [
      {
        id: "block-1",
        type: "image",
        props: {
          url: "https://example.com/image.jpg",
          caption: "Test image",
        },
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img.src).toBe("https://example.com/image.jpg");
    expect(img.alt).toBe("Test image");
    expect(container.textContent).toContain("Test image");
  });

  it("should render inline styles", () => {
    const content = [
      {
        id: "block-1",
        type: "paragraph",
        content: [
          { type: "text", text: "Normal " },
          { type: "text", text: "bold", styles: { bold: true } },
          { type: "text", text: " and " },
          { type: "text", text: "italic", styles: { italic: true } },
        ],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    expect(container.querySelector("strong")).toBeTruthy();
    expect(container.querySelector("em")).toBeTruthy();
    expect(container.textContent).toContain("Normal bold and italic");
  });

  it("should apply custom className", () => {
    const content = [
      {
        id: "block-1",
        type: "paragraph",
        content: [{ type: "text", text: "Test" }],
      },
    ];

    const { container } = render(
      <ChangelogRenderer content={content} className="custom-class" />
    );
    expect(container.querySelector(".custom-class")).toBeTruthy();
  });

  it("should preserve all text content from BlockNote JSON", () => {
    const content = [
      {
        id: "block-1",
        type: "heading",
        props: { level: 1 },
        content: [{ type: "text", text: "Release v2.0" }],
      },
      {
        id: "block-2",
        type: "paragraph",
        content: [
          { type: "text", text: "We're excited to announce " },
          { type: "text", text: "new features", styles: { bold: true } },
          { type: "text", text: " in this release." },
        ],
      },
      {
        id: "block-3",
        type: "bulletListItem",
        content: [{ type: "text", text: "Feature A" }],
      },
      {
        id: "block-4",
        type: "bulletListItem",
        content: [{ type: "text", text: "Feature B" }],
      },
    ];

    const { container } = render(<ChangelogRenderer content={content} />);
    const text = container.textContent;

    // Verify all text content is present
    expect(text).toContain("Release v2.0");
    expect(text).toContain("We're excited to announce");
    expect(text).toContain("new features");
    expect(text).toContain("in this release");
    expect(text).toContain("Feature A");
    expect(text).toContain("Feature B");
  });
});
