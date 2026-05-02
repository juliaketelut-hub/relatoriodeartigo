export function buildPrompt(clientName, month, documentType = 'artigo') {
  if (documentType === 'tcc') return buildTCCPrompt(clientName, month);
  if (documentType === 'projeto') return buildProjetoPrompt(clientName, month);
  return buildArtigoPrompt(clientName, month);
}

// ── Artigo Científico ────────────────────────────────────────────────────────
function buildArtigoPrompt(clientName, month) {
  return `Você é uma especialista em revisão acadêmica, normas ABNT e avaliação de periódicos científicos brasileiros. Analise criteriosamente o ARTIGO CIENTÍFICO e retorne SOMENTE um JSON válido, sem texto adicional fora do bloco.

Analise os seguintes aspectos:
1. Qualidade geral: tema, relevância, coerência temática, problema de pesquisa, objetivos
2. Fundamentação teórica: qualidade das referências, autores essenciais ausentes, revisão crítica x descritiva
3. Citações — NBR 10520:2023: sobrenomes em caixa mista (não mais CAIXA ALTA), páginas em citações diretas, citações longas acima de 3 linhas com recuo de 4 cm e fonte menor sem aspas
4. Metodologia: o que foi declarado, o que falta, justificativas ausentes
5. Desenvolvimento e argumentação: coerência lógica, consistência teórica, profundidade analítica
6. Normas ABNT:
   - NBR 6022:2018: estrutura do artigo (resumo, palavras-chave, seções, conclusão, referências)
   - NBR 6023:2025: referências — ISSN não obrigatório, novos formatos para legislação, entrevistas, obras de arte, filmes, músicas e documentos digitais
   - NBR 6024:2012: numeração progressiva das seções — algarismos arábicos, máximo 5 níveis, elementos não numerados (referências, apêndice, anexo, agradecimentos)
   - NBR 6028:2021: resumo — informativo (objetivos, métodos, resultados, conclusões), 100-250 palavras, parágrafo único, terceira pessoa, palavras-chave de 3 a 6 termos por ponto e vírgula, abstract e keywords em inglês
   - NBR 14724:2024: formatação geral (margens, fonte, espaçamento, parágrafos, títulos, recuo)
7. Portaria CNPq nº 2.664/2026: verificar menção de IA e declaração explícita de uso (ferramenta + finalidade) nas considerações finais ou nota de rodapé; IA não pode ser coautora

${SCHEMA_ARTIGO(clientName, month)}`;
}

// ── TCC / Monografia ─────────────────────────────────────────────────────────
function buildTCCPrompt(clientName, month) {
  return `Você é uma especialista em revisão acadêmica e normas ABNT. Analise criteriosamente o TCC ou MONOGRAFIA e retorne SOMENTE um JSON válido, sem texto adicional fora do bloco.

Analise os seguintes aspectos:
1. Qualidade geral: tema, relevância, coerência temática, problema de pesquisa, objetivos
2. Fundamentação teórica: qualidade das referências, autores essenciais ausentes, revisão crítica x descritiva
3. Citações — NBR 10520:2023: sobrenomes em caixa mista (não mais CAIXA ALTA), páginas em citações diretas, citações longas acima de 3 linhas com recuo de 4 cm e fonte menor sem aspas
4. Metodologia: o que foi declarado, o que falta, justificativas ausentes
5. Desenvolvimento e argumentação: coerência lógica, consistência teórica, profundidade analítica
6. Normas ABNT:
   - NBR 14724:2024 (NORMA PRIMÁRIA): estrutura completa — elementos pré-textuais (capa, folha de rosto, folha de aprovação, dedicatória opcional, agradecimentos opcional, epígrafe opcional, resumo em português, abstract em inglês, lista de ilustrações/tabelas se houver, sumário), elementos textuais (introdução, desenvolvimento, conclusão/considerações finais), elementos pós-textuais (referências, apêndice se houver, anexo se houver); verificar margens (superior e esquerda 3 cm, inferior e direita 2 cm), fonte tamanho 12, espaçamento entre linhas 1,5
   - NBR 6023:2025: referências — ISSN não obrigatório, novos formatos para legislação, entrevistas, obras de arte, filmes, músicas e documentos digitais
   - NBR 6024:2012: numeração progressiva das seções — algarismos arábicos, máximo 5 níveis, elementos não numerados (referências, apêndice, anexo, agradecimentos)
   - NBR 6027:2012: sumário — verificar se as entradas correspondem exatamente aos títulos e subtítulos do texto, alinhamento, paginação, formatação tipográfica das seções primárias e secundárias
   - NBR 6028:2021: resumo — informativo (objetivos, métodos, resultados, conclusões), 150-500 palavras para monografias, parágrafo único, terceira pessoa, palavras-chave de 3 a 6 termos por ponto e vírgula, abstract e keywords em inglês
7. Portaria CNPq nº 2.664/2026: verificar menção de IA e declaração explícita de uso (ferramenta + finalidade) nas considerações finais ou nota de rodapé; IA não pode ser coautora

${SCHEMA_TCC(clientName, month)}`;
}

// ── Projeto de Pesquisa ──────────────────────────────────────────────────────
function buildProjetoPrompt(clientName, month) {
  return `Você é uma especialista em revisão acadêmica e normas ABNT. Analise criteriosamente o PROJETO DE PESQUISA e retorne SOMENTE um JSON válido, sem texto adicional fora do bloco.

Analise os seguintes aspectos:
1. Qualidade geral: tema, relevância, coerência temática, problema de pesquisa claramente formulado em forma interrogativa, justificativa da relevância do tema
2. Fundamentação teórica: qualidade das referências, autores essenciais ausentes, revisão crítica x descritiva
3. Citações — NBR 10520:2023: sobrenomes em caixa mista (não mais CAIXA ALTA), páginas em citações diretas, citações longas acima de 3 linhas com recuo de 4 cm e fonte menor sem aspas
4. Metodologia: o que foi declarado, o que falta — um projeto deve declarar tipo de pesquisa, abordagem, procedimentos, universo/amostra, instrumentos de coleta e análise de dados; verificar se o cronograma está presente
5. Desenvolvimento e argumentação: coerência lógica, consistência teórica, profundidade na problematização
6. Normas ABNT:
   - NBR 15287:2025 (NORMA PRIMÁRIA): estrutura do projeto — identificação (título, autor, orientador, instituição, linha de pesquisa, data), resumo, palavras-chave, introdução/problema/justificativa, objetivos (geral e específicos), referencial teórico, metodologia, cronograma, recursos/orçamento (se houver), referências
   - NBR 6023:2025: referências — ISSN não obrigatório, novos formatos para legislação, entrevistas, obras de arte, filmes, músicas e documentos digitais
   - NBR 6024:2012: numeração progressiva das seções — algarismos arábicos, máximo 5 níveis, elementos não numerados (referências, apêndice, anexo)
   - NBR 6028:2021: resumo — informativo (objetivos, métodos previstos, relevância), até 250 palavras para projetos, parágrafo único, terceira pessoa, palavras-chave de 3 a 6 termos por ponto e vírgula
7. Portaria CNPq nº 2.664/2026: verificar menção de IA e declaração explícita de uso (ferramenta + finalidade) no texto; IA não pode ser coautora

${SCHEMA_PROJETO(clientName, month)}`;
}

// ── JSON Schemas ─────────────────────────────────────────────────────────────

function SCHEMA_ARTIGO(clientName, month) {
  return `Retorne exatamente este JSON preenchido com base no documento real:

\`\`\`json
{
  "documento_tipo": "Artigo Científico",
  "titulo": "título completo como aparece no documento",
  "subtitulo": "subtítulo ou string vazia se não houver",
  "area": "área do conhecimento principal",
  "tipo": "classificação metodológica (ex: Dogmático-Jurídico, Empírico, Revisão Sistemática)",
  "status": "Aprovado ou Necessita Revisão ou Reprovado",
  "potencial": "ex: Alto — Qualis A/B ou Médio — Qualis B/C ou Baixo",
  "mes_ano": "${month}",
  "nome_cliente": "${clientName || 'Autor'}",

  "analise_geral": {
    "tema_relevancia": "análise do tema e sua relevância acadêmica (2-3 frases)",
    "coerencia_tematica": "análise da coerência temática ao longo do texto (2-3 frases)",
    "problema_pesquisa": {
      "presente": true,
      "formulado_corretamente": false,
      "sugestao": "sugestão em forma interrogativa, ou string vazia se já está correto"
    },
    "objetivos": {
      "geral_presente": true,
      "especificos_status": "ausente ou parcial ou presente",
      "descricao": "análise dos objetivos (1-2 frases)",
      "sugestoes_especificos": ["sugestão 1", "sugestão 2", "sugestão 3"]
    }
  },

  "fundamentacao_teorica": {
    "qualidade_positivo": "pontos positivos das fontes e fundamentação (1-2 frases)",
    "qualidade_problema": "problemas identificados nas referências e na revisão (1-2 frases)",
    "autores_ausentes": ["Sobrenome, Nome (ano) — justificativa"],
    "citacoes_nbr10520": "análise das citações: erros e modelo correto conforme NBR 10520:2023",
    "alerta_revisao": "alerta principal, ou string vazia se adequada"
  },

  "metodologia": {
    "declarado": "o que foi declarado como metodologia",
    "falta_declarar": ["item ausente 1", "item ausente 2", "item ausente 3"],
    "sugestao_insercao": "sugestão de trecho metodológico para inserção"
  },

  "desenvolvimento_argumentacao": [
    { "criterio": "Coerência lógica",       "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Consistência teórica",   "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Profundidade analítica", "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Densidade argumentativa","avaliacao": "avaliação específica", "pontuacao": 0 }
  ],

  "normas_abnt": {
    "estrutura_nbr6022": {
      "norma_utilizada": "NBR 6022:2018",
      "status": "conforme ou parcial ou critico",
      "itens_ok": ["elemento presente 1", "elemento presente 2"],
      "itens_faltam": ["elemento ausente 1", "elemento ausente 2"]
    },
    "referencias_nbr6023": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise detalhada das inconsistências nas referências conforme NBR 6023:2025"
    },
    "numeracao_nbr6024": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise da numeração progressiva das seções"
    },
    "resumo_nbr6028": {
      "status": "conforme ou parcial ou critico",
      "palavras_aproximado": 0,
      "descricao": "análise do resumo: tipo, extensão, estrutura, palavras-chave, abstract em inglês"
    },
    "formatacao_nbr14724": {
      "descricao": "análise da formatação geral conforme NBR 14724:2024"
    }
  },

  "cnq_2664_2026": {
    "ia_mencionada": true,
    "declaracao_presente": false,
    "local_declaracao": "considerações finais ou nota de rodapé ou ausente ou não aplicável",
    "status": "conforme ou nao_conforme ou nao_aplicavel",
    "descricao": "descrição do que foi encontrado quanto ao uso de IA",
    "recomendacao": "recomendação conforme Portaria CNPq nº 2.664/2026"
  },

  "recomendacoes_prioritarias": {
    "estrutura_metodo": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "fundamentacao_teorica": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "normas_abnt": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "argumentacao": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"]
  },

  "parecer_final": "parecer conclusivo com 3-5 frases: qualidades, pontos de atenção e potencial acadêmico"
}
\`\`\`

REGRAS: Pontuações 0-100; "Aprovado" só se sem problemas graves; ia_mencionada: true se mencionar IA; palavras_aproximado: estime a contagem; retorne SOMENTE o JSON.`;
}

function SCHEMA_TCC(clientName, month) {
  return `Retorne exatamente este JSON preenchido com base no documento real:

\`\`\`json
{
  "documento_tipo": "TCC / Monografia",
  "titulo": "título completo como aparece no documento",
  "subtitulo": "subtítulo ou string vazia se não houver",
  "area": "área do conhecimento principal",
  "tipo": "classificação metodológica (ex: Qualitativo-Exploratório, Estudo de Caso, Revisão Bibliográfica)",
  "status": "Aprovado ou Necessita Revisão ou Reprovado",
  "potencial": "ex: Excelente ou Bom ou Regular — com justificativa breve",
  "mes_ano": "${month}",
  "nome_cliente": "${clientName || 'Autor'}",

  "analise_geral": {
    "tema_relevancia": "análise do tema e sua relevância acadêmica (2-3 frases)",
    "coerencia_tematica": "análise da coerência temática ao longo do texto (2-3 frases)",
    "problema_pesquisa": {
      "presente": true,
      "formulado_corretamente": false,
      "sugestao": "sugestão em forma interrogativa, ou string vazia se já está correto"
    },
    "objetivos": {
      "geral_presente": true,
      "especificos_status": "ausente ou parcial ou presente",
      "descricao": "análise dos objetivos (1-2 frases)",
      "sugestoes_especificos": ["sugestão 1", "sugestão 2", "sugestão 3"]
    }
  },

  "fundamentacao_teorica": {
    "qualidade_positivo": "pontos positivos das fontes e fundamentação (1-2 frases)",
    "qualidade_problema": "problemas identificados nas referências e na revisão (1-2 frases)",
    "autores_ausentes": ["Sobrenome, Nome (ano) — justificativa"],
    "citacoes_nbr10520": "análise das citações: erros e modelo correto conforme NBR 10520:2023",
    "alerta_revisao": "alerta principal, ou string vazia se adequada"
  },

  "metodologia": {
    "declarado": "o que foi declarado como metodologia",
    "falta_declarar": ["item ausente 1", "item ausente 2", "item ausente 3"],
    "sugestao_insercao": "sugestão de trecho metodológico para inserção"
  },

  "desenvolvimento_argumentacao": [
    { "criterio": "Coerência lógica",       "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Consistência teórica",   "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Profundidade analítica", "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Densidade argumentativa","avaliacao": "avaliação específica", "pontuacao": 0 }
  ],

  "normas_abnt": {
    "estrutura_nbr6022": {
      "norma_utilizada": "NBR 14724:2024",
      "status": "conforme ou parcial ou critico",
      "itens_ok": ["elemento pré/pós-textual presente 1", "elemento presente 2"],
      "itens_faltam": ["elemento ausente 1", "elemento ausente 2"]
    },
    "referencias_nbr6023": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise detalhada das inconsistências nas referências conforme NBR 6023:2025"
    },
    "numeracao_nbr6024": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise da numeração progressiva das seções"
    },
    "resumo_nbr6028": {
      "status": "conforme ou parcial ou critico",
      "palavras_aproximado": 0,
      "descricao": "análise do resumo: tipo, extensão (150-500 palavras), estrutura, palavras-chave, abstract em inglês"
    },
    "sumario_nbr6027": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise do sumário: correspondência com títulos do texto, alinhamento, paginação, formatação tipográfica"
    },
    "formatacao_nbr14724": {
      "descricao": "análise da formatação: margens (3/2 cm), fonte 12, espaçamento 1,5, parágrafos, títulos, recuo"
    }
  },

  "cnq_2664_2026": {
    "ia_mencionada": true,
    "declaracao_presente": false,
    "local_declaracao": "considerações finais ou nota de rodapé ou ausente ou não aplicável",
    "status": "conforme ou nao_conforme ou nao_aplicavel",
    "descricao": "descrição do que foi encontrado quanto ao uso de IA",
    "recomendacao": "recomendação conforme Portaria CNPq nº 2.664/2026"
  },

  "recomendacoes_prioritarias": {
    "estrutura_metodo": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "fundamentacao_teorica": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "normas_abnt": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "argumentacao": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"]
  },

  "parecer_final": "parecer conclusivo com 3-5 frases: qualidades, pontos de atenção e avaliação geral do trabalho"
}
\`\`\`

REGRAS: Pontuações 0-100; "Aprovado" só se sem problemas graves; ia_mencionada: true se mencionar IA; palavras_aproximado: estime a contagem; retorne SOMENTE o JSON.`;
}

function SCHEMA_PROJETO(clientName, month) {
  return `Retorne exatamente este JSON preenchido com base no documento real:

\`\`\`json
{
  "documento_tipo": "Projeto de Pesquisa",
  "titulo": "título completo como aparece no documento",
  "subtitulo": "subtítulo ou string vazia se não houver",
  "area": "área do conhecimento principal",
  "tipo": "abordagem metodológica prevista (ex: Qualitativo-Exploratório, Quantitativo, Misto)",
  "status": "Aprovado ou Necessita Revisão ou Reprovado",
  "potencial": "ex: Alto — projeto bem estruturado ou Médio ou Baixo — com justificativa breve",
  "mes_ano": "${month}",
  "nome_cliente": "${clientName || 'Autor'}",

  "analise_geral": {
    "tema_relevancia": "análise do tema e sua relevância acadêmica (2-3 frases)",
    "coerencia_tematica": "análise da coerência temática e da problematização (2-3 frases)",
    "problema_pesquisa": {
      "presente": true,
      "formulado_corretamente": false,
      "sugestao": "sugestão em forma interrogativa, ou string vazia se já está correto"
    },
    "objetivos": {
      "geral_presente": true,
      "especificos_status": "ausente ou parcial ou presente",
      "descricao": "análise dos objetivos (1-2 frases)",
      "sugestoes_especificos": ["sugestão 1", "sugestão 2", "sugestão 3"]
    }
  },

  "fundamentacao_teorica": {
    "qualidade_positivo": "pontos positivos das fontes e fundamentação (1-2 frases)",
    "qualidade_problema": "problemas identificados nas referências e na revisão (1-2 frases)",
    "autores_ausentes": ["Sobrenome, Nome (ano) — justificativa"],
    "citacoes_nbr10520": "análise das citações: erros e modelo correto conforme NBR 10520:2023",
    "alerta_revisao": "alerta principal, ou string vazia se adequada"
  },

  "metodologia": {
    "declarado": "o que foi declarado como metodologia prevista no projeto",
    "falta_declarar": ["item ausente 1 (ex: cronograma)", "item ausente 2", "item ausente 3"],
    "sugestao_insercao": "sugestão de trecho metodológico para inserção"
  },

  "desenvolvimento_argumentacao": [
    { "criterio": "Coerência lógica",        "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Consistência teórica",    "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Profundidade analítica",  "avaliacao": "avaliação específica", "pontuacao": 0 },
    { "criterio": "Viabilidade da pesquisa", "avaliacao": "avaliação da viabilidade metodológica e temporal", "pontuacao": 0 }
  ],

  "normas_abnt": {
    "estrutura_nbr6022": {
      "norma_utilizada": "NBR 15287:2025",
      "status": "conforme ou parcial ou critico",
      "itens_ok": ["elemento presente 1 (ex: identificação completa)", "elemento presente 2"],
      "itens_faltam": ["elemento ausente 1 (ex: cronograma)", "elemento ausente 2"]
    },
    "referencias_nbr6023": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise detalhada das inconsistências nas referências conforme NBR 6023:2025"
    },
    "numeracao_nbr6024": {
      "status": "conforme ou parcial ou critico",
      "descricao": "análise da numeração progressiva das seções"
    },
    "resumo_nbr6028": {
      "status": "conforme ou parcial ou critico",
      "palavras_aproximado": 0,
      "descricao": "análise do resumo: tipo, extensão (até 250 palavras), estrutura, palavras-chave"
    },
    "formatacao_nbr14724": {
      "descricao": "análise da formatação geral conforme NBR 14724:2024 (aplicável subsidiariamente)"
    }
  },

  "cnq_2664_2026": {
    "ia_mencionada": true,
    "declaracao_presente": false,
    "local_declaracao": "no texto ou nota de rodapé ou ausente ou não aplicável",
    "status": "conforme ou nao_conforme ou nao_aplicavel",
    "descricao": "descrição do que foi encontrado quanto ao uso de IA",
    "recomendacao": "recomendação conforme Portaria CNPq nº 2.664/2026"
  },

  "recomendacoes_prioritarias": {
    "estrutura_metodo": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "fundamentacao_teorica": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "normas_abnt": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"],
    "argumentacao": ["recomendação 1", "recomendação 2", "recomendação 3", "recomendação 4"]
  },

  "parecer_final": "parecer conclusivo com 3-5 frases: qualidades do projeto, pontos críticos e viabilidade acadêmica"
}
\`\`\`

REGRAS: Pontuações 0-100; "Aprovado" só se sem problemas graves; ia_mencionada: true se mencionar IA; palavras_aproximado: estime a contagem; retorne SOMENTE o JSON.`;
}
