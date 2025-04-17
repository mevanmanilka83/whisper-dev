"use client";

import {
  useEditor,
  EditorContent,
  type Editor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

export const Menubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const formatOptions = [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
      tooltip: "Bold",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
      tooltip: "Italic",
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
      tooltip: "Strikethrough",
    },
    {
      icon: <Highlighter className="h-4 w-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
      tooltip: "Highlight",
    },
  ];

  const headingOptions = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 1 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }
      },
      pressed: editor.isActive("heading", { level: 1 }),
      tooltip: "Heading 1",
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 2 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }
      },
      pressed: editor.isActive("heading", { level: 2 }),
      tooltip: "Heading 2",
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 3 })) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }
      },
      pressed: editor.isActive("heading", { level: 3 }),
      tooltip: "Heading 3",
    },
  ];

  const alignmentOptions = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "left" })) {
          editor.chain().focus().unsetTextAlign().run();
        } else {
          editor.chain().focus().setTextAlign("left").run();
        }
      },
      pressed: editor.isActive({ textAlign: "left" }),
      tooltip: "Align Left",
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "center" })) {
          editor.chain().focus().unsetTextAlign().run();
        } else {
          editor.chain().focus().setTextAlign("center").run();
        }
      },
      pressed: editor.isActive({ textAlign: "center" }),
      tooltip: "Align Center",
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "right" })) {
          editor.chain().focus().unsetTextAlign().run();
        } else {
          editor.chain().focus().setTextAlign("right").run();
        }
      },
      pressed: editor.isActive({ textAlign: "right" }),
      tooltip: "Align Right",
    },
  ];

  const listOptions = [
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("bulletList")) {
          editor.chain().focus().liftListItem("listItem").run();
        } else {
          editor.chain().focus().toggleBulletList().run();
        }
      },
      pressed: editor.isActive("bulletList"),
      tooltip: "Bullet List",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("orderedList")) {
          editor.chain().focus().liftListItem("listItem").run();
        } else {
          editor.chain().focus().toggleOrderedList().run();
        }
      },
      pressed: editor.isActive("orderedList"),
      tooltip: "Numbered List",
    },
  ];

  return (
    <div className="rounded-md p-1 flex flex-wrap items-center gap-1">
      <div className="flex gap-1">
        {formatOptions.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            title={option.tooltip}
            aria-label={option.tooltip}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex gap-1">
        {headingOptions.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            title={option.tooltip}
            aria-label={option.tooltip}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex gap-1">
        {alignmentOptions.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            title={option.tooltip}
            aria-label={option.tooltip}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex gap-1">
        {listOptions.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={option.onClick}
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            title={option.tooltip}
            aria-label={option.tooltip}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
    </div>
  );
};

const EditorComponent = ({
  setJson,
  json,
}: {
  setJson: (json: JSONContent) => void;
  json: JSONContent | null;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Highlight,
    ],
    content: json ?? "<p>Write your content here...</p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] rounded-md border border-input bg-transparent px-4 py-3 mt-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setJson(json);
    },
  });

  return (
    <div className="w-full space-y-2 mb-4">
      <Menubar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none"
      />
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          line-height: 2.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          line-height: 1.75rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.75rem;
          margin: 0.75rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.75rem;
          margin: 0.75rem 0;
        }
        .ProseMirror li {
          margin-bottom: 0.375rem;
        }
        .ProseMirror p {
          margin: 0.75rem 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default EditorComponent;
