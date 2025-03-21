import {
  Command,
  Node,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'

export interface FigureOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands {
    figure: {
      /**
       * Add a figure element
       */
      setFigure: (options: {
        src: string,
        alt?: string,
        title?: string,
        caption?: string,
      }) => Command,
    }
  }
}

export const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/

export const Figure = Node.create<FigureOptions>({
  name: 'figure',

  defaultOptions: {
    // inline: false,
    HTMLAttributes: {},
  },

  group: 'block',

  content: 'inline*',

  draggable: true,

  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: element => {
          return {
            src: element.querySelector('img')?.getAttribute('src'),
          }
        },
      },
      alt: {
        default: null,
        parseHTML: element => {
          return {
            alt: element.querySelector('img')?.getAttribute('alt'),
          }
        },
      },
      title: {
        default: null,
        parseHTML: element => {
          return {
            title: element.querySelector('img')?.getAttribute('title'),
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure',
        contentElement: 'figcaption',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure', this.options.HTMLAttributes,
      ['img', mergeAttributes(HTMLAttributes, { draggable: false, contenteditable: false })],
      ['figcaption', 0],
    ]
  },

  addCommands() {
    return {
      setFigure: ({ caption, ...attrs }) => ({ chain }) => {
        return chain()
          .insertContent({
            type: this.name,
            attrs,
            content: [
              {
                type: 'text',
                text: caption,
              },
            ],
          })
          // try to set cursor within caption field
          // but this fails when inserting at an empty document
          // .command(({ tr, commands }) => {
          //   return commands.setTextSelection(tr.selection.$from.before() - 1)
          // })
          .run()
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule(inputRegex, this.type, match => {
        const [, alt, src, title] = match

        return { src, alt, title }
      }),
    ]
  },
})
