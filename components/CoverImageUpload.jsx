"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import theme from "../constants/theme";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

/**
 * Cover image uploader for changelog entries.
 * Uploads to Convex storage and returns the storageId.
 */
export default function CoverImageUpload({ coverImageId, onCoverImageChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const deleteFile = useMutation(api.storage.deleteFile);

  // Resolve the current cover image URL
  const coverImageUrl = useQuery(
    api.storage.getStorageUrl,
    coverImageId ? { storageId: coverImageId } : "skip"
  );

  const uploadFile = async (file) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setIsUploading(true);
    try {
      // Remove old cover image if replacing
      if (coverImageId) {
        try { await deleteFile({ storageId: coverImageId }); } catch {}
      }

      const uploadUrl = await generateUploadUrl();
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      const { storageId } = await response.json();
      onCoverImageChange(storageId);
    } catch (error) {
      console.error("Cover image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (coverImageId) {
      try { await deleteFile({ storageId: coverImageId }); } catch {}
    }
    onCoverImageChange(undefined);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // Show the uploaded image
  if (coverImageId && coverImageUrl) {
    return (
      <div className="cover-image-wrapper" style={{ position: "relative", marginBottom: 20 }}>
        <img
          src={coverImageUrl}
          alt="Cover"
          style={{
            width: "100%",
            maxHeight: 280,
            objectFit: "cover",
            borderRadius: theme.radius.lg,
            display: "block",
          }}
        />
        <div
          className="cover-image-actions"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 4,
          }}
        >
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              padding: "4px 10px",
              borderRadius: theme.radius.md,
              border: "none",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            Replace
          </button>
          <button
            onClick={handleRemove}
            disabled={isUploading}
            style={{
              padding: "4px 10px",
              borderRadius: theme.radius.md,
              border: "none",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            Remove
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        <style>{`
          .cover-image-actions { opacity: 0; transition: opacity 0.15s; }
          .cover-image-wrapper:hover .cover-image-actions { opacity: 1; }
        `}</style>
      </div>
    );
  }

  // Show the upload zone
  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        disabled={isUploading}
        className="cover-upload-btn"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: theme.radius.lg,
          border: `1.5px dashed ${dragOver ? theme.brand.primary : theme.neutral.border}`,
          backgroundColor: dragOver ? theme.brand.primaryLight : "transparent",
          color: theme.text.tertiary,
          fontSize: 12,
          cursor: isUploading ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          transition: "all 0.15s",
        }}
      >
        {isUploading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: theme.text.tertiary, borderTopColor: "transparent" }} />
            Uploading…
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
            Add cover image
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <style>{`
        .cover-upload-btn:hover:not(:disabled) {
          border-color: ${theme.neutral.subtle} !important;
          background-color: ${theme.neutral.hover} !important;
        }
      `}</style>
    </div>
  );
}
