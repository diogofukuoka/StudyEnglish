import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const PORT = 3000;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não configurada no servidor.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // 1. Generate a cohesive sentence incorporating ALL words of the selected NGSL group
  app.post('/api/gemini/full-sentence', async (req, res) => {
    try {
      const { groupNumber, words, level } = req.body as {
        groupNumber: number;
        words: Array<{ lemma: string; pos: string; pt: string }>;
        level: 'simples' | 'intermediario' | 'avancado';
      };

      if (!words || !Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ error: 'Lista de palavras do grupo é obrigatória.' });
      }

      const ai = getAiClient();
      const wordListStr = words.map((w) => `"${w.lemma}" (${w.pos}: ${w.pt})`).join(', ');

      const levelDescription =
        level === 'simples'
          ? 'Nível Simples (Iniciante A1/A2): estrutura direta, vocabulário acessível e fácil compreensão.'
          : level === 'intermediario'
          ? 'Nível Intermediário (B1/B2): estrutura natural do cotidiano, fluidez conversacional e riqueza contextual.'
          : 'Nível Avançado (C1/C2): estrutura sofisticada, vocabulário preciso, tom editorial ou acadêmico.';

      const prompt = `Você é um professor especialista em ensino de inglês com base na lista NGSL 1.2.
Crie UMA única frase coerente, natural e gramaticalmente correta em inglês que utilize TODAS as seguintes palavras do Grupo ${groupNumber}:
${wordListStr}

Nível de dificuldade solicitado: ${levelDescription}

Regras obrigatórias:
1. Você DEVE incluir todas as ${words.length} palavras da lista na mesma frase (você pode usar a forma base/lema ou uma flexão mínima caso estritamente necessário para a gramática, mas dê preferência absoluta à forma exata do lema).
2. Forneça a frase completa em inglês ("sentence"), a tradução natural completa para o português do Brasil ("translationPt"), uma breve nota explicativa sobre a estrutura e o contexto ("contextNote"), e um array "tokens" contendo CADA palavra da frase gerada na ordem exata, com sua tradução específica para o português neste contexto ("pt"), sua classe gramatical ("pos"), o lema NGSL correspondente se for uma das palavras do grupo ("targetLemma", ou string vazia se não for do grupo), e se faz parte do grupo ("isTargetWord": true/false).`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentence: {
                type: Type.STRING,
                description: 'The complete English sentence containing all words from the group.',
              },
              translationPt: {
                type: Type.STRING,
                description: 'Full Portuguese translation of the sentence.',
              },
              contextNote: {
                type: Type.STRING,
                description: 'Brief explanation in Portuguese about how the words connect in this level.',
              },
              tokens: {
                type: Type.ARRAY,
                description: 'Every individual word token of the sentence in order.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    word: {
                      type: Type.STRING,
                      description: 'The exact word token (including punctuation if attached or clean word).',
                    },
                    cleanWord: {
                      type: Type.STRING,
                      description: 'The word without punctuation.',
                    },
                    pt: {
                      type: Type.STRING,
                      description: 'Portuguese translation of this specific word in context.',
                    },
                    pos: {
                      type: Type.STRING,
                      description: 'Part of speech in Portuguese (e.g., Verbo, Substantivo, Artigo, Preposição).',
                    },
                    isTargetWord: {
                      type: Type.BOOLEAN,
                      description: 'True if this word is one of the target words from the NGSL group.',
                    },
                    targetLemma: {
                      type: Type.STRING,
                      description: 'The base lemma from the group if isTargetWord is true, else empty string.',
                    },
                  },
                  required: ['word', 'cleanWord', 'pt', 'pos', 'isTargetWord', 'targetLemma'],
                },
              },
            },
            required: ['sentence', 'translationPt', 'contextNote', 'tokens'],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/gemini/full-sentence:', error);
      return res.status(500).json({
        error: error?.message || 'Erro ao gerar a frase completa com a API Gemini.',
      });
    }
  });

  // 2. Generate connected 3-word micro-sentences for each word of the group
  app.post('/api/gemini/three-word-story', async (req, res) => {
    try {
      const { groupNumber, words, level } = req.body as {
        groupNumber: number;
        words: Array<{ lemma: string; pos: string; pt: string }>;
        level: 'simples' | 'intermediario' | 'avancado';
      };

      if (!words || !Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ error: 'Lista de palavras do grupo é obrigatória.' });
      }

      const ai = getAiClient();
      const wordListStr = words
        .map((w, idx) => `${idx + 1}. "${w.lemma}" (${w.pos}: ${w.pt})`)
        .join('\n');

      const levelDescription =
        level === 'simples'
          ? 'Nível Simples (Iniciante A1/A2): vocabulário cotidiano direto e ações claras.'
          : level === 'intermediario'
          ? 'Nível Intermediário (B1/B2): narrativa envolvente com verbos e substantivos expressivos.'
          : 'Nível Avançado (C1/C2): narrativa sofisticada, estilo literário ou profissional conciso.';

      const prompt = `Você é um especialista em ensino de inglês e narrativa contextual com a lista NGSL 1.2.
Para o Grupo ${groupNumber}, você deve criar UMA frase de EXATAMENTE TRÊS PALAVRAS (3 words) em inglês para CADA palavra da lista abaixo.
Além disso, todas as frases de 3 palavras devem estar CONECTADAS em sequência lógica, formando uma micro-história ou contexto contínuo do início ao fim!

Palavras do Grupo ${groupNumber} (na ordem):
${wordListStr}

Nível de dificuldade solicitado: ${levelDescription}

Regras ESTRITAS e OBRIGATÓRIAS:
1. Gere exatamente ${words.length} itens na lista "items", um para cada palavra do grupo na mesma ordem.
2. Cada frase ("sentence") DEVE conter EXATAMENTE 3 PALAVRAS em inglês (separadas por espaço). Nem 2, nem 4: exatamente 3 palavras! Evite contrações para que a contagem de 3 palavras seja cristalina.
3. Uma das 3 palavras da frase DEVE ser a palavra-alvo ("targetLemma") correspondente daquele item.
4. As frases devem ter ligação narrativa/contextual entre si (a frase 1 conecta com a 2, que conecta com a 3, etc.) para que o aluno compreenda a sequência.
5. Para cada frase de 3 palavras, retorne também a tradução da frase para o português ("translationPt"), a explicação rápida de como ela se liga ao contexto ("connectionNote"), e o array "tokens" com as 3 palavras detalhadas (word, cleanWord, pt, pos, isTargetWord).`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              storyTitlePt: {
                type: Type.STRING,
                description: 'A short title in Portuguese summarizing the connected context of these 3-word sentences.',
              },
              storySummaryPt: {
                type: Type.STRING,
                description: 'A 1-sentence overview in Portuguese of how the micro-sentences connect together.',
              },
              items: {
                type: Type.ARRAY,
                description: 'One 3-word sentence item for each word in the group.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    targetLemma: {
                      type: Type.STRING,
                      description: 'The target NGSL word from the group used in this 3-word sentence.',
                    },
                    sentence: {
                      type: Type.STRING,
                      description: 'A sentence in English consisting of EXACTLY 3 words, including targetLemma.',
                    },
                    translationPt: {
                      type: Type.STRING,
                      description: 'Natural translation of this 3-word sentence into Brazilian Portuguese.',
                    },
                    connectionNote: {
                      type: Type.STRING,
                      description: 'Short note in Portuguese explaining the link to the previous/next phrase.',
                    },
                    tokens: {
                      type: Type.ARRAY,
                      description: 'The 3 individual words of this sentence.',
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          word: { type: Type.STRING },
                          cleanWord: { type: Type.STRING },
                          pt: { type: Type.STRING },
                          pos: { type: Type.STRING },
                          isTargetWord: { type: Type.BOOLEAN },
                        },
                        required: ['word', 'cleanWord', 'pt', 'pos', 'isTargetWord'],
                      },
                    },
                  },
                  required: ['targetLemma', 'sentence', 'translationPt', 'connectionNote', 'tokens'],
                },
              },
            },
            required: ['storyTitlePt', 'storySummaryPt', 'items'],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/gemini/three-word-story:', error);
      return res.status(500).json({
        error: error?.message || 'Erro ao gerar as frases conectadas de 3 palavras com a API Gemini.',
      });
    }
  });

  // 3. Sunday Contextual Quiz Generator (optional AI-enhanced contextual fill-in-the-blank review for Mon-Sat groups)
  app.post('/api/gemini/sunday-review', async (req, res) => {
    try {
      const { groups, words } = req.body as {
        groups: number[];
        words: Array<{ group: number; lemma: string; pos: string; pt: string }>;
      };

      if (!words || !Array.isArray(words) || words.length === 0) {
        return res.status(400).json({ error: 'Palavras para revisão são obrigatórias.' });
      }

      const ai = getAiClient();
      const sampleWords = words.slice(0, 24);
      const wordListStr = sampleWords
        .map((w) => `"${w.lemma}" (Grupo ${w.group}, ${w.pos}: ${w.pt})`)
        .join(', ');

      const prompt = `Crie um teste rápido de revisão dominical com 6 questões práticas de preenchimento de lacuna contextual em inglês para fixar o vocabulário estudado de segunda a sábado (Grupos ${groups.join(', ')}).
Palavras estudadas na semana:
${wordListStr}

Para cada questão:
- Crie uma frase clara em inglês com uma lacuna "____" onde entra exatamente uma das palavras estudadas.
- Forneça a tradução completa da frase para o português.
- Forneça 4 opções em inglês (sendo 1 correta e 3 distratores plausíveis da própria lista).
- Indique a resposta correta ("correctWord") e uma breve explicação em português ("explanationPt").`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sentenceWithBlank: { type: Type.STRING },
                    translationPt: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctWord: { type: Type.STRING },
                    groupNumber: { type: Type.INTEGER },
                    explanationPt: { type: Type.STRING },
                  },
                  required: [
                    'sentenceWithBlank',
                    'translationPt',
                    'options',
                    'correctWord',
                    'groupNumber',
                    'explanationPt',
                  ],
                },
              },
            },
            required: ['questions'],
          },
        },
      });

      const jsonText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(jsonText);
      return res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/gemini/sunday-review:', error);
      return res.status(500).json({
        error: error?.message || 'Erro ao gerar revisão contextual de domingo.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
