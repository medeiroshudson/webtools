import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { StructuredData, generateFAQSchema } from "./structured-data"

export interface FAQItem {
    question: string
    answer: string
}

interface FAQSectionProps {
    faqs: FAQItem[]
    title?: string
    className?: string
}

/**
 * FAQ Section component with collapsible items and structured data
 * Includes FAQPage schema markup for SEO
 */
export function FAQSection({ faqs, title = "Perguntas Frequentes", className = "" }: FAQSectionProps) {
    const [openItems, setOpenItems] = useState<Set<number>>(new Set())

    const toggleItem = (index: number) => {
        const newOpenItems = new Set(openItems)
        if (newOpenItems.has(index)) {
            newOpenItems.delete(index)
        } else {
            newOpenItems.add(index)
        }
        setOpenItems(newOpenItems)
    }

    return (
        <>
            <StructuredData data={generateFAQSchema(faqs)} />
            <div className={`w-full max-w-3xl mx-auto ${className}`}>
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
                <div className="space-y-3">
                    {faqs.map((faq, index) => {
                        const isOpen = openItems.has(index)
                        return (
                            <details
                                key={index}
                                open={isOpen}
                                onToggle={() => toggleItem(index)}
                                className="group rounded-lg border border-border bg-card"
                            >
                                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium select-none">
                                    <span>{faq.question}</span>
                                    {isOpen ? (
                                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </summary>
                                <div className="px-4 pb-4 text-muted-foreground">
                                    {faq.answer}
                                </div>
                            </details>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

/**
 * FAQ data for JSON Formatter
 */
export const jsonFormatterFAQs: FAQItem[] = [
    {
        question: "O que é JSON Formatter?",
        answer: "JSON Formatter é uma ferramenta online gratuita que permite formatar, validar e minificar dados JSON instantaneamente. A ferramenta processa tudo localmente no seu navegador, garantindo privacidade e segurança.",
    },
    {
        question: "Como formatar JSON?",
        answer: "Basta colar o código JSON na área de entrada e clicar no botão 'Formatar'. Você pode escolher entre indentação de 2 espaços, 4 espaços ou tabulação.",
    },
    {
        question: "Como validar JSON?",
        answer: "A validação é automática. Ao colar ou digitar JSON na área de entrada, a ferramenta irá detectar e destacar erros de sintaxe em tempo real.",
    },
    {
        question: "É seguro usar esta ferramenta?",
        answer: "Sim! Todo o processamento acontece localmente no seu navegador. Seus dados nunca são enviados para servidores externos.",
    },
]

/**
 * FAQ data for XML Formatter
 */
export const xmlFormatterFAQs: FAQItem[] = [
    {
        question: "O que é XML Formatter?",
        answer: "XML Formatter é uma ferramenta online gratuita para formatar, validar, minificar e converter dados XML para JSON. Processa tudo localmente no seu navegador.",
    },
    {
        question: "Como converter XML para JSON?",
        answer: "Cole o código XML na área de entrada e clique no botão 'Converter para JSON'. O resultado será exibido na área de saída.",
    },
    {
        question: "Como remover a declaração XML?",
        answer: "Ative a opção 'Remover declaração XML' nas configurações antes de formatar. Isso removerá a tag <?xml ...?> do resultado.",
    },
    {
        question: "A ferramenta suporta namespaces XML?",
        answer: "Sim, a ferramenta suporta XML com namespaces e preserva todos os atributos e estrutura do documento original.",
    },
]

/**
 * FAQ data for Notes
 */
export const notesFAQs: FAQItem[] = [
    {
        question: "O que são Notas Compartilhadas?",
        answer: "Notas Compartilhadas é uma ferramenta para criar notas temporárias que podem ser compartilhadas via link. Suporta colaboração em tempo real e expiração automática.",
    },
    {
        question: "Como funciona a expiração das notas?",
        answer: "Você pode configurar a nota para expirar em 1 hora, 24 horas, 7 dias ou nunca expirar. Após a expiração, a nota é automaticamente deletada.",
    },
    {
        question: "O que é modo colaborativo?",
        answer: "No modo colaborativo, qualquer pessoa com o link da nota pode editá-la em tempo real. Todas as alterações são sincronizadas instantaneamente entre todos os usuários.",
    },
    {
        question: "As notas são seguras?",
        answer: "Sim! O conteúdo das notas é criptografado e apenas pessoas com o link podem acessá-las. Notas individuais não são indexadas por mecanismos de busca.",
    },
]

/**
 * FAQ data for PDF Tools
 */
export const pdfToolsFAQs: FAQItem[] = [
    {
        question: "É seguro processar PDFs nesta ferramenta?",
        answer: "Absolutamente! Todo o processamento acontece localmente no seu navegador. Seus arquivos PDF nunca são enviados para servidores externos.",
    },
    {
        question: "Como juntar múltiplos PDFs?",
        answer: "Selecione os arquivos PDF, arraste para reordenar as páginas se necessário, e clique em 'Download' para obter o PDF combinado.",
    },
    {
        question: "Como dividir um PDF?",
        answer: "Selecione um PDF e defina os intervalos de páginas desejados (ex: 1-5, 8, 10-15). Você pode baixar os arquivos individualmente ou como um único ZIP.",
    },
    {
        question: "Quanto posso comprimir um PDF?",
        answer: "O nível de compressão depende do conteúdo do PDF. Em média, é possível reduzir o tamanho em 20-60% mantendo boa qualidade de visualização.",
    },
]

/**
 * FAQ data for Base64 Tools
 */
export const base64ToolsFAQs: FAQItem[] = [
    {
        question: "O que é Base64?",
        answer: "Base64 é um esquema de codificação que converte dados binários em texto ASCII. É comumente usado para transmitir dados através de redes que suportam apenas texto.",
    },
    {
        question: "Como converter uma imagem para Base64?",
        answer: "Selecione a aba 'Base64 ↔ Imagem', carregue uma imagem e clique em 'Codificar'. O código Base64 será gerado instantaneamente.",
    },
    {
        question: "Posso converter PDF para Base64?",
        answer: "Sim! Use a aba 'Base64 ↔ PDF' para converter arquivos PDF para Base64. Isso é útil para embutir PDFs em páginas HTML.",
    },
    {
        question: "Existe limite de tamanho para arquivos?",
        answer: "Para melhor performance, recomendamos arquivos de até 10MB. Arquivos maiores podem causar lentidão no navegador.",
    },
]
