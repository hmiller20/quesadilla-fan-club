import { Mark, mergeAttributes } from '@tiptap/core'

export const TextMarks = Mark.create({
  name: 'textMarks',

  addAttributes() {
    return {
      'data-type': {
        default: null,
        parseHTML: element => element.getAttribute('data-type'),
        renderHTML: attributes => {
          if (!attributes['data-type']) {
            return {}
          }

          return {
            'data-type': attributes['data-type'],
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'mark[data-type]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0]
  },
}) 