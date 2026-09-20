import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'
import { normalizeImageUrl } from '../utils/imageUrl'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  token: string
}

export default function RichTextEditor({ value, onChange, token }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },

  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>')
    }
  }, [value, editor])

  useEffect(() => {
    if (!editor) return

    const handleImageFile = async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post('/media/upload', formData, token, true) as { url: string }
        if (response.url) {
          const imageUrl = normalizeImageUrl(response.url)
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }
      } catch (err) {
        console.error('Failed to upload pasted image', err)
      }
    }

    const handlePaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData
      if (!clipboardData) return

      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          const file = clipboardData.files[i]
          if (file.type.startsWith('image/')) {
            event.preventDefault()
            handleImageFile(file)
            return
          }
        }
      }

      const items = clipboardData.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file) {
              handleImageFile(file)
            }
            return
          }
        }

        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type === 'text/html') {
            item.getAsString((html: string) => {
              const imgMatch = html.match(/<img[^>]+src="(data:image[^"]+)"/)
              if (imgMatch) {
                const base64Data = imgMatch[1]
                const byteString = atob(base64Data.split(',')[1])
                const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
                const ab = new ArrayBuffer(byteString.length)
                const ia = new Uint8Array(ab)
                for (let j = 0; j < byteString.length; j++) {
                  ia[j] = byteString.charCodeAt(j)
                }
                const blob = new Blob([ab], { type: mimeString })
                const file = new File([blob], `paste_${Date.now()}.png`, { type: mimeString })
                handleImageFile(file)
              }
            })
            return
          }
        }
      }
    }

    const editableElement = editor.view.dom
    editableElement.addEventListener('paste', handlePaste)

    return () => {
      editableElement.removeEventListener('paste', handlePaste)
    }
  }, [editor, token])

  const handleInsertLink = () => {
    if (!editor) return
    const selectedText = editor.getText()
    setLinkText(selectedText || '')
    setLinkUrl('')
    setShowLinkModal(true)
  }

  const handleApplyLink = () => {
    if (!editor || !linkUrl) return
    let url = linkUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url
    }
    const text = linkText.trim() || url
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).insertContent(text).run()
    setShowLinkModal(false)
    setLinkUrl('')
    setLinkText('')
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file || !editor) return

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post('/media/upload', formData, token, true) as { url: string }
        if (response.url) {
          const imageUrl = normalizeImageUrl(response.url)
          editor.chain().focus().setImage({ src: imageUrl }).run()
        }
      } catch (err) {
        console.error('Failed to upload image', err)
      }
    }
    input.click()
  }

  if (!editor) {
    return null
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
      <div 
        style={{ 
          display: 'flex', 
          gap: '4px', 
          padding: '8px', 
          background: 'var(--bg-gray)',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap'
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontStyle: 'italic',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          U
        </button>
        <button
          type="button"
          onClick={handleInsertLink}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          🔗 链接
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().extendMarkRange('link').unsetLink().run()}
          disabled={!editor?.isActive('link')}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)',
            opacity: editor?.isActive('link') ? 1 : 0.5
          }}
        >
          ✕ 取消链接
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-lg)',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-base)',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            fontWeight: '700',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          H3
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          ☰
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          "
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          {'<>'}
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <button
          type="button"
          onClick={handleImageUpload}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--primary)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: '#fff',
            fontWeight: '600',
            transition: 'var(--transition)'
          }}
        >
          📷 上传图片
        </button>
        <div style={{ width: '1px', background: 'var(--border)', margin: '4px 0' }} />
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          style={{ 
            padding: '6px 12px', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-white)', 
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            transition: 'var(--transition)'
          }}
        >
          ⟲ 清除格式
        </button>
      </div>
      <div style={{ padding: '16px', minHeight: '300px', background: 'var(--bg-white)' }}>
        <EditorContent 
          editor={editor} 
          style={{ 
            outline: 'none',
            fontSize: 'var(--text-base)',
            lineHeight: '1.8',
            color: 'var(--text-primary)'
          }}
        />
      </div>
      
      {showLinkModal && (
        <div 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          <div 
            style={{ 
              background: 'var(--bg-white)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '24px', 
              width: '100%', 
              maxWidth: '400px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '20px' }}>插入链接</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>链接地址</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>显示文字</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                  placeholder="链接显示的文字"
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-white)',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-sm)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  disabled={!linkUrl.trim()}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary)',
                    color: '#fff',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    opacity: linkUrl.trim() ? 1 : 0.5
                  }}
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}