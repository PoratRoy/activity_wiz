"use client";

import { CharacterCount } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, List, ListOrdered, Underline } from "lucide-react";
import { useRef, useState } from "react";
import viewStyles from "@/components/ActivityView/ActivityView.module.css";
import { TITLE_MAX } from "@/lib/draft";
import styles from "./ActivityEditor.module.css";

export const BODY_TEXT_LIMIT = 6000;

/** Edit mode: title input + Tiptap body (bold, underline, lists), reading and writing Markdown. */
export default function ActivityEditor({
  title,
  bodyMd,
  onChange,
  belowTitle,
}: {
  title: string;
  bodyMd: string;
  onChange: (next: { title: string; bodyMd: string }) => void;
  belowTitle?: React.ReactNode;
}) {
  // Tiptap keeps the first onUpdate closure, so read the latest title through a ref.
  const titleRef = useRef(title);
  titleRef.current = title;
  // CharacterCount silently rejects an insert that would pass the limit; show why.
  const [blocked, setBlocked] = useState(false);
  const blockedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flagBlocked = () => {
    setBlocked(true);
    if (blockedTimer.current) clearTimeout(blockedTimer.current);
    blockedTimer.current = setTimeout(() => setBlocked(false), 3000);
  };
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
        code: false,
        codeBlock: false,
        blockquote: false,
        strike: false,
        horizontalRule: false,
      }),
      Markdown,
      CharacterCount.configure({ limit: BODY_TEXT_LIMIT }),
    ],
    content: bodyMd,
    contentType: "markdown",
    editorProps: {
      attributes: { class: `${viewStyles.body} ${styles.content}`, dir: "rtl", "data-reading": "" },
      handleTextInput: (view, _from, _to, text) => {
        if (view.state.doc.textContent.length + text.length > BODY_TEXT_LIMIT) flagBlocked();
        return false;
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? "";
        if (view.state.doc.textContent.length + text.length > BODY_TEXT_LIMIT) flagBlocked();
        return false;
      },
    },
    onUpdate: ({ editor }) => onChange({ title: titleRef.current, bodyMd: editor.getMarkdown() }),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor && {
        bold: editor.isActive("bold"),
        underline: editor.isActive("underline"),
        bullet: editor.isActive("bulletList"),
        ordered: editor.isActive("orderedList"),
        atLimit: editor.storage.characterCount.characters() >= BODY_TEXT_LIMIT,
      },
  });

  const tool = (label: string, icon: React.ReactNode, active: boolean | undefined, run: () => void) => (
    <button
      type="button"
      className={`${styles.tool} ${active ? styles.toolActive : ""}`}
      aria-label={label}
      aria-pressed={!!active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
    >
      {icon}
    </button>
  );

  return (
    <div className={styles.wrap}>
      <input
        className={styles.title}
        value={title}
        maxLength={TITLE_MAX}
        aria-label="כותרת"
        onChange={(e) => onChange({ title: e.target.value, bodyMd: editor?.getMarkdown() ?? bodyMd })}
      />
      {belowTitle}
      <div className={styles.toolbar} role="toolbar" aria-label="עיצוב טקסט">
        {tool("מודגש", <Bold size={20} />, state?.bold, () => editor?.chain().focus().toggleBold().run())}
        {tool("קו תחתון", <Underline size={20} />, state?.underline, () => editor?.chain().focus().toggleUnderline().run())}
        {tool("רשימה", <List size={20} />, state?.bullet, () => editor?.chain().focus().toggleBulletList().run())}
        {tool("רשימה ממוספרת", <ListOrdered size={20} />, state?.ordered, () => editor?.chain().focus().toggleOrderedList().run())}
      </div>
      <EditorContent editor={editor} />
      {(state?.atLimit || blocked) && <p className={styles.limit}>הגעתם למגבלת {BODY_TEXT_LIMIT} התווים</p>}
    </div>
  );
}
