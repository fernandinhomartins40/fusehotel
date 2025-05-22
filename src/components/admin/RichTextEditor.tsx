
import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Label } from '@/components/ui/label';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Escreva seu conteúdo aqui...',
  className = '',
}: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean'],
      ['code-block'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'link', 'image',
    'align', 'color', 'background',
    'code-block',
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      <div className="border rounded-md">
        <ReactQuill 
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="min-h-[200px]"
        />
      </div>
      <div className="flex justify-end mt-2">
        <button 
          type="button" 
          onClick={() => {
            const htmlEditor = document.createElement('textarea');
            htmlEditor.value = value;
            htmlEditor.style.width = '100%';
            htmlEditor.style.height = '300px';
            
            // Create modal for HTML editing
            const modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '8px';
            modalContent.style.width = '80%';
            modalContent.style.maxWidth = '800px';
            
            const modalHeader = document.createElement('div');
            modalHeader.style.display = 'flex';
            modalHeader.style.justifyContent = 'space-between';
            modalHeader.style.alignItems = 'center';
            modalHeader.style.marginBottom = '15px';
            
            const modalTitle = document.createElement('h3');
            modalTitle.textContent = 'Editar HTML';
            modalTitle.style.margin = '0';
            modalTitle.style.fontSize = '18px';
            modalTitle.style.fontWeight = 'bold';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = '✕';
            closeButton.style.background = 'none';
            closeButton.style.border = 'none';
            closeButton.style.fontSize = '20px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => document.body.removeChild(modal);
            
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Salvar Alterações';
            saveButton.style.padding = '8px 16px';
            saveButton.style.backgroundColor = '#0466C8';
            saveButton.style.color = 'white';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '4px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.marginTop = '15px';
            saveButton.style.marginLeft = 'auto';
            saveButton.style.display = 'block';
            saveButton.onclick = () => {
              onChange(htmlEditor.value);
              document.body.removeChild(modal);
            };
            
            modalHeader.appendChild(modalTitle);
            modalHeader.appendChild(closeButton);
            
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(htmlEditor);
            modalContent.appendChild(saveButton);
            
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
          }}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          Editar HTML
        </button>
      </div>
    </div>
  );
}
