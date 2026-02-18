"use client";

import { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

/**
 * ChangelogEditor — Notion-style rich text editor for changelog content.
 * Borderless, minimal chrome, content-first design.
 */
export default function ChangelogEditor({ initialContent = [], onChange }) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const handleUpload = async (file) => {
    // Block video uploads to save bandwidth — videos should be embedded via URL
    if (file.type.startsWith("video/")) {
      throw new Error("Video uploads are not supported. Please embed videos using a URL instead.");
    }

    try {
      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json();
      return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : undefined,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (!editor || !onChange) return;
    const handleChange = () => onChange(editor.document);
    editor.onEditorContentChange(handleChange);
  }, [editor, onChange]);

  const editorTheme = useMemo(
    () => ({
      colors: {
        editor: { background: "transparent", text: theme.text.primary },
        menu: { background: theme.neutral.white, text: theme.text.primary },
        tooltip: { background: theme.neutral.white, text: theme.text.primary },
        hovered: { background: theme.neutral.hover, text: theme.text.primary },
        selected: { background: theme.neutral.muted, text: theme.text.primary },
        disabled: { background: theme.neutral.bg, text: theme.text.tertiary },
        shadow: theme.shadow.md,
        border: theme.neutral.border,
        sideMenu: "transparent",
        highlightColors: {
          gray: { background: theme.neutral.muted, text: theme.text.primary },
          brown: { background: theme.decorative.brownLight, text: theme.decorative.brown },
          red: { background: theme.status.errorLight, text: theme.status.error },
          orange: { background: theme.decorative.orangeLight, text: theme.decorative.orangeDark },
          yellow: { background: theme.status.warningLight, text: theme.decorative.yellowDark },
          green: { background: theme.status.successLight, text: theme.status.success },
          blue: { background: theme.brand.primaryMuted, text: theme.brand.primary },
          purple: { background: theme.decorative.purpleLight, text: theme.decorative.purple },
          pink: { background: theme.decorative.pinkLight, text: theme.decorative.pink },
        },
      },
      borderRadius: 6,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    }),
    []
  );

  return (
    <div className="rd-editor">
      <BlockNoteView
        editor={editor}
        theme={editorTheme}
        slashMenu={true}
        sideMenu={true}
      />

      <style jsx global>{`
        /* ── Wrapper: borderless, content-first ── */
        .rd-editor {
          position: relative;
        }

        /* ── Core editor area ── */
        .rd-editor .bn-container {
          background: transparent !important;
          font-size: 15px !important;
        }

        .rd-editor .bn-editor {
          background: transparent !important;
          padding: 0 !important;
          min-height: 320px;
          line-height: 1.65;
        }

        /* ── Typography ── */
        .rd-editor .bn-block-content {
          color: ${theme.text.secondary} !important;
          font-size: 15px !important;
        }

        .rd-editor .bn-block-content[data-content-type="paragraph"] {
          padding: 3px 0 !important;
        }

        .rd-editor .bn-inline-content::before {
          color: ${theme.text.placeholder} !important;
          font-style: normal !important;
        }

        .rd-editor .bn-block-content h1,
        .rd-editor .bn-block-content h2,
        .rd-editor .bn-block-content h3 {
          color: ${theme.text.primary} !important;
          font-weight: 600 !important;
          letter-spacing: -0.01em;
        }

        .rd-editor .bn-block-content h1 {
          font-size: 1.75rem !important;
          line-height: 2.15rem !important;
          margin-top: 1.25rem !important;
          margin-bottom: 0.25rem !important;
        }

        .rd-editor .bn-block-content h2 {
          font-size: 1.35rem !important;
          line-height: 1.8rem !important;
          margin-top: 1rem !important;
          margin-bottom: 0.2rem !important;
        }

        .rd-editor .bn-block-content h3 {
          font-size: 1.1rem !important;
          line-height: 1.5rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.15rem !important;
        }

        /* ── Lists ── */
        .rd-editor .bn-block-content ul,
        .rd-editor .bn-block-content ol {
          color: ${theme.text.secondary} !important;
          padding-left: 1.25rem !important;
        }

        .rd-editor .bn-block-content li {
          color: ${theme.text.secondary} !important;
          margin-bottom: 2px !important;
        }

        /* ── Side menu (drag handle + add button) ── */
        .rd-editor .bn-side-menu {
          background: transparent !important;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .rd-editor .bn-block-outer:hover .bn-side-menu,
        .rd-editor .bn-side-menu:hover {
          opacity: 1;
        }

        .rd-editor .bn-drag-handle-button,
        .rd-editor .bn-add-block-button {
          background: transparent !important;
          border: none !important;
          color: ${theme.text.tertiary} !important;
          border-radius: 4px !important;
          width: 20px !important;
          height: 20px !important;
          padding: 0 !important;
        }

        .rd-editor .bn-drag-handle-button:hover,
        .rd-editor .bn-add-block-button:hover {
          background: ${theme.neutral.hover} !important;
          color: ${theme.text.muted} !important;
        }

        /* ── Slash menu ── */
        .bn-slash-menu,
        .bn-suggestion-menu {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04) !important;
          padding: 4px !important;
          max-height: 320px !important;
          overflow-y: auto !important;
        }

        .bn-slash-menu-item,
        .bn-suggestion-menu-item {
          color: ${theme.text.primary} !important;
          padding: 6px 10px !important;
          border-radius: 5px !important;
          font-size: 13px !important;
          gap: 10px !important;
        }

        .bn-slash-menu-item:hover,
        .bn-slash-menu-item[data-hovered="true"],
        .bn-suggestion-menu-item:hover,
        .bn-suggestion-menu-item[data-hovered="true"] {
          background: ${theme.neutral.hover} !important;
        }

        .bn-slash-menu-item[data-selected="true"],
        .bn-suggestion-menu-item[data-selected="true"] {
          background: ${theme.brand.primaryLight} !important;
        }

        .bn-slash-menu-label,
        .bn-suggestion-menu-label {
          color: ${theme.text.primary} !important;
          font-weight: 500 !important;
          font-size: 13px !important;
        }

        .bn-slash-menu-hint,
        .bn-suggestion-menu-hint {
          color: ${theme.text.tertiary} !important;
          font-size: 12px !important;
        }

        /* ── Formatting toolbar (floating) ── */
        .bn-formatting-toolbar {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04) !important;
          padding: 2px !important;
        }

        .bn-toolbar-button {
          color: ${theme.text.muted} !important;
          border-radius: 4px !important;
          width: 28px !important;
          height: 28px !important;
        }

        .bn-toolbar-button:hover {
          background: ${theme.neutral.hover} !important;
          color: ${theme.text.primary} !important;
        }

        .bn-toolbar-button[data-active="true"] {
          background: ${theme.brand.primaryLight} !important;
          color: ${theme.brand.primary} !important;
        }

        /* ── Block selection ── */
        .rd-editor .bn-block-outer[data-selected="true"] {
          background: ${theme.brand.primaryLight} !important;
          border-radius: 4px;
        }

        /* ── Focus state ── */
        .rd-editor .bn-editor:focus-within {
          outline: none !important;
        }

        /* ── Images ── */
        .rd-editor .bn-block-content img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 4px 0;
        }

        .bn-image-toolbar {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08) !important;
        }

        .bn-image-toolbar button {
          color: ${theme.text.muted} !important;
          font-size: 13px !important;
        }

        .bn-image-toolbar button:hover {
          background: ${theme.neutral.hover} !important;
          color: ${theme.text.primary} !important;
        }

        /* ── Code blocks ── */
        .rd-editor .bn-block-content code {
          background: ${theme.neutral.bg} !important;
          color: ${theme.text.primary} !important;
          padding: 2px 5px !important;
          border-radius: 4px !important;
          font-size: 13px !important;
          font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace !important;
        }

        /* ── Divider ── */
        .rd-editor hr,
        .rd-editor .bn-block-content[data-content-type="horizontalRule"] {
          border: none !important;
          border-top: 1px solid ${theme.neutral.border} !important;
          margin: 16px 0 !important;
        }

        /* ── Scrollbar ── */
        .rd-editor .bn-editor::-webkit-scrollbar {
          width: 4px;
        }
        .rd-editor .bn-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .rd-editor .bn-editor::-webkit-scrollbar-thumb {
          background: ${theme.neutral.border};
          border-radius: 2px;
        }
        .rd-editor .bn-editor::-webkit-scrollbar-thumb:hover {
          background: ${theme.neutral.subtle};
        }
      `}</style>
    </div>
  );
}
