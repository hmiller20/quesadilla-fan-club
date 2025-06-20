'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { ImageIcon, Minus, Hash, Eye, Type, Superscript as SuperscriptIcon, Subscript as SubscriptIcon } from 'lucide-react'
import { TextMarks } from './extensions/TextMarks'
import ConfirmDialog from '@/components/ConfirmDialog'

type PostEditorProps = {
  initialContent: string
  initialTitle: string
  initialTeaser?: string
  postId: string
  slug: string
  isPublished: boolean
  onSave?: (title: string, teaser: string, content: string, isDraft: boolean) => Promise<void>;
  isSaving?: boolean;
}

const FONT_SIZES = [
  { label: 'Small', mark: 'textSmall' },
  { label: 'Normal', mark: '' },
  { label: 'Large', mark: 'textLarge' },
  { label: 'Extra Large', mark: 'textXLarge' }
]

const TEXT_COLORS = [
  { label: 'Black', mark: '' },
  { label: 'Blue', mark: 'textBlue' },
  { label: 'Green', mark: 'textGreen' },
  { label: 'Red', mark: 'textRed' },
  { label: 'Purple', mark: 'textPurple' }
]

export default function PostEditor({ 
  initialContent, 
  initialTitle,
  initialTeaser = '',
  postId,
  slug,
  isPublished,
  onSave,
  isSaving: isSavingProp
}: PostEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [teaser, setTeaser] = useState(initialTeaser)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const [currentFontSizeIndex, setCurrentFontSizeIndex] = useState(1) // Normal
  const [currentColorIndex, setCurrentColorIndex] = useState(0) // Black
  const [showConfirm, setShowConfirm] = useState(false)
  const [pendingPublishEvent, setPendingPublishEvent] = useState<React.FormEvent | null>(null)
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your post...',
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-green-700 underline hover:text-green-900 cursor-pointer relative group',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        protocols: ['http', 'https', 'mailto', 'tel'],
        validate: href => /^(https?:\/\/|mailto:|tel:)/.test(href),
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full rounded-lg',
        },
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: 'my-8 border-t border-gray-300',
        },
      }),
      Superscript,
      Subscript,
      TextMarks,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px]',
      },
    },
    onUpdate: ({ editor }) => {
      // Optionally, you could call a prop callback here if needed
    },
  })

  const savePost = async (shouldPublish: boolean, shouldShare: boolean = false) => {
    if (!editor) return
    if (onSave) {
      // Use parent-provided save handler (for new post)
      await onSave(title, teaser, editor.getHTML(), !shouldPublish)
      return
    }
    setIsSaving(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          teaser,
          content: editor.getHTML(),
          isPublished: shouldPublish,
          shouldShare,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save post')
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    await savePost(false)
  }

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      // Use parent-provided save handler (for new post)
      await savePost(true)
      return
    }
    // Show confirmation dialog first
    setPendingPublishEvent(e)
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setShowConfirm(false)
    // After confirming, show Share or Silent dialog
    const shouldShare = window.confirm(
      'Would you like to share this post with subscribers?\n\n' +
      'Click "OK" to share with subscribers\n' +
      'Click "Cancel" to publish silently'
    )
    await savePost(true, shouldShare)
    setPendingPublishEvent(null)
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setPendingPublishEvent(null)
  }

  const handleImageUpload = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        setIsUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Upload failed')
        }
        const data = await response.json()
        editor?.chain().focus().setImage({ src: data.url }).run()
      } catch (error) {
        console.error('Error uploading image:', error)
        alert(error instanceof Error ? error.message : 'Failed to upload image')
      } finally {
        setIsUploading(false)
      }
    }
    input.click()
  }

  const handleAddFootnote = () => {
    const content = window.prompt('Enter footnote content:')
    if (content && editor) {
      const footnoteId = `footnote-${Date.now()}`
      const footnoteHtml = `<sup><a href="#${footnoteId}" id="footnote-ref-${footnoteId}">[1]</a></sup><div id="${footnoteId}" class="footnote">${content}</div>`
      editor.commands.insertContent(footnoteHtml)
    }
  }

  const handleLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('Enter the URL:', previousUrl)
    
    // If no url is entered or user cancels, and there was no previous url, do nothing
    if (url === null) return
    
    // If url is empty, remove the link
    if (url === '') {
      editor?.chain().focus().unsetLink().run()
      return
    }
    
    // Add https:// if no protocol is specified
    let fullUrl = url
    if (!url.match(/^(https?:\/\/|mailto:|tel:)/)) {
      fullUrl = `https://${url}`
    }
    
    // Ensure the URL is absolute
    try {
      new URL(fullUrl) // This will throw if the URL is invalid
      editor?.chain().focus().setLink({ href: fullUrl }).run()
    } catch (e) {
      alert('Please enter a valid URL')
    }
  }

  const handlePreview = () => {
    if (!postId) {
      // For new posts, we need to save first
      if (!title.trim()) {
        alert('Please enter a title before previewing')
        return
      }
      // Save as draft first
      savePost(false).then(() => {
        // After saving, we'll get redirected to the edit page which has the postId
        // The user can then click preview again
      })
    } else {
      // For existing posts, open preview in new tab using the slug
      window.open(`/admin/posts/${slug}/preview`, '_blank')
    }
  }

  const handleFontSize = () => {
    const newIndex = (currentFontSizeIndex + 1) % FONT_SIZES.length
    setCurrentFontSizeIndex(newIndex)
    
    // Remove the mark if we're setting to normal
    if (!FONT_SIZES[newIndex].mark) {
      editor?.chain().focus().unsetMark('textMarks').run()
      return
    }
    
    // Set the new mark
    editor?.chain().focus()
      .setMark('textMarks', { 'data-type': FONT_SIZES[newIndex].mark })
      .run()
  }

  const handleTextColor = () => {
    const newIndex = (currentColorIndex + 1) % TEXT_COLORS.length
    setCurrentColorIndex(newIndex)
    
    // Remove the mark if we're setting to black
    if (!TEXT_COLORS[newIndex].mark) {
      editor?.chain().focus().unsetMark('textMarks').run()
      return
    }
    
    // Set the new mark
    editor?.chain().focus()
      .setMark('textMarks', { 'data-type': TEXT_COLORS[newIndex].mark })
      .run()
  }

  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="teaser" className="block text-sm font-medium text-gray-700">
          Teaser (optional)
        </label>
        <input
          type="text"
          id="teaser"
          value={teaser}
          onChange={(e) => setTeaser(e.target.value)}
          placeholder="A brief teaser line that appears beneath the title"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <div className="border rounded-lg">
          <div className="border-b p-2 flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bold') ? 'bg-gray-100' : ''}`}
            >
              Bold
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('italic') ? 'bg-gray-100' : ''}`}
            >
              Italic
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('bulletList') ? 'bg-gray-100' : ''}`}
            >
              Bullet List
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('orderedList') ? 'bg-gray-100' : ''}`}
            >
              Numbered List
            </button>
            <button
              type="button"
              onClick={handleFontSize}
              className={`p-2 rounded hover:bg-gray-100 ${currentFontSizeIndex !== 1 ? 'bg-gray-100' : ''}`}
              title={`Current: ${FONT_SIZES[currentFontSizeIndex].label}`}
            >
              <Type className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleTextColor}
              className={`p-2 rounded hover:bg-gray-100`}
              title={`Current: ${TEXT_COLORS[currentColorIndex].label}`}
            >
              <Type className={`h-4 w-4 ${TEXT_COLORS[currentColorIndex].mark || ''}`} />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('superscript') ? 'bg-gray-100' : ''}`}
              title="Toggle superscript"
            >
              <SuperscriptIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleSubscript().run()}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('subscript') ? 'bg-gray-100' : ''}`}
              title="Toggle subscript"
            >
              <SubscriptIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleLink}
              className={`p-2 rounded hover:bg-gray-100 ${editor?.isActive('link') ? 'bg-gray-100' : ''}`}
              title="Add or edit link"
            >
              Link
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-100"
              title="Add horizontal rule"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleAddFootnote}
              className="p-2 rounded hover:bg-gray-100"
              title="Add footnote"
            >
              <Hash className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={isUploading}
              className={`p-2 rounded hover:bg-gray-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Upload Image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
          <EditorContent 
            editor={editor} 
            className="p-4 min-h-[500px] prose max-w-none [&_.footnote]:mt-8 [&_.footnote]:text-sm [&_.footnote]:text-gray-600 [&_.footnote]:border-t [&_.footnote]:border-gray-200 [&_.footnote]:pt-2 [&_sup_a]:no-underline [&_sup_a]:text-indigo-600 [&_sup_a]:hover:text-indigo-800" 
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handlePreview}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Eye className="h-4 w-4 inline-block mr-1" />
          Preview
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSavingProp !== undefined ? isSavingProp : isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isSavingProp !== undefined ? isSavingProp : isSaving) ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={(isSavingProp !== undefined ? isSavingProp : isSaving) || isPublished}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(isSavingProp !== undefined ? isSavingProp : isSaving) ? 'Publishing...' : 'Publish'}
        </button>
      </div>
      <ConfirmDialog
        open={showConfirm}
        message="Are you sure you want to publish?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </form>
  )
} 