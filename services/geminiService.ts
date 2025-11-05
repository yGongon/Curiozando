

import { GoogleGenAI, Type, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GeneratedContent {
    title: string;
    deck: string; // The subtitle
    content: string; // Markdown
    sources: Array<{ title: string; uri: string; }>;
}


/**
 * Extracts content from a string between a start and end tag.
 * @param text The text to search within.
 * @param startTag The starting tag.
 * @param endTag The ending tag.
 * @returns The extracted content.
 */
function extractContent(text: string, startTag: string, endTag: string): string {
    const startIndex = text.indexOf(startTag);
    const endIndex = text.indexOf(endTag, startIndex);
    if (startIndex === -1 || endIndex === -1) {
        throw new Error(`Could not find content between ${startTag} and ${endTag}`);
    }
    return text.substring(startIndex + startTag.length, endIndex).trim();
}


export const generateBlogPostContent = async (theme: string): Promise<GeneratedContent> => {
    try {
        const prompt = `Aja como um editor sênior e redator de uma publicação online de prestígio como The New York Times, WIRED ou National Geographic. Seu público é inteligente, curioso e espera conteúdo de alta qualidade e bem pesquisado.
Sua missão é escrever um artigo de destaque cativante e confiável sobre o tema: '${theme}' para o blog "Curiozando".

**Instrução Principal: O artigo DEVE ser escrito inteiramente em português do Brasil.**

**Instruções Essenciais:**

1.  **Pesquisa e Síntese:** Realize uma pesquisa aprofundada usando o Google Search. Sintetize informações de várias fontes de alta autoridade (acadêmicas, jornalísticas, de especialistas) para construir uma narrativa abrangente e detalhada. Não liste apenas fatos; transforme-os em uma história convincente.
2.  **Título e Subtítulo (Deck):**
    *   **Título:** Crie um título poderoso e que desperte a curiosidade. Deve ser envolvente e otimizado para SEO.
    *   **Subtítulo:** Crie um subtítulo de uma frase que expanda o título e atraia o leitor.
3.  **Estrutura e Fluxo do Artigo:**
    *   **Introdução:** Comece com um 'gancho' forte – um fato surpreendente, uma anedota com a qual o leitor se identifique ou uma pergunta instigante para prender a atenção imediatamente.
    *   **Corpo:** Desenvolva o artigo com um fluxo lógico. Use cabeçalhos Markdown H2 para seções principais e H3 para subtópicos. Garanta transições suaves entre os parágrafos. Cada seção deve explorar uma faceta diferente do tópico, apoiada por sua pesquisa.
    *   **Conclusão:** Forneça um resumo conciso dos pontos principais e termine com uma declaração instigante ou um olhar para o futuro, deixando uma impressão duradoura.
4.  **Estilo de Escrita:** Escreva em um estilo narrativo claro, envolvente e sofisticado, semelhante a um artigo de destaque em uma grande publicação. Use linguagem vívida e técnicas de contar histórias. Mantenha um tom objetivo e jornalístico.
5.  **SEO:** Incorpore palavras-chave relevantes naturalmente, mas priorize a legibilidade e o engajamento humano acima de tudo. O tom deve parecer confiável e de autoridade.

**Formato de Saída:** Sua resposta inteira DEVE seguir este formato exato, usando os separadores especificados. Não inclua nenhum outro texto, explicação ou formatação markdown ao redor dos separadores.

<--TITLE_START-->
[Seu título gerado aqui]
<--TITLE_END-->

<--DECK_START-->
[Seu subtítulo gerado aqui]
<--DECK_END-->

<--CONTENT_START-->
[Seu conteúdo gerado em Markdown aqui, com pelo menos 600 palavras]
<--CONTENT_END-->`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{googleSearch: {}}],
            },
        });
        
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const sources = groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string; } => !!web?.uri)
            .map(web => ({ uri: web.uri, title: web.title || 'Untitled' })) ?? [];
        
        const responseText = response.text;

        const title = extractContent(responseText, '<--TITLE_START-->', '<--TITLE_END-->');
        const deck = extractContent(responseText, '<--DECK_START-->', '<--DECK_END-->');
        const content = extractContent(responseText, '<--CONTENT_START-->', '<--CONTENT_END-->');
        
        return {
            title,
            deck,
            content,
            sources,
        };

    } catch (error) {
        console.error("Error generating blog post content:", error);
        if (error instanceof Error && error.message.includes('Could not find content')) {
            throw new Error("Failed to generate blog content. The AI response was not in the expected format. Please try again.");
        }
        throw new Error("Failed to generate blog content. An unexpected error occurred. Please try again.");
    }
};

export const generateBlogImage = async (title: string): Promise<string> => {
    try {
        const imagePrompt = `Crie uma imagem de capa profissional e de alta qualidade para um post de blog intitulado '${title}'. O estilo deve ser uma ilustração digital fotorrealista com uma estética moderna e limpa. A imagem deve ser visualmente atraente, relevante para o tema do post e adequada para uma publicação online popular sobre fatos interessantes e curiosidades. Evite texto na imagem. A composição deve ser equilibrada и chamativa.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: imagePrompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image was generated by the API.");
    } catch (error) {
        console.error("Error generating blog image:", error);
        // Return a placeholder if image generation fails
        return `https://picsum.photos/seed/${encodeURIComponent(title)}/1200/800`;
    }
};