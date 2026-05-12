import Anthropic from '@anthropic-ai/sdk';
import { unzipSync } from 'fflate';
import { generateDocx } from '../../src/generate-docx.js';
import { buildPrompt } from '../../src/prompt.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const form = await request.formData();
    const file                = form.get('pdf');
    const clientName          = (form.get('clientName') || '').trim();
    const month               = (form.get('month') || currentMonthYear()).trim();
    const documentType        = (form.get('documentType') || 'artigo').trim();
    const feedbackOrientadora = (form.get('feedbackOrientadora') || '').trim();

    if (!file || typeof file === 'string') {
      return jsonError('Arquivo não encontrado.', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                   || (file.name || '').toLowerCase().endsWith('.docx');

    const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    let msg;

    if (isDocx) {
      const text = extractDocxText(arrayBuffer);

      msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `CONTEÚDO DO DOCUMENTO:\n\n${text}\n\n---\n\n${buildPrompt(clientName, month, documentType, feedbackOrientadora)}` },
          ],
        }],
      });
    } else {
      // PDF → base64
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      const base64 = btoa(binary);

      msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
            },
            { type: 'text', text: buildPrompt(clientName, month, documentType, feedbackOrientadora) },
          ],
        }],
      });
    }

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

function extractDocxText(arrayBuffer) {
  const files = unzipSync(new Uint8Array(arrayBuffer));
  const docXml = files['word/document.xml'];
  if (!docXml) throw new Error('Arquivo Word inválido ou corrompido.');

  const xml = new TextDecoder().decode(docXml);
  return xml
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:br[^>]*\/>/g, '\n')
    .replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function currentMonthYear() {
  const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const d = new Date();
  return `${MONTHS[d.getMonth()]} / ${d.getFullYear()}`;
}
