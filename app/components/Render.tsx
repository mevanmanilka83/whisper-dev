"use client";

import React from "react";

interface Node {
  type: string;
  content?: Node[];
  text?: string;
  attrs?: Record<string, any>;
  [key: string]: any;
}

export default function Render({ data }: { data: Node | null }) {
  if (!data) {
    return (
      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
        No content
      </div>
    );
  }

  const extractTextContent = (node: Node): string => {
    if (!node) return "";

    if (node.text) {
      return node.text;
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractTextContent).join(" ");
    }

    return "";
  };

  let textContent = "";
  try {
    textContent = extractTextContent(data);
  } catch (e) {
    console.error("Error rendering content:", e);
    return (
      <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
        Error displaying content
      </div>
    );
  }

  return (
    <div className="text-xs text-muted-foreground line-clamp-2 mb-2">
      {textContent}
    </div>
  );
}
