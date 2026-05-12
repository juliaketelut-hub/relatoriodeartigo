import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, ShadingType, WidthType, VerticalAlign,
  Header, Footer, convertInchesToTwip,
} from 'docx';

// ── Colors ──
const C = {
  inkwell:     '2C3639',
  creme:       'A27B5B',
  auLait:      'DCD7C9',
  white:       'FFFFFF',
  cardBg:      'F5F0E7',
  lightBg:     'FAF7F3',
  mutedText:   '7A8A8C',
  greenBg:     'E6F4EC',
  greenText:   '1A5E38',
  amberBg:     'FEF3E2',
  amberText:   '7B4700',
  redBg:       'FDEDEC',
  redText:     'A31515',
  grayBg:      'F0EFED',
  grayText:    '6B7B7C',
};

// ── Font sizes (half-points) ──
const F = {
  xxs: 14,  // 7pt
  xs:  16,  // 8pt
  sm:  18,  // 9pt
  md:  22,  // 11pt  ← body
  lg:  26,  // 13pt
  xl:  32,  // 16pt
  xxl: 44,  // 22pt
  h1:  60,  // 30pt
};

const FONT_H = 'Garamond';
const FONT_B = 'Calibri';

// ── Border helpers ──
const NO_BORDER = {
  top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
  right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
};

const leftAccent = (color = C.creme, size = 12) => ({
  ...NO_BORDER,
  left: { style: BorderStyle.SINGLE, size, color },
});

// ── Primitives ──
const space = (pt = 8) =>
  new Paragraph({ children: [new TextRun({ text: '', size: pt * 2 })], spacing: { before: 0, after: 0 } });

const labelRun = (text, color = C.creme) =>
  new TextRun({ text: text.toUpperCase(), font: FONT_B, size: F.xs, color, bold: true });

const bodyRun = (text, opts = {}) =>
  new TextRun({ text, font: FONT_B, size: F.md, color: C.inkwell, ...opts });

const labelPara = (text, afterPt = 4) =>
  new Paragraph({
    children: [labelRun(text)],
    spacing: { before: 0, after: afterPt * 20 },
  });

const bodyPara = (text, opts = {}) =>
  new Paragraph({
    children: [bodyRun(String(text || ''), opts)],
    spacing: { before: 0, after: 60 },
  });

const bulletPara = (text) =>
  new Paragraph({
    children: [new TextRun({ text: `◦  ${text}`, font: FONT_B, size: F.md, color: C.inkwell })],
    spacing: { before: 40, after: 0 },
  });

const checkPara = (text, good = true) =>
  new Paragraph({
    children: [
      new TextRun({
        text: good ? '  OK  ' : '  FALTAM  ',
        font: FONT_B, size: F.xs, bold: true,
        color: good ? C.greenText : C.amberText,
        shading: { type: ShadingType.SOLID, color: good ? C.greenBg : C.amberBg },
      }),
      new TextRun({ text: `  ${text}`, font: FONT_B, size: F.md, color: C.inkwell }),
    ],
    spacing: { before: 40, after: 0 },
  });

// ── Section header (number box + title line) ──
function sectionHeader(num, title) {
  const numStr = typeof num === 'number' ? String(num).padStart(2, '0') : String(num);
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 750, type: WidthType.DXA },
            shading: { type: ShadingType.SOLID, color: C.inkwell },
            borders: NO_BORDER,
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 60, bottom: 60, left: 80, right: 80 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: numStr, font: FONT_H, size: F.xl, color: C.creme })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            borders: { ...NO_BORDER, bottom: { style: BorderStyle.SINGLE, size: 6, color: C.creme } },
            verticalAlign: VerticalAlign.CENTER,
            margins: { top: 60, bottom: 60, left: 180, right: 0 },
            children: [
              new Paragraph({
                children: [new TextRun({ text: title.toUpperCase(), font: FONT_H, size: F.xl, color: C.inkwell })],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Single full-width card ──
function card(titleText, content, bg = C.cardBg, borderColor = C.creme) {
  const children = [];
  if (titleText) children.push(labelPara(titleText));

  if (typeof content === 'string') {
    children.push(bodyPara(content));
  } else if (Array.isArray(content)) {
    content.forEach(item => children.push(bulletPara(String(item || ''))));
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.SOLID, color: bg },
            borders: leftAccent(borderColor),
            margins: { top: 160, bottom: 160, left: 180, right: 160 },
            children,
          }),
        ],
      }),
    ],
  });
}

// ── Two-column card layout ──
function twoCards(leftLabel, leftContent, rightLabel, rightContent) {
  function makeCell(lbl, content) {
    const children = [];
    if (lbl) children.push(labelPara(lbl));
    if (typeof content === 'string') {
      children.push(bodyPara(content));
    } else if (Array.isArray(content)) {
      content.forEach(item => children.push(bulletPara(String(item || ''))));
    }
    return new TableCell({
      shading: { type: ShadingType.SOLID, color: C.cardBg },
      borders: leftAccent(),
      margins: { top: 160, bottom: 160, left: 180, right: 160 },
      children,
    });
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          makeCell(leftLabel, leftContent),
          new TableCell({ width: { size: 300, type: WidthType.DXA }, borders: NO_BORDER, children: [space()] }),
          makeCell(rightLabel, rightContent),
        ],
      }),
    ],
  });
}

// ── Status badge paragraph ──
function badgePara(status) {
  const MAP = {
    conforme:      { bg: C.greenBg, text: C.greenText, label: 'CONFORME' },
    parcial:       { bg: C.amberBg, text: C.amberText, label: 'PARCIAL' },
    critico:       { bg: C.redBg,   text: C.redText,   label: 'CRÍTICO' },
    nao_conforme:  { bg: C.redBg,   text: C.redText,   label: 'NÃO CONFORME' },
    nao_aplicavel: { bg: C.grayBg,  text: C.grayText,  label: 'NÃO APLICÁVEL' },
  };
  const cfg = MAP[status] || MAP.parcial;
  return new Paragraph({
    children: [
      new TextRun({
        text: `  ${cfg.label}  `,
        font: FONT_B, size: F.xs, bold: true, color: cfg.text,
        shading: { type: ShadingType.SOLID, color: cfg.bg },
      }),
    ],
    spacing: { before: 0, after: 80 },
  });
}

// ── Criteria table (section 04) ──
function criteriaTable(items) {
  const header = new TableRow({
    children: ['CRITÉRIO', 'AVALIAÇÃO', 'PONTUAÇÃO'].map((h, i) =>
      new TableCell({
        shading: { type: ShadingType.SOLID, color: C.inkwell },
        borders: NO_BORDER,
        ...(i === 0 ? { width: { size: 2400, type: WidthType.DXA } } : {}),
        ...(i === 2 ? { width: { size: 1100, type: WidthType.DXA } } : {}),
        margins: { top: 80, bottom: 80, left: 160, right: 80 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, font: FONT_B, size: F.xs, color: C.auLait, bold: true })],
            alignment: i === 2 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
        ],
      })
    ),
  });

  const rows = (items || []).map((item, idx) => {
    const bg = idx % 2 === 0 ? C.lightBg : C.cardBg;
    const pct = Number(item.pontuacao) || 0;
    const scoreColor = pct >= 70 ? C.greenText : pct >= 50 ? C.amberText : C.redText;

    return new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 2400, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [bodyPara(item.criterio || '')],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [bodyPara(item.avaliacao || '')],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 1100, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 80, right: 160 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${pct}%`, font: FONT_B, size: F.lg, color: scoreColor, bold: true })],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      ],
    });
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDER, rows: [header, ...rows] });
}

// ── Recommendations 2×2 grid ──
function recsTable(data) {
  function makeCell(lbl, items) {
    return new TableCell({
      shading: { type: ShadingType.SOLID, color: C.cardBg },
      borders: leftAccent(),
      margins: { top: 160, bottom: 160, left: 180, right: 160 },
      children: [
        labelPara(lbl, 6),
        ...(items || []).map(item =>
          new Paragraph({
            children: [new TextRun({ text: `• ${item}`, font: FONT_B, size: F.md, color: C.inkwell })],
            spacing: { before: 40, after: 0 },
          })
        ),
      ],
    });
  }
  const spacer = () =>
    new TableCell({ width: { size: 300, type: WidthType.DXA }, borders: NO_BORDER, children: [space()] });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          makeCell('Estrutura e Método', data.estrutura_metodo),
          spacer(),
          makeCell('Fundamentação Teórica', data.fundamentacao_teorica),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({ columnSpan: 3, borders: NO_BORDER, children: [space(14)] }),
        ],
      }),
      new TableRow({
        children: [
          makeCell('Normas ABNT', data.normas_abnt),
          spacer(),
          makeCell('Argumentação', data.argumentacao),
        ],
      }),
    ],
  });
}

// ── Qualidade textual — tabela de critérios (seção 05) ──
function qualidadeTextualTable(qt) {
  if (!qt) return null;

  const items = [
    { label: 'Clareza e Objetividade',    data: qt.clareza_objetividade },
    { label: 'Coesão e Coerência',        data: qt.coesao_coerencia },
    { label: 'Progressão Temática',       data: qt.progressao_tematica },
    { label: 'Construção de Parágrafos',  data: qt.construcao_paragrafos },
    { label: 'Originalidade / Contribuição', data: qt.originalidade_contribuicao },
  ];

  const header = new TableRow({
    children: ['CRITÉRIO TEXTUAL', 'AVALIAÇÃO', 'PONTUAÇÃO'].map((h, i) =>
      new TableCell({
        shading: { type: ShadingType.SOLID, color: C.inkwell },
        borders: NO_BORDER,
        ...(i === 0 ? { width: { size: 2400, type: WidthType.DXA } } : {}),
        ...(i === 2 ? { width: { size: 1100, type: WidthType.DXA } } : {}),
        margins: { top: 80, bottom: 80, left: 160, right: 80 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, font: FONT_B, size: F.xs, color: C.auLait, bold: true })],
            alignment: i === 2 ? AlignmentType.RIGHT : AlignmentType.LEFT,
          }),
        ],
      })
    ),
  });

  const rows = items.map((item, idx) => {
    const bg = idx % 2 === 0 ? C.lightBg : C.cardBg;
    const obj = item.data || {};
    const pct = Number(obj.pontuacao) || 0;
    const scoreColor = pct >= 70 ? C.greenText : pct >= 50 ? C.amberText : C.redText;

    return new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 2400, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [bodyPara(item.label)],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          margins: { top: 80, bottom: 80, left: 160, right: 80 },
          children: [bodyPara(obj.avaliacao || '')],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 1100, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 80, right: 160 },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${pct}%`, font: FONT_B, size: F.lg, color: scoreColor, bold: true })],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      ],
    });
  });

  return new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDER, rows: [header, ...rows] });
}

// ── Feedbacks da orientadora (seção condicional) ──
function feedbackOrientadoraSection(fb) {
  if (!fb || !fb.tem_feedback) return [];

  const statusMap = {
    corrigido: { bg: C.greenBg, text: C.greenText, label: 'CORRIGIDO' },
    pendente:  { bg: C.redBg,   text: C.redText,   label: 'PENDENTE' },
    parcial:   { bg: C.amberBg, text: C.amberText, label: 'PARCIAL' },
  };

  const pontoRows = (fb.pontos || []).map((p, idx) => {
    const st = statusMap[p.status] || statusMap.parcial;
    const bg = idx % 2 === 0 ? C.lightBg : C.cardBg;

    return new TableRow({
      children: [
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 3200, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 160, right: 80 },
          children: [bodyPara(p.ponto || '')],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          width: { size: 1000, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 80, right: 80 },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              children: [new TextRun({
                text: `  ${st.label}  `, font: FONT_B, size: F.xs, bold: true,
                color: st.text, shading: { type: ShadingType.SOLID, color: st.bg },
              })],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
        new TableCell({
          shading: { type: ShadingType.SOLID, color: bg },
          borders: NO_BORDER,
          margins: { top: 100, bottom: 100, left: 80, right: 160 },
          children: [bodyPara(p.observacao || '', { italics: true, color: C.mutedText })],
        }),
      ],
    });
  });

  const headerRow = new TableRow({
    children: ['PONTO LEVANTADO', 'STATUS', 'OBSERVAÇÃO'].map((h, i) =>
      new TableCell({
        shading: { type: ShadingType.SOLID, color: C.inkwell },
        borders: NO_BORDER,
        ...(i === 0 ? { width: { size: 3200, type: WidthType.DXA } } : {}),
        ...(i === 1 ? { width: { size: 1000, type: WidthType.DXA } } : {}),
        margins: { top: 80, bottom: 80, left: 160, right: 80 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: h, font: FONT_B, size: F.xs, color: C.auLait, bold: true })],
          }),
        ],
      })
    ),
  });

  const parts = [
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDER, rows: [headerRow, ...pontoRows] }),
  ];

  if ((fb.pendencias_criticas || []).length > 0) {
    parts.push(space(8));
    parts.push(card('Pendências Críticas Não Corrigidas', fb.pendencias_criticas, C.redBg, C.redText));
  }

  if (fb.sintese) {
    parts.push(space(8));
    parts.push(card('Síntese dos Feedbacks', fb.sintese));
  }

  return parts;
}

// ── ABNT cards — layout adaptado por tipo de documento ──
function abntSection(normas) {
  const nbr6022  = normas.estrutura_nbr6022  || {};
  const nbr6023  = normas.referencias_nbr6023 || {};
  const nbr6024  = normas.numeracao_nbr6024  || {};
  const nbr6028  = normas.resumo_nbr6028     || {};
  const nbr14724 = normas.formatacao_nbr14724 || {};
  const nbr6027  = normas.sumario_nbr6027    || null;

  const estruturaLabel = nbr6022.norma_utilizada
    ? `Estrutura — ${nbr6022.norma_utilizada}`
    : 'Estrutura — NBR 6022:2018';

  function abntCell(lbl, status, content) {
    const children = [labelPara(lbl, 4), badgePara(status)];
    if (Array.isArray(content)) {
      content.forEach(c => children.push(bodyPara(c)));
    } else if (typeof content === 'string') {
      children.push(bodyPara(content));
    }
    return new TableCell({
      shading: { type: ShadingType.SOLID, color: C.cardBg },
      borders: leftAccent(),
      margins: { top: 160, bottom: 160, left: 180, right: 140 },
      children,
    });
  }

  const spacer = () =>
    new TableCell({ width: { size: 300, type: WidthType.DXA }, borders: NO_BORDER, children: [space()] });

  const ok6022   = (nbr6022.itens_ok    || []).map(t => `✓ ${t}`);
  const lack6022 = (nbr6022.itens_faltam || []).map(t => `✗ ${t}`);

  const resumo6028 = [
    nbr6028.palavras_aproximado ? `Palavras estimadas: ${nbr6028.palavras_aproximado}` : '',
    nbr6028.descricao || '',
  ].filter(Boolean);

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            abntCell(estruturaLabel, nbr6022.status, [...ok6022, ...lack6022]),
            spacer(),
            abntCell('Referências — NBR 6023:2025', nbr6023.status, nbr6023.descricao || ''),
          ],
        }),
      ],
    }),
    space(8),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            abntCell('Numeração de Seções — NBR 6024', nbr6024.status, nbr6024.descricao || ''),
            spacer(),
            abntCell('Resumo — NBR 6028', nbr6028.status, resumo6028),
          ],
        }),
      ],
    }),
    ...(nbr6027 ? [
      space(8),
      card('Sumário — NBR 6027:2012', nbr6027.descricao || '', C.cardBg, C.creme),
    ] : []),
    space(8),
    card('Formatação Geral — NBR 14724:2024', nbr14724.descricao || ''),
  ];
}

// ── CNQ 2664/2026 card ──
function cnqCard(cnq) {
  const s = cnq.status || 'nao_aplicavel';
  const borderColor = s === 'conforme' ? C.greenText : s === 'nao_conforme' ? C.redText : C.creme;
  const bg = s === 'conforme' ? C.greenBg : s === 'nao_conforme' ? C.redBg : C.cardBg;

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: NO_BORDER,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.SOLID, color: bg },
            borders: leftAccent(borderColor, 16),
            margins: { top: 200, bottom: 200, left: 200, right: 200 },
            children: [
              labelPara('Portaria CNPq nº 2.664/2026 — Uso de Inteligência Artificial', 4),
              badgePara(s),
              bodyPara(cnq.descricao || ''),
              space(4),
              new Paragraph({
                children: [
                  new TextRun({ text: '→  ', font: FONT_B, size: F.md, color: C.creme, bold: true }),
                  new TextRun({ text: cnq.recomendacao || '', font: FONT_B, size: F.md, color: C.inkwell, bold: true }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Header / Footer ──
function makeHeader() {
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: NO_BORDER,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'JK JURÍDICO · JULIA KETELUT', font: FONT_B, size: F.sm, color: C.creme, bold: true }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                borders: NO_BORDER,
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'juliaketelut.juridico@gmail.com · (44) 99165-2729', font: FONT_B, size: F.sm, color: C.mutedText }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.creme } },
        spacing: { before: 80, after: 0 },
      }),
    ],
  });
}

function makeFooter() {
  return new Footer({
    children: [
      new Paragraph({
        children: [],
        border: { top: { style: BorderStyle.SINGLE, size: 2, color: 'E5DDD3' } },
        spacing: { before: 0, after: 80 },
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDER,
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders: NO_BORDER,
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'JK JURÍDICO · JULIA KETELUT', font: FONT_B, size: F.xs, color: C.mutedText })],
                  }),
                ],
              }),
              new TableCell({
                borders: NO_BORDER,
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: 'juliaketelut.juridico@gmail.com · (44) 99165-2729', font: FONT_B, size: F.xs, color: C.mutedText })],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// ── Main export ──
export async function generateDocx(d) {
  const ag  = d.analise_geral        || {};
  const ft  = d.fundamentacao_teorica || {};
  const qt  = d.qualidade_textual    || null;
  const met = d.metodologia          || {};
  const dev = d.desenvolvimento_argumentacao || [];
  const nbt = d.normas_abnt          || {};
  const cnq = d.cnq_2664_2026        || {};
  const fb  = d.feedback_orientadora || null;
  const rec = d.recomendacoes_prioritarias || {};

  const obj   = ag.objetivos          || {};
  const prob  = ag.problema_pesquisa  || {};

  const children = [
    // ── TITLE BLOCK ──
    space(4),
    ...(d.documento_tipo ? [
      new Paragraph({
        children: [new TextRun({ text: d.documento_tipo.toUpperCase(), font: FONT_B, size: F.xxs, color: C.mutedText, bold: true })],
        spacing: { before: 0, after: 60 },
      }),
    ] : []),
    new Paragraph({
      children: [new TextRun({ text: 'PARECER TÉCNICO', font: FONT_B, size: F.xs, color: C.creme, bold: true })],
      spacing: { before: 0, after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: d.titulo || 'Artigo Científico', font: FONT_H, size: F.h1, color: C.inkwell })],
      spacing: { before: 0, after: 120 },
    }),
    ...(d.subtitulo ? [
      new Paragraph({
        children: [new TextRun({ text: d.subtitulo, font: FONT_B, size: F.lg, color: C.mutedText, italics: true })],
        spacing: { before: 0, after: 160 },
      }),
    ] : []),
    new Paragraph({
      children: [],
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.creme } },
      spacing: { before: 0, after: 0 },
    }),
    space(10),

    // Info row: Status | Potencial | Área | Tipo
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top:     { style: BorderStyle.SINGLE, size: 4, color: 'E5DDD3' },
        bottom:  { style: BorderStyle.SINGLE, size: 4, color: 'E5DDD3' },
        left:    NO_BORDER.left,
        right:   NO_BORDER.right,
        insideH: NO_BORDER.top,
        insideV: { style: BorderStyle.SINGLE, size: 4, color: 'E5DDD3' },
      },
      rows: [
        new TableRow({
          children: [
            ['STATUS', d.status || ''],
            ['POTENCIAL', d.potencial || ''],
            ['ÁREA', d.area || ''],
            ['TIPO', d.tipo || ''],
          ].map(([lbl, val]) =>
            new TableCell({
              margins: { top: 120, bottom: 120, left: 200, right: 200 },
              children: [
                new Paragraph({ children: [labelRun(lbl)], spacing: { before: 0, after: 60 } }),
                bodyPara(val),
              ],
            })
          ),
        }),
      ],
    }),
    space(14),

    // ── 01 ANÁLISE GERAL ──
    sectionHeader(1, 'Análise Geral'),
    space(8),
    twoCards('Tema e Relevância', ag.tema_relevancia || '', 'Coerência Temática', ag.coerencia_tematica || ''),
    space(8),

    ...(!prob.formulado_corretamente && prob.sugestao ? [
      card('→ Problema de Pesquisa Sugerido', prob.sugestao, 'FEF9F0'),
      space(8),
    ] : []),

    card(
      `Objetivos Específicos — ${(obj.especificos_status || 'ausente').toUpperCase()}`,
      [
        obj.descricao || '',
        ...(obj.sugestoes_especificos || []).map(s => `Recomenda-se incluir: ${s}`),
      ].filter(Boolean),
    ),
    space(14),

    // ── 02 FUNDAMENTAÇÃO TEÓRICA ──
    sectionHeader(2, 'Fundamentação Teórica'),
    space(8),

    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            // Qualidade das referências
            new TableCell({
              shading: { type: ShadingType.SOLID, color: C.cardBg },
              borders: leftAccent(),
              margins: { top: 160, bottom: 160, left: 180, right: 160 },
              children: [
                labelPara('Qualidade das Referências', 6),
                new Paragraph({
                  children: [
                    new TextRun({ text: '  POSITIVO  ', font: FONT_B, size: F.xs, bold: true, color: C.greenText, shading: { type: ShadingType.SOLID, color: C.greenBg } }),
                    new TextRun({ text: `  ${ft.qualidade_positivo || ''}`, font: FONT_B, size: F.md, color: C.inkwell }),
                  ],
                  spacing: { before: 0, after: 80 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: '  PROBLEMA  ', font: FONT_B, size: F.xs, bold: true, color: C.redText, shading: { type: ShadingType.SOLID, color: C.redBg } }),
                    new TextRun({ text: `  ${ft.qualidade_problema || ''}`, font: FONT_B, size: F.md, color: C.inkwell }),
                  ],
                }),
              ],
            }),
            new TableCell({ width: { size: 300, type: WidthType.DXA }, borders: NO_BORDER, children: [space()] }),
            // Autores ausentes
            new TableCell({
              shading: { type: ShadingType.SOLID, color: C.cardBg },
              borders: leftAccent(),
              margins: { top: 160, bottom: 160, left: 180, right: 160 },
              children: [
                labelPara('Autores Essenciais Ausentes', 6),
                ...(ft.autores_ausentes || []).map(a => bulletPara(a)),
              ],
            }),
          ],
        }),
      ],
    }),
    space(8),
    card('Citações — NBR 10520', ft.citacoes_nbr10520 || ''),

    ...(ft.debate_autores ? [
      space(8),
      card('Debate entre Autores', ft.debate_autores, C.cardBg, C.creme),
    ] : []),

    ...(ft.alerta_revisao ? [
      space(6),
      new Paragraph({
        children: [
          new TextRun({ text: '!  ', font: FONT_B, size: F.md, color: C.amberText, bold: true }),
          new TextRun({ text: ft.alerta_revisao, font: FONT_B, size: F.md, color: C.inkwell }),
        ],
        spacing: { before: 80, after: 0 },
      }),
    ] : []),
    space(14),

    // ── 03 METODOLOGIA ──
    sectionHeader(3, 'Metodologia'),
    space(8),
    twoCards('O que foi declarado', met.declarado || '', 'O que falta declarar', met.falta_declarar || []),

    ...(met.sugestao_insercao ? [
      space(8),
      new Paragraph({
        children: [
          new TextRun({ text: '→  ', font: FONT_B, size: F.md, color: C.creme, bold: true }),
          new TextRun({ text: met.sugestao_insercao, font: FONT_B, size: F.md, color: C.mutedText, italics: true }),
        ],
      }),
    ] : []),
    space(14),

    // ── 04 DESENVOLVIMENTO E ARGUMENTAÇÃO ──
    sectionHeader(4, 'Desenvolvimento e Argumentação'),
    space(8),
    criteriaTable(dev),
    space(14),

    // ── 05 QUALIDADE TEXTUAL ──
    ...(qt ? [
      sectionHeader(5, 'Qualidade Textual'),
      space(8),
      qualidadeTextualTable(qt),
      space(14),
    ] : []),

    // ── 06 NORMAS ABNT ──
    sectionHeader(qt ? 6 : 5, 'Normas ABNT'),
    space(8),
    ...abntSection(nbt),
    space(14),

    // ── IA PORTARIA CNQ 2664/2026 ──
    sectionHeader('IA', 'Portaria CNPq nº 2.664/2026'),
    space(8),
    cnqCard(cnq),
    space(14),

    // ── FEEDBACKS DA ORIENTADORA (condicional) ──
    ...(fb && fb.tem_feedback ? [
      sectionHeader('FO', 'Feedbacks da Orientadora'),
      space(8),
      ...feedbackOrientadoraSection(fb),
      space(14),
    ] : []),

    // ── RECOMENDAÇÕES PRIORITÁRIAS ──
    sectionHeader(qt ? 7 : 6, 'Recomendações Prioritárias'),
    space(8),
    recsTable(rec),
    space(14),

    // ── PARECER FINAL ──
    new Paragraph({
      children: [new TextRun({ text: 'PARECER FINAL', font: FONT_B, size: F.xs, color: C.creme, bold: true })],
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.creme } },
      spacing: { before: 0, after: 100 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: NO_BORDER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { type: ShadingType.SOLID, color: C.lightBg },
              borders: leftAccent(C.creme, 16),
              margins: { top: 240, bottom: 240, left: 240, right: 240 },
              children: [bodyPara(d.parecer_final || '')],
            }),
          ],
        }),
      ],
    }),
    space(8),
    new Paragraph({
      children: [new TextRun({ text: d.mes_ano || '', font: FONT_B, size: F.sm, color: C.mutedText })],
      alignment: AlignmentType.RIGHT,
    }),
  ];

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: FONT_B, size: F.md, color: C.inkwell } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top:    convertInchesToTwip(1.1),
              bottom: convertInchesToTwip(1.0),
              left:   convertInchesToTwip(1.2),
              right:  convertInchesToTwip(1.2),
            },
          },
        },
        headers:  { default: makeHeader() },
        footers:  { default: makeFooter() },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
