import  {  EditorContent, useEditor} from "@tiptap/react"
import type { JSONContent } from "@tiptap/react";
import type { FC } from "react"
import StarterKit from '@tiptap/starter-kit'
import type { Json } from "../../superbase/superbase";
interface Props {
    content : JSONContent | Json;
}
export const ProductDescription:FC<Props> = ({ content }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content : content as JSONContent,
    editable: false,
    editorProps:{
        attributes: {
            class: 'prose prose-sm  sm:prose-base max-w-none'
        }
    }
  });
  return (
    <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8 underline">
            Descripcion 
        </h2>
        <EditorContent editor={editor} />
    </div>
  )
}
