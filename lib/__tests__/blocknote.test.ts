/**
 * Tests for BlockNote serialization helpers
 */

import { describe, it, expect } from "vitest";
import {
  serializeBlocks,
  deserializeBlocks,
  isValidBlockNoteJSON,
  createEmptyDocument,
} from "../blocknote";
import type { Block } from "@blocknote/core";

describe("BlockNote Serialization Helpers", () => {
  describe("serializeBlocks", () => {
    it("should return blocks as-is", () => {
      const blocks: Block[] = [
        {
          id: "test-1",
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [{ type: "text", text: "Hello world", styles: {} }],
          children: [],
        },
      ] as Block[];

      const result = serializeBlocks(blocks);
      expect(result).toEqual(blocks);
    });

    it("should handle empty array", () => {
      const blocks: Block[] = [];
      const result = serializeBlocks(blocks);
      expect(result).toEqual([]);
    });
  });

  describe("deserializeBlocks", () => {
    it("should return valid blocks as-is", () => {
      const blocks: Block[] = [
        {
          id: "test-1",
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [],
          children: [],
        },
      ] as Block[];

      const result = deserializeBlocks(blocks);
      expect(result).toEqual(blocks);
    });

    it("should return empty array for invalid input", () => {
      const result = deserializeBlocks("not an array" as any);
      expect(result).toEqual([]);
    });

    it("should handle empty array", () => {
      const result = deserializeBlocks([]);
      expect(result).toEqual([]);
    });
  });

  describe("isValidBlockNoteJSON", () => {
    it("should return true for valid BlockNote JSON", () => {
      const blocks = [
        {
          id: "test-1",
          type: "paragraph",
          props: {},
          content: [],
          children: [],
        },
      ];

      expect(isValidBlockNoteJSON(blocks)).toBe(true);
    });

    it("should return false for non-array", () => {
      expect(isValidBlockNoteJSON("not an array")).toBe(false);
      expect(isValidBlockNoteJSON(null)).toBe(false);
      expect(isValidBlockNoteJSON(undefined)).toBe(false);
      expect(isValidBlockNoteJSON({})).toBe(false);
    });

    it("should return false for array with invalid blocks", () => {
      const invalidBlocks = [
        { id: "test-1" }, // missing type
        { type: "paragraph" }, // missing id
        { id: 123, type: "paragraph" }, // id is not a string
      ];

      expect(isValidBlockNoteJSON(invalidBlocks)).toBe(false);
    });

    it("should return true for empty array", () => {
      expect(isValidBlockNoteJSON([])).toBe(true);
    });
  });

  describe("createEmptyDocument", () => {
    it("should create a document with a single paragraph block", () => {
      const doc = createEmptyDocument();

      expect(Array.isArray(doc)).toBe(true);
      expect(doc.length).toBe(1);
      expect(doc[0].type).toBe("paragraph");
      expect(doc[0].id).toBeDefined();
      expect(typeof doc[0].id).toBe("string");
    });

    it("should create unique IDs for each call", () => {
      const doc1 = createEmptyDocument();
      const doc2 = createEmptyDocument();

      expect(doc1[0].id).not.toBe(doc2[0].id);
    });
  });

  describe("round-trip serialization", () => {
    it("should preserve data through serialize -> deserialize cycle", () => {
      const originalBlocks: Block[] = [
        {
          id: "block-1",
          type: "heading",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
            level: 1,
          },
          content: [{ type: "text", text: "Title", styles: {} }],
          children: [],
        },
        {
          id: "block-2",
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [
            { type: "text", text: "This is ", styles: {} },
            { type: "text", text: "bold", styles: { bold: true } },
            { type: "text", text: " text", styles: {} },
          ],
          children: [],
        },
      ] as Block[];

      const serialized = serializeBlocks(originalBlocks);
      const deserialized = deserializeBlocks(serialized);

      expect(deserialized).toEqual(originalBlocks);
    });
  });
});
