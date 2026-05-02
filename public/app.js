const dropZone    = document.getElementById('dropZone');
const pdfInput    = document.getElementById('pdfInput');
const filePill    = document.getElementById('filePill');
const fileName    = document.getElementById('fileName');
const removeFile  = document.getElementById('removeFile');
const btnGenerate = document.getElementById('btnGenerate');
const form        = document.getElementById('form');
const monthInput  = document.getElementById('monthYear');

// Pre-fill current month/year
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const now = new Date();
monthInput.value = `${MONTHS[now.getMonth()]} / ${now.getFullYear()}`;

let selectedFile = null;

// ── Drop zone ──
dropZone.addEventListener('click', () => pdfInput.click());

dropZone.addEventListener('dragover', e => {
  e.preventDefault();
  dropZone.classList.add('over');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('over');
  const f = e.dataTransfer.files[0];
  if (f && isAccepted(f)) setFile(f);
});

pdfInput.addEventListener('change', e => {
  if (e.target.files[0]) setFile(e.target.files[0]);
});

removeFile.addEventListener('click', e => {
  e.stopPropagation();
  clearFile();
});

function isAccepted(f) {
  return f.type === 'application/pdf'
    || f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || f.name.toLowerCase().endsWith('.pdf')
    || f.name.toLowerCase().endsWith('.docx');
}

function setFile(f) {
  selectedFile = f;
  fileName.textContent = f.name;
  filePill.hidden = false;
  dropZone.classList.add('has-file');
  btnGenerate.disabled = false;
}

function clearFile() {
  selectedFile = null;
  pdfInput.value = '';
  filePill.hidden = true;
  dropZone.classList.remove('has-file');
  btnGenerate.disabled = true;
}

// ── Section visibility ──
const SECTIONS = ['upload','progress','result','error'];
function show(name) {
  SECTIONS.forEach(s => {
    document.getElementById(`sec-${s}`).hidden = s !== name;
  });
}

// ── Step animation ──
const stepEls = document.querySelectorAll('.step');
let stepTimer;

function startSteps() {
  let i = 0;
  stepEls.forEach(el => el.classList.remove('active','done'));
  stepEls[0].classList.add('active');
  updateProgressMsg(0);

  stepTimer = setInterval(() => {
    if (i < stepEls.length - 1) {
      stepEls[i].classList.remove('active');
      stepEls[i].classList.add('done');
      i++;
      stepEls[i].classList.add('active');
      updateProgressMsg(i);
    }
  }, 6000);
}

function stopSteps() {
  clearInterval(stepTimer);
  stepEls.forEach(el => { el.classList.remove('active'); el.classList.add('done'); });
}

function updateProgressMsg(i) {
  document.getElementById('progressMsg').textContent =
    stepEls[i].dataset.msg || '';
}

// ── Form submit ──
form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!selectedFile) return;

  show('progress');
  startSteps();

  try {
    const fd = new FormData();
    fd.append('pdf', selectedFile);
    fd.append('clientName', document.getElementById('clientName').value.trim());
    fd.append('month', monthInput.value.trim());

    const res = await fetch('/api/analyze', { method: 'POST', body: fd });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Erro HTTP ${res.status}`);
    }

    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);

    stopSteps();

    const clientVal  = document.getElementById('clientName').value.trim() || 'Artigo';
    const safeClient = clientVal.replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, '').replace(/ /g, '_');
    const outName    = `Relatorio_${safeClient}.docx`;

    const link = document.getElementById('downloadLink');
    link.href     = url;
    link.download = outName;
    document.getElementById('resultFile').textContent = outName;

    show('result');

  } catch (err) {
    stopSteps();
    document.getElementById('errorMsg').textContent = err.message;
    show('error');
  }
});

document.getElementById('btnNew').addEventListener('click', () => { clearFile(); show('upload'); });
document.getElementById('btnRetry').addEventListener('click', () => show('upload'));
