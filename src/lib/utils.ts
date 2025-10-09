import { TreeItem } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function - Tailwind classes ko merge karne ke liye
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a record of files to a tree structure.
 * @param files - Record of file paths to content
 * @returns Tree structure for TreeView component
 * @example
 * Input: { "src/Button.tsx": "...", "README.md": "..." }
 * Output: [{ name: "src", children: [{ name: "Button.tsx" }] }, { name: "README.md" }]
 */
export function convertFilesToTree(files: {
  [path: string]: string;
}): TreeItem[] {
  // TreeNode interface - Yeh nested object structure define karta hai
  // Har key ek folder/file name hai, value ya toh nested TreeNode hai ya null (agar file hai)
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  // Empty tree object se start karte hain - Yeh root folder hai
  const tree: TreeNode = {};

  // File paths ko alphabetically sort kar lete hain
  // Taaki tree structure organized rahe
  const sortedPath = Object.keys(files).sort();

  // Step 1: Har file path ko iterate karke tree structure banate hain
  for (const filePath of sortedPath) {
    // Path ko "/" se split karke parts mein tod dete hain
    // Example: "src/components/Button.tsx" → ["src", "components", "Button.tsx"]
    const parts = filePath.split("/");

    // Current pointer tree ke root se start hota hai
    let current = tree;

    // Har part (folder ya file) ko iterate karte hain
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      // Agar current location par yeh part exist nahi karta
      // Toh ek empty object (folder) bana dete hain
      if (!current[part]) {
        current[part] = {};
      }

      // Pointer ko ek level neeche move karte hain
      // Taaki next part ko iske andar add kar sakein
      current = current[part] as TreeNode;
    }

    // Last part (file name) ko null mark karte hain
    // Yeh indicate karta hai ki yeh ek file hai, folder nahi
    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  // Step 2: Tree object ko TreeItem array format mein convert karte hain
  // Yeh recursive function hai jo nested structure ko handle karta hai
  function convertNode(node: TreeNode, name?: string): TreeItem[] | TreeItem {
    // Object ki saari entries (key-value pairs) nikal lete hain
    const entries = Object.entries(node);

    // Agar koi entries nahi hain, matlab yeh ek file hai
    // Sirf file ka naam return kar dete hain
    if (entries.length === 0) {
      return name || "";
    }

    // Children array - Isme saare nested folders aur files store honge
    const children: TreeItem[] = [];

    // Har entry (folder ya file) ko process karte hain
    for (const [key, value] of entries) {
      if (value === null) {
        // Agar value null hai, toh yeh ek file hai
        // Sirf file name push karte hain
        children.push(key);
      } else {
        // Agar value object hai, toh yeh ek folder hai
        // Recursively iske andar ke items ko process karte hain
        const childNode = convertNode(value, key);

        if (Array.isArray(childNode)) {
          // Agar childNode array hai (nested folders/files)
          // Toh [folder_name, ...nested_items] format mein push karte hain
          children.push([key, ...childNode]);
        } else {
          // Agar childNode single item hai (file)
          // Toh [folder_name, file] format mein push karte hain
          children.push([key, childNode]);
        }
      }
    }

    // Children array return karte hain
    return children;
  }

  // Root tree ko convert karte hain aur result lete hain
  const result = convertNode(tree);

  // Ensure karte hain ki result hamesha array format mein ho
  // Agar single item hai toh usse array mein wrap kar dete hain
  return Array.isArray(result) ? result : [result];
}
