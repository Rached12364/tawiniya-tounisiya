import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, List, ListOrdered, Heading2 } from 'lucide-react';
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}
export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[160px] px-3 py-2 text-sm text-navy focus:outline-none [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  if (!editor) return null;
  const btnClass = (active: boolean) =>
    `p-1.5 rounded transition-colors ${
      active ? 'bg-navy/10 text-navy' : 'text-navy/40 hover:text-navy hover:bg-navy/5'
    }`;
  return (
    <div className="w-full rounded-lg border border-navy/15 overflow-hidden">
      <div className="flex items-center gap-1 border-b border-navy/10 bg-navy/[0.02] px-2 py-1.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Gras"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Titre"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Liste à puces"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive('orderedList'))}
          title="Liste numérotée"
        >
          <ListOrdered size={15} />
        </button>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}