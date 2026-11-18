export async function postGeminiApi<T>(endpoint: string, payload: unknown): Promise<T> {
  const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const normalizedPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${apiBase}${normalizedPath}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    if (response.status === 404 || rawText.trim().startsWith('<')) {
      throw new Error(
        'O servidor da API Gemini (/api/gemini) não está disponível nesta hospedagem estática (GitHub Pages). Para gerar novas frases com a IA, abra pelo servidor completo da aplicação ou configure VITE_API_BASE_URL nas variáveis do repositório.'
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
