import { GoogleGenAI, Type, Modality } from "@google/genai";

// WARNING: Storing API keys directly in the code is not secure for production.
// This is done here for demonstration purposes in this specific environment.
const API_KEY = "AIzaSyAvy1ldiuJj7H7fUZL_CgK1Kfoau73385A";

if (!API_KEY) {
    throw new Error("API_KEY is not set. Please add your Gemini API key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
6.  **Inserção de Imagens:** Para tornar o artigo visualmente atraente e quebrar longos blocos de texto, insira estrategicamente de 2 a 3 marcadores de posição para geração de imagens no formato \`[!--GENERATE_IMAGE(Um prompt descritivo aqui)--!]\`.
    *   Coloque-os após seções importantes ou parágrafos que se beneficiariam de um auxílio visual.
    *   O texto dentro dos parênteses deve ser um prompt detalhado e vívido para uma IA de geração de imagem. Exemplo: \`[!--GENERATE_IMAGE(Uma visão macro de um chip de computador com trilhas de luz neon simbolizando o fluxo de dados)--!]\`

**Formato de Saída:** Sua resposta inteira DEVE seguir este formato exato, usando os separadores especificados. Não inclua nenhum outro texto, explicação ou formatação markdown ao redor dos separadores.

<--TITLE_START-->
[Seu título gerado aqui]
<--TITLE_END-->

<--DECK_START-->
[Seu subtítulo gerado aqui]
<--DECK_END-->

<--CONTENT_START-->
[Seu conteúdo gerado em Markdown aqui, com pelo menos 600 palavras e os marcadores de imagem]
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
        let content = extractContent(responseText, '<--CONTENT_START-->', '<--CONTENT_END-->');

        // Process in-article images
        const imagePlaceholders = content.match(/\[!--GENERATE_IMAGE\((.*?)\)--!\]/g) || [];
        if (imagePlaceholders.length > 0) {
            const imagePrompts = imagePlaceholders.map(placeholder => {
                const match = placeholder.match(/\[!--GENERATE_IMAGE\((.*?)\)--!\]/);
                return match ? match[1] : '';
            }).filter(prompt => prompt);

            if (imagePrompts.length > 0) {
                const imageUrls = await Promise.all(
                    imagePrompts.map(prompt => generateBlogImage(prompt, prompt)) // Pass prompt as seed
                );

                imagePlaceholders.forEach((placeholder, index) => {
                    const imageUrl = imageUrls[index];
                    // Use a snippet of the prompt for alt text for better accessibility
                    const altText = imagePrompts[index].substring(0, 150).replace(/"/g, "'"); 
                    if (imageUrl) {
                        content = content.replace(placeholder, `\n\n![${altText}](${imageUrl})\n\n`);
                    } else {
                        content = content.replace(placeholder, ''); // Remove placeholder if image fails
                    }
                });
            }
        }
        
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

export const generateBlogImage = async (prompt: string, seed?: string): Promise<string> => {
    try {
        const imagePrompt = prompt.startsWith('Crie uma imagem') ? prompt : `Crie uma imagem de capa profissional e de alta qualidade para um post de blog sobre '${prompt}'. O estilo deve ser uma ilustração digital fotorrealista com uma estética moderna e limpa. A imagem deve ser visualmente atraente, relevante para o tema do post e adequada para uma publicação online popular sobre fatos interessantes e curiosidades. Evite texto na imagem. A composição deve ser equilibrada e chamativa.`;
        
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
        // Return a placeholder if image generation fails, using seed for consistency
        return `https://picsum.photos/seed/${encodeURIComponent(seed || prompt)}/1200/800`;
    }
};

export const generateThemeSuggestions = async (): Promise<string[]> => {
    try {
        const prompt = `Aja como um editor criativo para o blog "Curiozando", que foca em curiosidades e fatos interessantes.
Gere uma lista de 5 títulos de artigos de blog que sejam cativantes, que despertem curiosidade e sejam otimizados para SEO.
Os tópicos devem variar entre ciência, história, mistérios e fatos do mundo.
Retorne a resposta como um array JSON de strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: 'Um título de post de blog sugerido.',
                    },
                },
            },
        });

        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr);

        if (!Array.isArray(suggestions) || !suggestions.every(s => typeof s === 'string')) {
            throw new Error("API response is not a valid array of strings.");
        }

        return suggestions;

    } catch (error) {
        console.error("Error generating theme suggestions:", error);
        throw new Error("Não foi possível gerar sugestões de temas. Tente novamente.");
    }
};