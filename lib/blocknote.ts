/**
 * BlockNote Serialization Helpers
 * 
 * Functions to serialize and deserialize BlockNote editor state.
 * BlockNote uses a JSON format where content is represented as an array of block objects.
 * 
 * Requirements: 7.5, 7.6, 11.1, 11.2, 11.4
 */

import type { Block } from "@blocknote/core";

/**
 * Serialize editor state to BlockNote JSON format
 * 
 * BlockNote's editor.document already returns the blocks in JSON format,
 * so this is essentially a pass-through function that ensures type safety
 * and provides a consistent API.
 * 
 * @param blocks - Array of BlockNote block objects from editor.document
 * @returns BlockNote JSON (array of blocks)
 */
export function serializeBlocks(blocks: Block[]): Block[] {
  // BlockNote blocks are already in JSON-serializable format
  // We just ensure they're properly typed and returned
  return blocks;
}

/**
 * Deserialize BlockNote JSON back to editor state
 * 
 * BlockNote's initialContent prop accepts blocks directly,
 * so this is a pass-through function that validates and returns the blocks.
 * 
 * @param json - BlockNote JSON (array of blocks)
 * @returns Array of BlockNote block objects ready for editor.initialContent
 */
export function deserializeBlocks(json: Block[]): Block[] {
  // Validate that we have an array
  if (!Array.isArray(json)) {
    console.warn("Invalid BlockNote JSON: expected array, got", typeof json);
    return [];
  }

  // Return the blocks as-is - BlockNote will handle validation
  return json;
}

/**
 * Validate that a value is valid BlockNote JSON
 * 
 * @param value - Value to validate
 * @returns true if the value is a valid BlockNote JSON array
 */
export function isValidBlockNoteJSON(value: unknown): value is Block[] {
  if (!Array.isArray(value)) {
    return false;
  }

  // Check that each item looks like a block (has an id and type)
  return value.every(
    (item) =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "type" in item &&
      typeof item.id === "string" &&
      typeof item.type === "string"
  );
}

/**
 * Create an empty BlockNote document
 * 
 * @returns An empty BlockNote document with a single paragraph block
 */
export function createEmptyDocument(): Block[] {
  return [
    {
      id: crypto.randomUUID(),
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
}
