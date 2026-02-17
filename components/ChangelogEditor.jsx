"use client";

import { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

/**
 * ChangelogEditor - A BlockNote-based rich text editor for changelog content
 */
export default function ChangelogEditor({ initialContent = [], onChange }) {
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const handleUpload = async (file) => {
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
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent.length > 0 ? initialContent : undefined,
    uploadFile: handleUpload,
  });

  useEffect(() => {
    if (!editor || !onChange) return;
    const handleChange = () => {
      const blocks = editor.document;
      onChange(blocks);
    };
    editor.onEditorContentChange(handleChange);
  }, [editor, onChange]);

  const editorTheme = useMemo(
    () => ({
      colors: {
        editor: {
          background: theme.neutral.white,
          text: theme.text.primary,
        },
        menu: {
          background: theme.neutral.white,
          text: theme.text.primary,
        },
        tooltip: {
          background: theme.neutral.white,
          text: theme.text.primary,
        },
        hovered: {
          background: theme.neutral.bg,
          text: theme.text.primary,
        },
        selected: {
          background: theme.neutral.muted,
          text: theme.text.primary,
        },
        disabled: {
          background: theme.neutral.bg,
          text: theme.text.tertiary,
        },
        shadow: theme.shadow.md,
        border: theme.neutral.border,
        sideMenu: theme.neutral.bg,
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
      borderRadius: 8,
      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    }),
    []
  );

  return (
    <div className="blocknote-editor-wrapper">
      <BlockNoteView
        editor={editor}
        theme={editorTheme}
        slashMenu={true}
        sideMenu={true}
      />
      
      <style jsx global>{`
        .blocknote-editor-wrapper {
          background: ${theme.neutral.white};
          border: 1px solid ${theme.neutral.border};
          border-radius: ${theme.radius.md};
          overflow: hidden;
        }

        .bn-container {
          background: ${theme.neutral.white} !important;
          color: ${theme.text.primary} !important;
        }

        .bn-editor {
          background: ${theme.neutral.white} !important;
          padding: 1.5rem !important;
          min-height: 400px;
        }

        .bn-block-content {
          color: ${theme.text.primary} !important;
        }

        .bn-block-content[data-content-type="paragraph"]:empty::before {
          color: ${theme.text.placeholder} !important;
        }

        .bn-block-content h1,
        .bn-block-content h2,
        .bn-block-content h3 {
          color: ${theme.text.primary} !important;
          font-weight: 600 !important;
        }

        .bn-block-content h1 {
          font-size: 2rem !important;
          line-height: 2.5rem !important;
          margin-top: 1rem !important;
          margin-bottom: 0.5rem !important;
        }

        .bn-block-content h2 {
          font-size: 1.5rem !important;
          line-height: 2rem !important;
          margin-top: 0.75rem !important;
          margin-bottom: 0.5rem !important;
        }

        .bn-block-content h3 {
          font-size: 1.25rem !important;
          line-height: 1.75rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
        }

        .bn-block-content ul,
        .bn-block-content ol {
          color: ${theme.text.primary} !important;
          padding-left: 1.5rem !important;
        }

        .bn-block-content li {
          color: ${theme.text.primary} !important;
          margin-bottom: 0.25rem !important;
        }

        .bn-slash-menu {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: ${theme.radius.md} !important;
          box-shadow: ${theme.shadow.lg} !important;
        }

        .bn-slash-menu-item {
          color: ${theme.text.primary} !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: ${theme.radius.sm} !important;
        }

        .bn-slash-menu-item:hover,
        .bn-slash-menu-item[data-hovered="true"] {
          background: ${theme.neutral.bg} !important;
        }

        .bn-slash-menu-item[data-selected="true"] {
          background: ${theme.neutral.muted} !important;
        }

        .bn-slash-menu-label {
          color: ${theme.text.primary} !important;
          font-weight: 500 !important;
        }

        .bn-slash-menu-hint {
          color: ${theme.text.tertiary} !important;
          font-size: 0.875rem !important;
        }

        .bn-side-menu {
          background: transparent !important;
        }

        .bn-drag-handle-button {
          background: ${theme.neutral.bg} !important;
          border: 1px solid ${theme.neutral.border} !important;
          color: ${theme.text.tertiary} !important;
          border-radius: 0.25rem !important;
        }

        .bn-drag-handle-button:hover {
          background: ${theme.neutral.muted} !important;
          color: ${theme.text.primary} !important;
        }

        .bn-block-outer[data-selected="true"] {
          background: ${theme.brand.primaryLight} !important;
        }

        .bn-formatting-toolbar {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: ${theme.radius.md} !important;
          box-shadow: ${theme.shadow.lg} !important;
        }

        .bn-toolbar-button {
          color: ${theme.text.primary} !important;
          border-radius: ${theme.radius.sm} !important;
        }

        .bn-toolbar-button:hover {
          background: ${theme.neutral.bg} !important;
        }

        .bn-toolbar-button[data-active="true"] {
          background: ${theme.neutral.muted} !important;
          color: ${theme.brand.primary} !important;
        }

        .bn-editor:focus-within {
          outline: none !important;
        }

        .bn-block-content img {
          max-width: 100%;
          height: auto;
          border-radius: ${theme.radius.md};
          margin: 0.5rem 0;
        }

        .bn-image-toolbar {
          background: ${theme.neutral.white} !important;
          border: 1px solid ${theme.neutral.border} !important;
          border-radius: ${theme.radius.md} !important;
        }

        .bn-image-toolbar button {
          color: ${theme.text.primary} !important;
        }

        .bn-image-toolbar button:hover {
          background: ${theme.neutral.bg} !important;
        }

        .bn-editor::-webkit-scrollbar {
          width: 8px;
        }

        .bn-editor::-webkit-scrollbar-track {
          background: ${theme.neutral.white};
        }

        .bn-editor::-webkit-scrollbar-thumb {
          background: ${theme.neutral.border};
          border-radius: 4px;
        }

        .bn-editor::-webkit-scrollbar-thumb:hover {
          background: ${theme.neutral.subtle};
        }
      `}</style>
    </div>
  );
}
