"use client"

import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
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
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

import { Badge } from "@/components/ui/badge"

export const Menubar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  const formatOptions = [
    {
      icon: <Bold className="h-4 w-4" />,
      onClick: () => { editor.chain().focus().toggleBold().run(); return true; },
      pressed: editor.isActive("bold"),
      tooltip: "Bold",
      shortcut: "⌘B",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      onClick: () => { editor.chain().focus().toggleItalic().run(); return true; },
      pressed: editor.isActive("italic"),
      tooltip: "Italic",
      shortcut: "⌘I",
    },
    {
      icon: <Strikethrough className="h-4 w-4" />,
      onClick: () => { editor.chain().focus().toggleStrike().run(); return true; },
      pressed: editor.isActive("strike"),
      tooltip: "Strikethrough",
      shortcut: "⌘⇧X",
    },
    {
      icon: <Highlighter className="h-4 w-4" />,
      onClick: () => { editor.chain().focus().toggleHighlight().run(); return true; },
      pressed: editor.isActive("highlight"),
      tooltip: "Highlight",
      shortcut: "⌘⇧H",
    },
  ]

  const headingOptions = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 1 })) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        return true;
      },
      pressed: editor.isActive("heading", { level: 1 }),
      tooltip: "Heading 1",
      shortcut: "⌘⌥1",
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 2 })) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        return true;
      },
      pressed: editor.isActive("heading", { level: 2 }),
      tooltip: "Heading 2",
      shortcut: "⌘⌥2",
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("heading", { level: 3 })) {
          editor.chain().focus().setParagraph().run()
        } else {
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        return true;
      },
      pressed: editor.isActive("heading", { level: 3 }),
      tooltip: "Heading 3",
      shortcut: "⌘⌥3",
    },
  ]

  const alignmentOptions = [
    {
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "left" })) {
          editor.chain().focus().unsetTextAlign().run()
        } else {
          editor.chain().focus().setTextAlign("left").run()
        }
        return true;
      },
      pressed: editor.isActive({ textAlign: "left" }),
      tooltip: "Align Left",
      shortcut: "⌘⇧L",
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "center" })) {
          editor.chain().focus().unsetTextAlign().run()
        } else {
          editor.chain().focus().setTextAlign("center").run()
        }
        return true;
      },
      pressed: editor.isActive({ textAlign: "center" }),
      tooltip: "Align Center",
      shortcut: "⌘⇧E",
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive({ textAlign: "right" })) {
          editor.chain().focus().unsetTextAlign().run()
        } else {
          editor.chain().focus().setTextAlign("right").run()
        }
        return true;
      },
      pressed: editor.isActive({ textAlign: "right" }),
      tooltip: "Align Right",
      shortcut: "⌘⇧R",
    },
  ]

  const listOptions = [
    {
      icon: <List className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("bulletList")) {
          editor.chain().focus().liftListItem("listItem").run()
        } else {
          editor.chain().focus().toggleBulletList().run()
        }
        return true;
      },
      pressed: editor.isActive("bulletList"),
      tooltip: "Bullet List",
      shortcut: "⌘⇧8",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      onClick: () => {
        if (editor.isActive("orderedList")) {
          editor.chain().focus().liftListItem("listItem").run()
        } else {
          editor.chain().focus().toggleOrderedList().run()
        }
        return true;
      },
      pressed: editor.isActive("orderedList"),
      tooltip: "Numbered List",
      shortcut: "⌘⇧7",
    },
  ]

  const ToolbarGroup = ({ options, label }: { options: typeof formatOptions; label: string }) => (
    <div className="flex items-center gap-1">
      <div className="hidden sm:block">
        <Badge variant="secondary" className="text-xs px-2 py-1 mr-2 bg-muted/50">
          {label}
        </Badge>
      </div>
      <div className="flex gap-1">
        {options.map((option, index) => (
          <Toggle
            key={index}
            pressed={option.pressed}
            onPressedChange={() => { option.onClick(); return true; }}
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 data-[state=on]:bg-primary/10 data-[state=on]:text-primary data-[state=on]:border-primary/20 hover:bg-accent/50 transition-all duration-200 rounded-lg"
            title={`${option.tooltip} (${option.shortcut})`}
            aria-label={option.tooltip}
          >
            {option.icon}
          </Toggle>
        ))}
      </div>
    </div>
  )

  return (
  
      <div className="flex flex-wrap items-center gap-3">
        <ToolbarGroup options={formatOptions} label="Format" />
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <ToolbarGroup options={headingOptions} label="Headings" />
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <ToolbarGroup options={alignmentOptions} label="Align" />
        <Separator orientation="vertical" className="h-6 hidden sm:block" />
        <ToolbarGroup options={listOptions} label="Lists" />
      </div>
  
  )
}

const EditorComponent = ({
  setJson,
  json,
}: {
  setJson: (json: JSONContent) => void
  json: JSONContent | null
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
    content: json ?? "<p>Start writing your content here...</p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[250px] rounded-lg border-0 bg-transparent px-4 py-4 focus-visible:outline-none prose prose-sm dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      setJson(json)
    },
  })

  return (
    <div className="w-full space-y-4">
  

      {/* Toolbar */}
      <Menubar editor={editor} />

      {/* Editor */}
      <div className="shadow-sm overflow-hidden rounded-lg">
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
        />
      </div>

      

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          padding: 1rem;
          min-height: 250px;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror h1 {
          font-size: 2rem;
          line-height: 2.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }
        .ProseMirror h2 {
          font-size: 1.75rem;
          line-height: 2.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.875rem;
          color: hsl(var(--foreground));
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          line-height: 2rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--foreground));
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 2rem;
          margin: 1rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 2rem;
          margin: 1rem 0;
        }
        .ProseMirror li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .ProseMirror p {
          margin: 1rem 0;
          line-height: 1.7;
          color: hsl(var(--foreground));
        }
        .ProseMirror p:first-child {
          margin-top: 0;
        }
        .ProseMirror p:last-child {
          margin-bottom: 0;
        }
        .ProseMirror mark {
          background-color: hsl(var(--primary) / 0.2);
          color: hsl(var(--primary-foreground));
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .ProseMirror strong {
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror s {
          text-decoration: line-through;
          opacity: 0.7;
        }
        .ProseMirror [data-text-align="left"] {
          text-align: left;
        }
        .ProseMirror [data-text-align="center"] {
          text-align: center;
        }
        .ProseMirror [data-text-align="right"] {
          text-align: right;
        }
        .ProseMirror::placeholder {
          color: hsl(var(--muted-foreground));
          opacity: 0.6;
        }
      `}</style>
    </div>
  )
}

export default EditorComponent
