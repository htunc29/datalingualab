"use client"
import { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useDraggable } from "@dnd-kit/core";

export default function PIS({bigData, setBigData}) {
  const editorRef = useRef(null);
  const idRef = useRef(`pis-${Math.floor(Math.random() * 9999)}`);
  
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: idRef.current,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  useEffect(() => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      setBigData(prev => {
        const filteredPrev = prev.filter(item => !item.type?.startsWith('pis-'));
        const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
        
        if (existingIndex !== -1) {
          filteredPrev[existingIndex] = {
            id: idRef.current,
            type: 'pis',
            content: content
          };
          return filteredPrev;
        } else if (content) {
          return [...filteredPrev, {
            id: idRef.current,
            type: 'pis',
            content: content
          }];
        }
        return filteredPrev;
      });
    }
  }, [editorRef.current?.getContent()]);

  return (
    <div ref={setNodeRef} style={style} className="p-6 w-full mx-auto bg-white rounded-xl shadow-lg">
      <div {...listeners} {...attributes} className="flex justify-end text-2xl cursor-pointer mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
      <Editor
        apiKey='t8n5f6jnof0estmoxsd4uf3zzyw6q42nuq28wtqnyyjbglcx'
        onInit={(_evt, editor) => editorRef.current = editor}
        onEditorChange={(content) => {
          setBigData(prev => {
            const filteredPrev = prev.filter(item => !item.type?.startsWith('pis-'));
            const existingIndex = filteredPrev.findIndex(item => item.id === idRef.current);
            
            if (existingIndex !== -1) {
              filteredPrev[existingIndex] = {
                id: idRef.current,
                type: 'pis',
                content: content
              };
              return filteredPrev;
            } else if (content) {
              return [...filteredPrev, {
                id: idRef.current,
                type: 'pis',
                content: content
              }];
            }
            return filteredPrev;
          });
        }}
        initialValue="<p>Buraya içerik yazabilirsiniz...</p>"
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </div>
  );
}