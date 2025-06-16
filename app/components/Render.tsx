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
      <div className="text-xs text-muted-foreground mb-2">
        No content
      </div>
    );
  }

  const jsonData = typeof data === 'string' ? JSON.parse(data) : data;

  const renderNode = (node: Node, index: number): React.ReactNode => {
    if (!node) return null;

    if (node.text) {
      let content = node.text;
      let element = <span key={index}>{content}</span>;

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

    const children =
      node.content?.map((childNode, childIndex) =>
        renderNode(childNode, childIndex)
      ) || [];

    const textAlign = node.attrs?.textAlign;
    
    const style: React.CSSProperties = {};
    if (textAlign) {
      style.textAlign = textAlign;
    }
    
    switch (node.type) {
      case "doc":
        return <div key={index}>{children}</div>;
      case "paragraph":
        return (
          <p 
            key={index} 
            style={style}
            className="mb-1"
          >
            {children}
          </p>
        );
      case "heading":
        const level = node.attrs?.level || 1;
        
        let headingClass = "";
        switch (level) {
          case 1:
            headingClass = "text-2xl font-bold mb-3 mt-4";
            break;
          case 2:
            headingClass = "text-xl font-semibold mb-2 mt-3";
            break;
          case 3:
            headingClass = "text-lg font-medium mb-2 mt-2";
            break;
          default:
            headingClass = "text-base font-medium mb-1 mt-1";
        }
        
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            style={style}
            className={headingClass}
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

  return (
    <>
      <style jsx global>{`
        .text-content p[style*="text-align: center"],
        .text-content h1[style*="text-align: center"],
        .text-content h2[style*="text-align: center"],
        .text-content h3[style*="text-align: center"] {
          text-align: center !important;
        }
        .text-content p[style*="text-align: right"],
        .text-content h1[style*="text-align: right"],
        .text-content h2[style*="text-align: right"],
        .text-content h3[style*="text-align: right"] {
          text-align: right !important;
        }
        .text-content p[style*="text-align: left"],
        .text-content h1[style*="text-align: left"],
        .text-content h2[style*="text-align: left"],
        .text-content h3[style*="text-align: left"] {
          text-align: left !important;
        }
        .text-content p[style*="text-align: justify"],
        .text-content h1[style*="text-align: justify"],
        .text-content h2[style*="text-align: justify"],
        .text-content h3[style*="text-align: justify"] {
          text-align: justify !important;
        }
      `}</style>
      <div className="prose prose-sm dark:prose-invert max-w-none text-content">
        {renderNode(jsonData, 0)}
      </div>
    </>
  );
}
