// app.js
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result"),
};

const btnStart = document.getElementById("btn-start");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");

const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const questionTitle = document.getElementById("question-title");
const optionsEl = document.getElementById("options");

const resultVariantEl = document.getElementById("result-variant");
const resultBodyEl = document.getElementById("result-body");

const leadForm = document.getElementById("lead-form");
const whatsappInput = document.getElementById("whatsapp");

// 3 “padrões” (variações leves no começo) + narrativa base igual
const PATTERNS = {
  radicalismo: {
    label: "Seu padrão hoje é tentar compensar erro com restrição.",
  },
  ansiedade: {
    label: "Seu padrão hoje é deixar a ansiedade decidir por você.",
  },
  anos: {
    label: "Seu padrão hoje é recomeçar do zero há anos.",
  },
};

// Perguntas (5) + alternativas (4).
// Cada alternativa soma 1 ponto para um padrão.
// (narrativa final é a mesma, com pequena variação pela maior pontuação)
const QUESTIONS = [
  {
    title: "Quando você tenta emagrecer, o que normalmente acontece?",
    options: [
      { text: "Começo animada e depois perco o ritmo", score: { anos: 1 } },
      { text: "Corto tudo e fico irritada", score: { radicalismo: 1 } },
      { text: "Vou bem durante a semana e exagero no fim de semana", score: { ansiedade: 1 } },
      { text: "Desisto antes de completar 1 mês", score: { anos: 1 } },
    ],
  },
  {
    title: "O que mais te gera frustração?",
    options: [
      { text: "Recuperar o peso que perdi", score: { anos: 1 } },
      { text: "Comer por ansiedade", score: { ansiedade: 1 } },
      { text: "Sentir que nunca consigo manter", score: { anos: 1 } },
      { text: "Me comparar com quem consegue", score: { anos: 1 } },
    ],
  },
  {
    title: "Qual dessas frases você já pensou?",
    options: [
      { text: "“Segunda eu começo sério.”", score: { anos: 1 } },
      { text: "“Já estraguei tudo mesmo.”", score: { radicalismo: 1 } },
      { text: "“Eu não tenho disciplina.”", score: { anos: 1 } },
      { text: "“Eu sei o que fazer, mas não faço.”", score: { ansiedade: 1 } },
    ],
  },
  {
    title: "O que você acredita que te falta?",
    options: [
      { text: "Mais força de vontade", score: { anos: 1 } },
      { text: "Um plano alimentar melhor", score: { radicalismo: 1 } },
      { text: "Controle emocional", score: { ansiedade: 1 } },
      { text: "Constância", score: { anos: 1 } },
    ],
  },
  {
    title: "Se você pudesse resolver UMA coisa hoje, seria:",
    options: [
      { text: "Perder 5–10kg e manter", score: { anos: 1 } },
      { text: "Parar de viver no efeito sanfona", score: { anos: 1 } },
      { text: "Controlar a ansiedade", score: { ansiedade: 1 } },
      { text: "Não desistir mais", score: { radicalismo: 1 } },
    ],
  },
];

let current = 0;
let answers = new Array(QUESTIONS.length).fill(null);

function show(screenName) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[screenName].classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const q = QUESTIONS[current];

  progressText.textContent = `Pergunta ${current + 1} de ${QUESTIONS.length}`;
  progressBar.style.width = `${((current + 1) / QUESTIONS.length) * 100}%`;

  questionTitle.textContent = q.title;
  optionsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "opt";
    btn.textContent = opt.text;

    if (answers[current] === idx) btn.classList.add("selected");

    btn.addEventListener("click", () => {
      answers[current] = idx;
      // visual selection
      Array.from(optionsEl.children).forEach((el) => el.classList.remove("selected"));
      btn.classList.add("selected");
      btnNext.disabled = false;
    });

    optionsEl.appendChild(btn);
  });

  btnBack.disabled = current === 0;
  btnNext.disabled = answers[current] === null;
  btnNext.textContent = current === QUESTIONS.length - 1 ? "Ver resultado" : "Continuar";
}

function computePattern() {
  const totals = { radicalismo: 0, ansiedade: 0, anos: 0 };

  answers.forEach((aIdx, qIdx) => {
    const opt = QUESTIONS[qIdx].options[aIdx];
    Object.entries(opt.score).forEach(([k, v]) => {
      totals[k] += v;
    });
  });

  // pick highest; tie-breaker: anos > ansiedade > radicalismo (mais “acolhedor” e comum)
  const order = ["anos", "ansiedade", "radicalismo"];
  let best = order[0];

  order.forEach((k) => {
    if (totals[k] > totals[best]) best = k;
  });

  return best;
}

function renderResult() {
  const patternKey = computePattern();
  resultVariantEl.textContent = PATTERNS[patternKey].label;

  // Texto base igual (com o tom firme equilibrado)
  resultBodyEl.innerHTML = `
    <p><strong>Você não falha por falta de força de vontade.</strong><br/>
    Você está presa em um padrão que te mantém no mesmo lugar.</p>

    <p>Durante o quiz, ficou claro que você vive o ciclo:</p>
    <p><strong>motivação → tentativa radical → exaustão → culpa → recomeço</strong></p>

    <p>E enquanto você continuar recomeçando do zero, vai continuar repetindo os mesmos resultados.</p>

    <p>A boa notícia é que isso não é falta de disciplina.<br/>
    <strong>É falta de método.</strong></p>

    <p>O <strong>Método Leve & Consciente</strong> foi criado para mulheres +30 que já tentaram dietas, planos e desafios — mas nunca aprenderam a construir constância real.</p>

    <p>Em 5 semanas você aprende a:</p>
    <ul class="bullets">
      <li>Sair do 8 ou 80</li>
      <li>Controlar ansiedade alimentar</li>
      <li>Perder de 5 a 10kg sem radicalismo</li>
      <li>Manter o resultado sem viver em dieta</li>
    </ul>
  `;
}

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

btnStart.addEventListener("click", () => {
  current = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  show("quiz");
  renderQuestion();
});

btnBack.addEventListener("click", () => {
  if (current === 0) return;
  current -= 1;
  renderQuestion();
});

btnNext.addEventListener("click", () => {
  if (answers[current] === null) return;

  if (current < QUESTIONS.length - 1) {
    current += 1;
    renderQuestion();
  } else {
    // finished
    renderResult();
    show("result");
  }
});

btnRestart.addEventListener("click", () => {
  show("start");
});

leadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = whatsappInput.value.trim();
  const digits = onlyDigits(raw);

  // validação simples (Brasil geralmente 10 ou 11 dígitos com DDD)
  if (digits.length < 10 || digits.length > 13) {
    whatsappInput.focus();
    alert("Digite um WhatsApp válido com DDD. Ex: (11) 91234-5678");
    return;
  }

  // Aqui você pode integrar com API/planilha depois.
  // Por enquanto: abre WhatsApp com mensagem pronta (opcional) + feedback.
  const msg = encodeURIComponent(
    "Oi, Jeh! Fiz o diagnóstico e quero receber o eBook + entrar na lista de espera do Método Leve & Consciente."
  );

  // Troque pelo seu número com código do país (55) e DDD. Ex: 5511999999999
  const SEU_NUMERO = "55SEUDDDSEUNUMERO";

  alert("Perfeito! Agora vou te enviar o eBook e te colocar na lista de espera ✅");

  // Se você quiser abrir conversa no WhatsApp, mantenha esta linha:
  window.open(`https://wa.me/${SEU_NUMERO}?text=${msg}`, "_blank");
});
