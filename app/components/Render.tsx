"use client";

import React from "react";

interface Node {
  type: string;
  content?: Node[];
  text?: string;
  attrs?: Record<string, any>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, any>;
  }>;
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

  const renderNode = (node: Node, index: number): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.text) {
      let content = node.text;
      let element = <span key={index}>{content}</span>;

      // Apply marks (bold, italic, etc.) if present
      if (node.marks && node.marks.length > 0) {
        for (const mark of node.marks) {
          switch (mark.type) {
            case "bold":
              element = <strong key={index}>{element}</strong>;
              break;
            case "italic":
              element = <em key={index}>{element}</em>;
              break;
            case "strike":
              element = <s key={index}>{element}</s>;
              break;
            case "highlight":
              element = (
                <mark
                  key={index}
                  className="bg-yellow-100 dark:bg-yellow-800/50 px-0.5 rounded"
                >
                  {element}
                </mark>
              );
              break;
            default:
              break;
          }
        }
      }
      return element;
    }

    // Recursively render child content
    const children =
      node.content?.map((childNode, childIndex) =>
        renderNode(childNode, childIndex)
      ) || [];

    // Render different node types
    switch (node.type) {
      case "doc":
        return <div key={index}>{children}</div>;
      case "paragraph":
        const align = node.attrs?.textAlign || "left";
        return (
          <p key={index} style={{ textAlign: align }} className="mb-1">
            {children}
          </p>
        );
      case "heading":
        const level = node.attrs?.level || 1;
        const headingAlign = node.attrs?.textAlign || "left";
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            style={{ textAlign: headingAlign }}
            className="font-semibold"
          >
            {children}
          </HeadingTag>
        );
      case "bulletList":
        return (
          <ul key={index} className="list-disc ml-4">
            {children}
          </ul>
        );
      case "orderedList":
        return (
          <ol key={index} className="list-decimal ml-4">
            {children}
          </ol>
        );
      case "listItem":
        return <li key={index}>{children}</li>;
      default:
        return <span key={index}>{children}</span>;
    }
  };

  // In the rendered output, wrap in a container that preserves line clamp
  return (
    <div className="text-xs text-muted-foreground line-clamp-2 mb-2 prose prose-sm dark:prose-invert max-w-none">
      {renderNode(data, 0)}
    </div>
  );
}
