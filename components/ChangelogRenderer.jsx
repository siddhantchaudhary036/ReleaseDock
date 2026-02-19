"use client";

/**
 * ChangelogRenderer - Renders BlockNote JSON as read-only HTML
 * 
 * Requirements: 7.6, 11.4
 */

import React from "react";
import theme from "../constants/theme";

function renderBlock(block, index) {
  if (!block || !block.type) return null;

  const getTextContent = (block) => {
    if (!block.content || !Array.isArray(block.content)) return "";
    return block.content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item.type === "text" && item.text) return item.text;
        if (item.text) return item.text;
        return "";
      })
      .join("");
  };

  const renderInlineContent = (content) => {
    if (!content || !Array.isArray(content)) return null;
    return content.map((item, idx) => {
      if (typeof item === "string") return <span key={idx}>{item}</span>;
      if (item.type === "text") {
        let text = item.text || "";
        let element = <span key={idx}>{text}</span>;
        if (item.styles) {
          if (item.styles.bold) element = <strong key={idx}>{text}</strong>;
          if (item.styles.italic) element = <em key={idx}>{element}</em>;
          if (item.styles.underline) element = <span key={idx} style={{ textDecoration: "underline" }}>{element}</span>;
          if (item.styles.strike) element = <span key={idx} style={{ textDecoration: "line-through" }}>{element}</span>;
          if (item.styles.code) {
            element = (
              <code
                key={idx}
                style={{
                  backgroundColor: theme.neutral.bg,
                  color: theme.text.primary,
                  padding: "2px 6px",
                  borderRadius: theme.radius.sm,
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {text}
              </code>
            );
          }
        }
        return element;
      }
      return null;
    });
  };

  const textContent = getTextContent(block);
  const key = block.id || index;

  switch (block.type) {
    case "paragraph":
      return (
        <p key={key} style={{ marginBottom: "16px", color: theme.text.secondary, lineHeight: 1.6 }}>
          {block.content && block.content.length > 0 ? renderInlineContent(block.content) : "\u00A0"}
        </p>
      );

    case "heading": {
      const level = block.props?.level || 1;
      const HeadingTag = `h${level}`;
      const sizes = { 1: "30px", 2: "24px", 3: "20px" };
      const margins = { 1: "24px 0 16px", 2: "20px 0 12px", 3: "16px 0 8px" };
      return (
        <HeadingTag key={key} style={{ fontSize: sizes[level], fontWeight: 600, margin: margins[level], color: theme.text.primary }}>
          {renderInlineContent(block.content)}
        </HeadingTag>
      );
    }

    case "bulletListItem":
      return (
        <li key={key} style={{ marginBottom: "8px", color: theme.text.secondary, lineHeight: 1.6 }}>
          {renderInlineContent(block.content)}
          {block.children && block.children.length > 0 && (
            <ul style={{ listStyleType: "disc", paddingLeft: "24px", marginTop: "8px" }}>
              {block.children.map((child, idx) => renderBlock(child, idx))}
            </ul>
          )}
        </li>
      );

    case "numberedListItem":
      return (
        <li key={key} style={{ marginBottom: "8px", color: theme.text.secondary, lineHeight: 1.6 }}>
          {renderInlineContent(block.content)}
          {block.children && block.children.length > 0 && (
            <ol style={{ listStyleType: "decimal", paddingLeft: "24px", marginTop: "8px" }}>
              {block.children.map((child, idx) => renderBlock(child, idx))}
            </ol>
          )}
        </li>
      );

    case "image": {
      const imageUrl = block.props?.url || "";
      const caption = block.props?.caption || "";
      return (
        <figure key={key} style={{ margin: "24px 0" }}>
          <img src={imageUrl} alt={caption || "Changelog image"} style={{ borderRadius: theme.radius.lg, maxWidth: "100%", height: "auto" }} />
          {caption && (
            <figcaption style={{ fontSize: "14px", color: theme.text.tertiary, marginTop: "8px", textAlign: "center" }}>
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    default:
      return (
        <div key={key} style={{ marginBottom: "16px", color: theme.text.secondary }}>
          {textContent}
        </div>
      );
  }
}

function groupListItems(blocks) {
  const grouped = [];
  let currentList = null;
  let currentListType = null;

  blocks.forEach((block, index) => {
    if (block.type === "bulletListItem") {
      if (currentListType !== "bullet") {
        if (currentList) grouped.push(currentList);
        currentList = { type: "bulletList", items: [block], key: `list-${index}` };
        currentListType = "bullet";
      } else {
        currentList.items.push(block);
      }
    } else if (block.type === "numberedListItem") {
      if (currentListType !== "numbered") {
        if (currentList) grouped.push(currentList);
        currentList = { type: "numberedList", items: [block], key: `list-${index}` };
        currentListType = "numbered";
      } else {
        currentList.items.push(block);
      }
    } else {
      if (currentList) {
        grouped.push(currentList);
        currentList = null;
        currentListType = null;
      }
      grouped.push(block);
    }
  });

  if (currentList) grouped.push(currentList);
  return grouped;
}

export default function ChangelogRenderer({ content, className = "" }) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <div className={className} style={{ color: theme.text.tertiary, fontStyle: "italic" }}>
        No content available.
      </div>
    );
  }

  const groupedContent = groupListItems(content);

  return (
    <div className={`changelog-content ${className}`}>
      {groupedContent.map((item, index) => {
        if (item.type === "bulletList") {
          return (
            <ul key={item.key} style={{ listStyleType: "disc", paddingLeft: "24px", marginBottom: "16px" }}>
              {item.items.map((block, idx) => renderBlock(block, idx))}
            </ul>
          );
        } else if (item.type === "numberedList") {
          return (
            <ol key={item.key} style={{ listStyleType: "decimal", paddingLeft: "24px", marginBottom: "16px" }}>
              {item.items.map((block, idx) => renderBlock(block, idx))}
            </ol>
          );
        } else {
          return renderBlock(item, index);
        }
      })}

      <style jsx>{`
        .changelog-content {
          font-family: Inter, system-ui, -apple-system, sans-serif;
          line-height: 1.6;
        }
        .changelog-content a {
          color: ${theme.text.link};
          text-decoration: underline;
        }
        .changelog-content a:hover {
          color: ${theme.text.linkHover};
        }
        .changelog-content code {
          font-family: "Fira Code", "Courier New", monospace;
        }
        .changelog-content img {
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </div>
  );
}
