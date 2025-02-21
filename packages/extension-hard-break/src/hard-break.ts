import { Command, Node, mergeAttributes } from '@tiptap/core'

export interface HardBreakOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands {
    hardBreak: {
      /**
       * Add a hard break
       */
      setHardBreak: () => Command,
    }
  }
}

export const HardBreak = Node.create<HardBreakOptions>({
  name: 'hardBreak',

  defaultOptions: {
    HTMLAttributes: {},
  },

  inline: true,

  group: 'inline',

  selectable: false,

  parseHTML() {
    return [
      { tag: 'br' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['br', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setHardBreak: () => ({ commands }) => {
        return commands.first([
          () => commands.exitCode(),
          () => commands.insertContent({ type: this.name }),
        ])
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => this.editor.commands.setHardBreak(),
      'Shift-Enter': () => this.editor.commands.setHardBreak(),
    }
  },
})
