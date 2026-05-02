import Anthropic from '@anthropic-ai/sdk';
import { generateDocx } from '../../src/generate-docx.js';
import { buildPrompt } from '../../src/prompt.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const form = await request.formData();
    const pdfFile   = form.get('pdf');
    const clientName = (form.get('clientName') || '').trim();
    const month      = (form.get('month') || currentMonthYear()).trim();

    if (!pdfFile || typeof pdfFile === 'string') {
      return jsonError('Arquivo PDF não encontrado.', 400);
    }

    // PDF → base64
    const arrayBuffer = await pdfFile.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const base64 = btoa(binary);

    // Call Claude
    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            },
            { type: 'text', text: buildPrompt(clientName, month) },
          ],
        },
      ],
    });

    const raw = msg.content[0]?.text || '';

    // Extract JSON from response
    const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) || raw.match(/(\{[\s\S]*\})/);
    if (!jsonMatch) throw new Error('Não foi possível extrair análise estruturada da resposta.');

    const analysis = JSON.parse(jsonMatch[1]);

    // Generate DOCX
    const docxBuffer = await generateDocx(analysis);

    const safe = (clientName || 'Artigo').replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').replace(/ /g, '_');
    const filename = `Relatorio_${safe}.docx`;

    return new Response(docxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (err) {
    console.error(err);
    return jsonError(err.message || 'Erro interno.', 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function jsonError(msg, status) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function currentMonthYear() {
  const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const d = new Date();
  return `${MONTHS[d.getMonth()]} / ${d.getFullYear()}`;
}
