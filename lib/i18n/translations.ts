export const translations = {
  "pt-BR": {
    // Common
    common: {
      home: "Início",
      settings: "Configurações",
    },

    // Home page
    home: {
      title: "WebTools - Utilitários Web Essenciais",
      description: "Uma coleção de ferramentas simples e poderosas para desenvolvedores e todos.",
      jsonFormatter: {
        title: "JSON Formatter",
        description: "Formate, valide e minifique dados JSON instantaneamente com nosso poderoso editor.",
        features: {
          prettyPrint: "Formatação com 2 espaços, 4 espaços ou tabs",
          minify: "Minifique JSON para uso em produção",
          validate: "Validação instantânea de sintaxe e detecção de erros",
        },
      },
      sharedNotes: {
        title: "Notas Compartilhadas",
        description: "Crie notas temporárias e compartilháveis com recursos de colaboração em tempo real.",
        features: {
          realtime: "Edição colaborativa em tempo real",
          expiration: "Temporizadores de expiração automática (1h, 24h, 7d)",
          readonly: "Modo somente leitura para compartilhamento seguro",
        },
      },
    },

    // JSON Formatter
    jsonFormatter: {
      title: "JSON Formatter",
      description: "Formate, valide e minifique dados JSON instantaneamente",
      input: "Entrada",
      output: "Saída",
      inputPlaceholder: "Cole seu JSON aqui...",
      outputPlaceholder: "A saída formatada aparecerá aqui...",
      actions: {
        format: "Formatar",
        minify: "Minificar",
        stringify: "Estringficar",
        unstringify: "Destringficar",
      },
      settings: {
        title: "Configurações de Formatação",
        description: "Configure como o JSON será formatado",
        indentation: "Indentação",
        indent2: "2 espaços",
        indent4: "4 espaços",
        indentTab: "Tab",
      },
      messages: {
        invalidJson: "JSON inválido",
        copiedToClipboard: "Copiado para a área de transferência",
        notStringified: "A entrada não é um JSON estringificado",
        invalidOrNotStringified: "JSON inválido ou não é um JSON estringificado",
      },
    },

    // Notes
    notes: {
      title: "Notas Compartilhadas",
      description: "Crie notas temporárias e compartilháveis com colaboração em tempo real",
      create: {
        title: "Criar Nova Nota",
        description: "Inicie uma nova nota compartilhada instantaneamente com configurações opcionais de colaboração e expiração.",
        noteTitle: "Título da Nota",
        noteTitlePlaceholder: "Digite o título da nota...",
        expiration: "Tempo de Expiração",
        expirationDescription: "A nota será automaticamente deletada após este período",
        collaborative: "Modo Colaborativo",
        collaborativeDescription: "Permitir que qualquer pessoa com o link edite esta nota em tempo real",
        expiration1h: "1 Hora",
        expiration24h: "24 Horas",
        expiration7d: "7 Dias",
        expirationNever: "Nunca Expira",
        createButton: "Criar Nota",
        creating: "Criando...",
      },
      access: {
        title: "Acessar Nota Existente",
        description: "Digite um ID de nota para visualizar ou editar uma nota compartilhada existente.",
        noteId: "ID da Nota",
        noteIdPlaceholder: "Digite o ID da nota...",
        noteIdHelp: "O ID da nota pode ser encontrado na URL de uma nota compartilhada",
        accessButton: "Acessar Nota",
      },
      editor: {
        note: "Nota",
        saving: "Salvando...",
        saved: "Salvo",
        readOnly: "Somente Leitura",
        copyLink: "Copiar Link",
        linkCopied: "Link copiado para a área de transferência!",
        startTyping: "Comece a digitar...",
        readOnlyPlaceholder: "Esta nota é somente leitura.",
        expired: "Nota Expirada",
        expiredDescription: "Esta nota não está mais disponível.",
        untitled: "Nota sem Título",
      },
      history: {
        title: "Notas Recentes",
        description: "Suas notas abertas recentemente",
        empty: "Nenhuma nota aberta recentemente",
        clearHistory: "Limpar Histórico",
      },
      messages: {
        createError: "Falha ao criar nota: ",
      },
    },
  },

  en: {
    // Common
    common: {
      home: "Home",
      settings: "Settings",
    },

    // Home page
    home: {
      title: "WebTools - Essential Web Utilities",
      description: "A collection of simple, powerful tools for developers and everyone else.",
      jsonFormatter: {
        title: "JSON Formatter",
        description: "Format, validate, and minify JSON data instantly with our powerful editor.",
        features: {
          prettyPrint: "Pretty print with 2 spaces, 4 spaces, or tabs",
          minify: "Minify JSON for production use",
          validate: "Instant syntax validation and error detection",
        },
      },
      sharedNotes: {
        title: "Shared Notes",
        description: "Create temporary, shareable notes with real-time collaboration capabilities.",
        features: {
          realtime: "Real-time collaborative editing",
          expiration: "Automatic expiration timers (1h, 24h, 7d)",
          readonly: "Read-only mode for secure sharing",
        },
      },
    },

    // JSON Formatter
    jsonFormatter: {
      title: "JSON Formatter",
      description: "Format, validate, and minify JSON data instantly",
      input: "Input",
      output: "Output",
      inputPlaceholder: "Paste your JSON here...",
      outputPlaceholder: "Formatted output will appear here...",
      actions: {
        format: "Format",
        minify: "Minify",
        stringify: "Stringify",
        unstringify: "Unstringify",
      },
      settings: {
        title: "Formatting Settings",
        description: "Configure how JSON will be formatted",
        indentation: "Indentation",
        indent2: "2 spaces",
        indent4: "4 spaces",
        indentTab: "Tab",
      },
      messages: {
        invalidJson: "Invalid JSON",
        copiedToClipboard: "Copied to clipboard",
        notStringified: "Input is not a stringified JSON",
        invalidOrNotStringified: "Invalid JSON or not a stringified JSON",
      },
    },

    // Notes
    notes: {
      title: "Shared Notes",
      description: "Create temporary, shareable notes with real-time collaboration",
      create: {
        title: "Create New Note",
        description: "Start a new shared note instantly with optional collaboration and expiration settings.",
        noteTitle: "Note Title",
        noteTitlePlaceholder: "Enter note title...",
        expiration: "Expiration Time",
        expirationDescription: "The note will be automatically deleted after this time period",
        collaborative: "Collaborative Mode",
        collaborativeDescription: "Allow anyone with the link to edit this note in real-time",
        expiration1h: "1 Hour",
        expiration24h: "24 Hours",
        expiration7d: "7 Days",
        expirationNever: "Never Expires",
        createButton: "Create Note",
        creating: "Creating...",
      },
      access: {
        title: "Access Existing Note",
        description: "Enter a note ID to view or edit an existing shared note.",
        noteId: "Note ID",
        noteIdPlaceholder: "Enter note ID...",
        noteIdHelp: "The note ID can be found in the URL of a shared note",
        accessButton: "Access Note",
      },
      editor: {
        note: "Note",
        saving: "Saving...",
        saved: "Saved",
        readOnly: "Read Only",
        copyLink: "Copy Link",
        linkCopied: "Link copied to clipboard!",
        startTyping: "Start typing...",
        readOnlyPlaceholder: "This note is read-only.",
        expired: "Note Expired",
        expiredDescription: "This note is no longer available.",
        untitled: "Untitled Note",
      },
      history: {
        title: "Recent Notes",
        description: "Your recently opened notes",
        empty: "No recently opened notes",
        clearHistory: "Clear History",
      },
      messages: {
        createError: "Failed to create note: ",
      },
    },
  },
} as const

export type Locale = keyof typeof translations
export type TranslationKeys = typeof translations["pt-BR"]
