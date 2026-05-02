export function buildPrompt(clientName, month) {
  return `Você é uma especialista em revisão acadêmica, normas ABNT e avaliação de periódicos científicos brasileiros. Analise criteriosamente o artigo científico anexo e retorne SOMENTE um JSON válido, sem texto adicional fora do bloco.

Analise os seguintes aspectos:
1. Qualidade geral: tema, relevância, coerência temática, problema de pesquisa, objetivos
2. Fundamentação teórica: qualidade das referências, autores essenciais ausentes, revisão crítica x descritiva
3. Citações — NBR 10520: padronização, páginas em citações diretas, uso correto de citação indireta
4. Metodologia: o que foi declarado, o que falta, justificativas ausentes
5. Desenvolvimento e argumentação: coerência lógica, consistência teórica, profundidade analítica
6. Normas ABNT:
   - NBR 6022: estrutura do artigo (resumo, palavras-chave, seções, conclusão, referências)
   - NBR 6023: formatação das referências bibliográficas
   - NBR 14724: formatação geral (parágrafos, títulos, recuo em citações longas, maiúsculas)
7. Portaria CNQ 2664/2026: verifique SE o artigo menciona uso de IA (ChatGPT, inteligência artificial, ferramentas de IA, etc.) E se há declaração desse uso nas considerações finais ou em nota de rodapé. Esta portaria exige declaração explícita sempre que IA for utilizada.

Retorne exatamente este JSON preenchido com base no artigo real:

\`\`\`json
{
  "titulo": "título completo do artigo como aparece no documento",
  "subtitulo": "subtítulo ou descrição metodológica breve (string vazia se não houver)",
  "area": "área do conhecimento principal (ex: Direito do Trabalho, Medicina, Pedagogia)",
  "tipo": "classificação metodológica (ex: Dogmático-Jurídico, Empírico, Revisão Sistemática, Qualitativo-Exploratório)",
  "status": "Aprovado ou Necessita Revisão ou Reprovado",
  "potencial": "ex: Alto — Qualis A/B ou Médio — Qualis B/C ou Baixo",
  "mes_ano": "${month}",
  "nome_cliente": "${clientName || 'Autor'}",

  "analise_geral": {
    "tema_relevancia": "análise do tema e sua relevância acadêmica atual (2-3 frases)",
    "coerencia_tematica": "análise da coerência temática ao longo do texto (2-3 frases)",
    "problema_pesquisa": {
      "presente": true,
      "formulado_corretamente": false,
      "sugestao": "sugestão de problema em forma interrogativa, ou string vazia se já está correto"
    },
    "objetivos": {
      "geral_presente": true,
      "especificos_status": "ausente ou parcial ou presente",
      "descricao": "análise dos objetivos (1-2 frases)",
      "sugestoes_especificos": ["sugestão de objetivo específico 1", "sugestão de objetivo específico 2", "sugestão de objetivo específico 3"]
    }
  },

  "fundamentacao_teorica": {
    "qualidade_positivo": "pontos positivos das fontes e fundamentação (1-2 frases)",
    "qualidade_problema": "problemas identificados nas referências e na revisão (1-2 frases)",
    "autores_ausentes": [
      "Sobrenome, Nome (ano) — justificativa da relevância",
      "Sobrenome, Nome (ano) — justificativa da relevância"
    ],
    "citacoes_nbr10520": "análise específica das citações: o que está errado e o modelo correto",
    "alerta_revisao": "alerta principal sobre a qualidade da revisão bibliográfica, ou string vazia se adequada"
  },

  "metodologia": {
    "declarado": "o que foi declarado como metodologia no artigo",
    "falta_declarar": [
      "item metodológico ausente 1",
      "item metodológico ausente 2",
      "item metodológico ausente 3"
    ],
    "sugestao_insercao": "sugestão de trecho metodológico para inserção no artigo"
  },

  "desenvolvimento_argumentacao": [
    { "criterio": "Coerência lógica",       "avaliacao": "avaliação específica baseada no artigo", "pontuacao": 0 },
    { "criterio": "Consistência teórica",   "avaliacao": "avaliação específica baseada no artigo", "pontuacao": 0 },
    { "criterio": "Profundidade analítica", "avaliacao": "avaliação específica baseada no artigo", "pontuacao": 0 },
    { "criterio": "Densidade argumentativa","avaliacao": "avaliação específica baseada no artigo", "pontuacao": 0 }
  ],

  "normas_abnt": {
    "estrutura_nbr6022": {
      "status": "conforme ou parcial ou critico",
      "itens_ok": ["elemento presente 1", "elemento presente 2"],
      "itens_faltam": ["elemento ausente 1", "elemento ausente 2"]
    },
    "referencias_nbr6023": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise detalhada das inconsistências encontradas nas referências"
    },
    "formatacao_nbr14724": {
      "descricao": "análise da formatação geral: parágrafos, títulos, recuo, uso de maiúsculas"
    }
  },

  "cnq_2664_2026": {
    "ia_mencionada": true,
    "declaracao_presente": false,
    "local_declaracao": "considerações finais ou nota de rodapé ou ausente ou não aplicável",
    "status": "conforme ou nao_conforme ou nao_aplicavel",
    "descricao": "descrição objetiva do que foi encontrado no artigo quanto ao uso de IA",
    "recomendacao": "recomendação clara e específica para o autor"
  },

  "recomendacoes_prioritarias": {
    "estrutura_metodo": [
      "recomendação 1",
      "recomendação 2",
      "recomendação 3",
      "recomendação 4"
    ],
    "fundamentacao_teorica": [
      "recomendação 1",
      "recomendação 2",
      "recomendação 3",
      "recomendação 4"
    ],
    "normas_abnt": [
      "recomendação 1",
      "recomendação 2",
      "recomendação 3",
      "recomendação 4"
    ],
    "argumentacao": [
      "recomendação 1",
      "recomendação 2",
      "recomendação 3",
      "recomendação 4"
    ]
  },

  "parecer_final": "parecer conclusivo com 3-5 frases: síntese das qualidades do artigo, principais pontos de atenção e avaliação do potencial acadêmico com as correções indicadas"
}
\`\`\`

REGRAS:
- Pontuações entre 0 e 100; baseadas no conteúdo real do artigo
- Status "Aprovado" apenas se não houver problemas estruturais ou metodológicos graves
- ia_mencionada: true se o artigo mencionar qualquer ferramenta de IA
- Retorne SOMENTE o bloco JSON acima, sem explicações adicionais`;
}
