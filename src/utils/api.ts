function normalizeApiBase(rawBase: string | undefined): string {
  if (!rawBase) return '';
  return rawBase
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api$/i, '');
}

export async function postGeminiApi<T>(endpoint: string, payload: unknown): Promise<T> {
  const apiBase = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${apiBase}${normalizedPath}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor da API Gemini. Verifique se o backend está publicado e acessível em VITE_API_BASE_URL.'
    );
  }

  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    if (response.status === 404 || rawText.trim().startsWith('<')) {
      throw new Error(
        'O GitHub Pages hospeda apenas arquivos estáticos (não executa o servidor Node.js da API Gemini). Para usar a geração por IA, publique o aplicativo em um servidor full-stack (Cloud Run pelo botão Deploy do AI Studio, ou Render usando o render.yaml do repositório) e configure a URL em Settings → Secrets and variables → Actions → Variables → VITE_API_BASE_URL.'
      );
    }
    throw new Error(`Resposta inesperada do servidor (${response.status}).`);
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error('Não foi possível interpretar a resposta JSON do servidor Gemini.');
  }

  if (!response.ok || data?.error) {
    throw new Error(data?.error || `Erro HTTP ${response.status} ao chamar a API Gemini.`);
  }

  return data as T;
}
