/**
 * ==============================================================================
 * INTELIGÊNCIA ARTIFICIAL SEM COMPLICAÇÃO - JAVASCRIPT PRINCIPAL
 * Projeto de Extensão Universitária II · Universidade Paulista (UNIP Anchieta)
 * Autor: Pablo Alexandre de Vasconcelos
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- 0. LENIS SCROLL SUAVE (DESKTOP) & ANIMAÇÕES ---------------- */
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined' && window.innerWidth >= 900) {
    try {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: 'vertical',
        gestureOrientation: 'vertical'
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis scroll suave indisponível, usando rolagem nativa.', e);
    }
  }

  // Ajuste dinâmico de espaçamento do cabeçalho fixo (acompanha o scroll 100% do tempo)
  const headerWrapper = document.getElementById('site-header-wrapper') || document.getElementById('header');
  function updateHeaderOffset() {
    if (headerWrapper) {
      const height = headerWrapper.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${height}px`);
      document.body.style.paddingTop = `${height}px`;
    }
  }

  function getScrollOffset() {
    return headerWrapper ? -(headerWrapper.offsetHeight + 14) : -115;
  }

  window.addEventListener('resize', updateHeaderOffset, { passive: true });
  window.addEventListener('load', updateHeaderOffset);
  updateHeaderOffset();
  setTimeout(updateHeaderOffset, 150);

  // Efeito de sombra ao rolar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      headerWrapper?.classList.add('scrolled');
    } else {
      headerWrapper?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Intersection Observer para animações suaves de revelação (Reveal on Scroll)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback se navegador não suportar IntersectionObserver
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------------- 1. ACESSIBILIDADE: TAMANHO DE FONTE ---------------- */
  const htmlEl = document.documentElement;
  const btnDecreaseFont = document.getElementById('btn-decrease-font');
  const btnResetFont = document.getElementById('btn-reset-font');
  const btnIncreaseFont = document.getElementById('btn-increase-font');

  const fontSizes = ['font-size-sm', 'font-size-md', 'font-size-lg', 'font-size-xl'];
  let currentFontIdx = 1;

  const savedFont = localStorage.getItem('user_font_size');
  if (savedFont && fontSizes.includes(savedFont)) {
    currentFontIdx = fontSizes.indexOf(savedFont);
    applyFontSize(currentFontIdx);
  }

  function applyFontSize(index) {
    fontSizes.forEach(cls => htmlEl.classList.remove(cls));
    htmlEl.classList.add(fontSizes[index]);
    localStorage.setItem('user_font_size', fontSizes[index]);
  }

  if (btnDecreaseFont && btnResetFont && btnIncreaseFont) {
    btnDecreaseFont.addEventListener('click', () => {
      if (currentFontIdx > 0) {
        currentFontIdx--;
        applyFontSize(currentFontIdx);
      }
    });

    btnResetFont.addEventListener('click', () => {
      currentFontIdx = 1;
      applyFontSize(currentFontIdx);
    });

    btnIncreaseFont.addEventListener('click', () => {
      if (currentFontIdx < fontSizes.length - 1) {
        currentFontIdx++;
        applyFontSize(currentFontIdx);
      }
    });
  }

  /* ---------------- 2. ACESSIBILIDADE: TEMA ESCURO / CLARO ---------------- */
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const savedTheme = localStorage.getItem('user_color_theme');
  if (savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
  }

  if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
      const isDark = htmlEl.getAttribute('data-theme') === 'dark';
      if (isDark) {
        htmlEl.removeAttribute('data-theme');
        localStorage.setItem('user_color_theme', 'light');
      } else {
        htmlEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('user_color_theme', 'dark');
      }
    });
  }

  /* ---------------- 3. NAVEGAÇÃO MOBILE SEGURA (SEM TRANSBORDO NO SWIPE) ---------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  const btnCloseNav = document.getElementById('btn-close-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    if (!mainNav) return;
    mainNav.classList.add('open');
    mainNav.setAttribute('aria-hidden', 'false');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mainNav) return;
    mainNav.classList.remove('open');
    mainNav.setAttribute('aria-hidden', 'true');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) closeMenu();
      else openMenu();
    });

    btnCloseNav?.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        closeMenu();
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            if (lenisInstance) {
              lenisInstance.scrollTo(targetEl, { offset: getScrollOffset() });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && e.target !== mobileMenuBtn) {
        closeMenu();
      }
    });
  }

  /* ---------------- 4. SISTEMA DE TOAST PARA FEEDBACK ---------------- */
  const copyToast = document.getElementById('copy-toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message = 'Copiado com sucesso!') {
    if (!copyToast) return;
    if (toastMessage) toastMessage.textContent = message;

    copyToast.classList.add('active');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      copyToast.classList.remove('active');
    }, 2800);
  }

  function copyTextToClipboard(text, successCallback) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        if (successCallback) successCallback();
      }).catch(() => {
        fallbackCopy(text, successCallback);
      });
    } else {
      fallbackCopy(text, successCallback);
    }
  }

  function fallbackCopy(text, successCallback) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      if (successCallback) successCallback();
    } catch (err) {
      console.error('Erro ao copiar: ', err);
    }
    document.body.removeChild(textArea);
  }

  /* ---------------- 5. BUSCA INTELIGENTE POR LUPA ---------------- */
  const btnOpenSearch = document.getElementById('btn-open-search');
  const btnCloseSearch = document.getElementById('btn-close-search');
  const searchModal = document.getElementById('search-modal');
  const siteSearchInput = document.getElementById('site-search-input');
  const searchResultsList = document.getElementById('search-results-list');
  const searchTags = document.querySelectorAll('.search-tag');

  const searchableSections = [
    { id: 'o-que-e-ia', title: 'Capítulo 01: O que é Inteligência Artificial?', badge: 'Conceito', text: 'inteligência artificial o que é conceito estagiário super rápido mitos e verdades assistente de voz reconhecimento facial mapas corretor de celular' },
    { id: 'primeiros-passos', title: 'Capítulo 02: Primeiros Passos com Inteligência Artificial', badge: 'Início', text: 'primeiros passos como começar baixar ferramentas chatgpt gemini copilot claude meta ai whatsapp aplicativo oficial loja' },
    { id: 'construtor-prompt', title: 'Capítulo 03: A Receita do Bom Pedido (Prompt)', badge: 'Prompts', text: 'como pedir prompt ingredientes papel tarefa contexto formato tom modelo universal dicas e truques gerador de pedidos' },
    { id: 'receitas-praticas', title: 'Capítulo 04: As 10 Receitas Prontas de Inteligência Artificial', badge: '10 Modelos', text: 'receitas modelos prontos vendas clientes produto resposta mensagem aviso feriado post instagram agenda tarefas compras estoque orçamentos preços passo a passo reclamação ideias' },
    { id: 'midias-ia', title: 'Capítulos 05 & 06: Imagens e Áudio com Inteligência Artificial', badge: 'Mídias', text: 'gerador de imagem canva fotos ilustrações cartaz estilo transcrição áudio voz whatsapp resumo reunião gravações' },
    { id: 'seguranca', title: 'Capítulo 07: Segurança, Ética e LGPD', badge: 'Segurança', text: 'segurança lgpd privacidade lei 13709 dados pessoais golpes pix clonagem de voz deepfake checagens cuidados senhas proteção de dados regra de ouro' },
    { id: 'cada-idade', title: 'Capítulo 08: Inteligência Artificial para Cada Idade', badge: 'Públicos', text: 'idoso idosos melhor idade terceira idade jovens estudantes adultos trabalho pequenos negócios autônomo falar por microfone voz sem digitar antiplágio' },
    { id: 'quiz-section', title: 'Capítulo 09: Quiz sobre Inteligência Artificial', badge: 'Prática', text: 'quiz teste exercícios simulado perguntas respostas testar conhecimentos gabarito nota' },
    { id: 'cola-rapida', title: 'Cola Rápida & Glossário', badge: 'Consulta', text: 'cola rápida imprimir pdf resumo geladeira bolso glossário termos alucinação viés anpd cert cgi senado procon mcti ebia unesco oecd' },
    { id: 'sobre-projeto', title: 'Sobre o Projeto de Extensão UNIP', badge: 'Institucional', text: 'unip anchieta extensão universitária ciência da computação pablo alexandre de vasconcelos inova mais unip cne ces 7/2018' }
  ];

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('open');
    searchModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => siteSearchInput?.focus(), 100);
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('open');
    searchModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (siteSearchInput) siteSearchInput.value = '';
  }

  btnOpenSearch?.addEventListener('click', openSearchModal);
  btnCloseSearch?.addEventListener('click', closeSearchModal);

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeSearchModal();
  });

  function runSearch(term) {
    const cleanTerm = term.trim().toLowerCase();

    if (cleanTerm.length < 2) {
      searchResultsList.innerHTML = '<div class="search-placeholder-msg">Digite 2 ou mais letras para buscar em todo o conteúdo do guia.</div>';
      return;
    }

    const matches = searchableSections.filter(sec => {
      return sec.text.includes(cleanTerm) || sec.title.toLowerCase().includes(cleanTerm) || sec.badge.toLowerCase().includes(cleanTerm);
    });

    if (matches.length === 0) {
      searchResultsList.innerHTML = `<div class="search-placeholder-msg">Nenhum resultado encontrado para "<strong>${escapeHtml(term)}</strong>". Tente termos como <em>idoso, whatsapp, prompt, segurança</em>.</div>`;
      return;
    }

    searchResultsList.innerHTML = matches.map(match => `
      <a href="#${match.id}" class="search-result-item" data-target="${match.id}">
        <div class="search-result-header">
          <span class="search-result-title">${match.title}</span>
          <span class="search-result-badge">${match.badge}</span>
        </div>
        <p class="search-result-desc">Clique para navegar diretamente para esta seção do guia.</p>
      </a>
    `).join('');

    searchResultsList.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        closeSearchModal();
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          if (lenisInstance) {
            lenisInstance.scrollTo(targetEl, { offset: getScrollOffset() });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
          targetEl.style.transition = 'outline 0.3s ease';
          targetEl.style.outline = '3px solid #2563eb';
          setTimeout(() => { targetEl.style.outline = 'none'; }, 2200);
        }
      });
    });
  }

  siteSearchInput?.addEventListener('input', (e) => {
    runSearch(e.target.value);
  });

  searchTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const keyword = tag.getAttribute('data-search');
      if (siteSearchInput) {
        siteSearchInput.value = keyword;
        runSearch(keyword);
      }
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------------- 6. GUIA DIRECIONADO: "ESTOU PERDIDO" ---------------- */
  const btnOpenGuided = document.getElementById('btn-open-guided');
  const btnCloseGuided = document.getElementById('btn-close-guided');
  const guidedPanel = document.getElementById('guided-panel');
  const btnApplyGuided = document.getElementById('btn-apply-guided');

  let selectedProfile = 'idoso';
  let selectedGoal = 'voz';

  btnOpenGuided?.addEventListener('click', () => {
    guidedPanel?.classList.add('open');
    guidedPanel?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  function closeGuided() {
    guidedPanel?.classList.remove('open');
    guidedPanel?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btnCloseGuided?.addEventListener('click', closeGuided);
  guidedPanel?.addEventListener('click', (e) => {
    if (e.target === guidedPanel) closeGuided();
  });

  document.querySelectorAll('#choice-profile .choice-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#choice-profile .choice-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedProfile = btn.getAttribute('data-val');
    });
  });

  document.querySelectorAll('#choice-goal .choice-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#choice-goal .choice-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGoal = btn.getAttribute('data-val');
    });
  });

  btnApplyGuided?.addEventListener('click', () => {
    closeGuided();
    let targetSection = 'o-que-e-ia';

    if (selectedProfile === 'idoso' || selectedGoal === 'voz') {
      targetSection = 'cada-idade';
      document.querySelector('.age-tab[data-age="idosos"]')?.click();
      showToast('Dica: Use o botão "Ouvir Página" no topo se preferir ouvir!');
    } else if (selectedGoal === 'golpes') {
      targetSection = 'seguranca';
    } else if (selectedGoal === 'mensagens' || selectedProfile === 'comerciante') {
      targetSection = 'receitas-praticas';
      expandAllRecipes();
      document.querySelector('.filter-pill[data-filter="vendas"]')?.click();
    } else if (selectedGoal === 'prompt' || selectedProfile === 'estudante') {
      targetSection = 'construtor-prompt';
    }

    const targetEl = document.getElementById(targetSection);
    if (targetEl) {
      if (lenisInstance) {
        lenisInstance.scrollTo(targetEl, { offset: getScrollOffset() });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
      targetEl.style.outline = '3px solid #10b981';
      setTimeout(() => { targetEl.style.outline = 'none'; }, 2000);
    }
  });

  /* ---------------- 7. CONSTRUTOR DE PROMPTS INTERATIVO (CAPÍTULO 3) ---------------- */
  const inputPapel = document.getElementById('input-papel');
  const inputTarefa = document.getElementById('input-tarefa');
  const inputContexto = document.getElementById('input-contexto');
  const inputFormato = document.getElementById('input-formato');
  const inputTom = document.getElementById('input-tom');
  const outputPrompt = document.getElementById('output-prompt-text');
  const btnCopyBuilder = document.getElementById('btn-copy-builder');
  const copyFeedbackMsg = document.getElementById('copy-feedback-msg');
  const presetButtons = document.querySelectorAll('.preset-btn');

  function updateBuiltPrompt() {
    if (!outputPrompt) return;

    const papel = inputPapel?.value.trim() || '[Papel desejado]';
    const tarefa = inputTarefa?.value.trim() || '[Tarefa a ser realizada]';
    const contexto = inputContexto?.value.trim() || '[Informações e contexto essenciais]';
    const formato = inputFormato?.value.trim() || '[Formato da resposta]';
    const tom = inputTom?.value || 'simpático e direto';

    const promptTemplate = 
`Você é: ${papel}.
Tarefa: ${tarefa}.
Contexto: ${contexto}.
Formato: ${formato}.
Tom: ${tom}.
Antes de responder, por favor me pergunte o que faltar.`;

    outputPrompt.textContent = promptTemplate;
  }

  [inputPapel, inputTarefa, inputContexto, inputFormato, inputTom].forEach(input => {
    input?.addEventListener('input', updateBuiltPrompt);
    input?.addEventListener('change', updateBuiltPrompt);
  });

  updateBuiltPrompt();

  const presetsData = {
    loja: {
      papel: 'Atendente simpático de um comércio de bairro',
      tarefa: 'Criar um aviso sobre o atendimento no feriado',
      contexto: 'Horário habitual das 8h às 18h; no feriado atendimento até às 12h.',
      formato: 'Mensagem curta de até 40 palavras para WhatsApp',
      tom: 'simpático, acolhedor e direto'
    },
    estudo: {
      papel: 'Professor particular paciente e didático',
      tarefa: 'Explicar o que é Inteligência Artificial com analogias simples',
      contexto: 'Iniciante que tem receio de termos difíceis',
      formato: 'Texto curto em 3 tópicos com 2 perguntas de teste no fim',
      tom: 'curto, objetivo e sem enrolação'
    },
    servico: {
      papel: 'Consultor profissional de atendimento ao cliente',
      tarefa: 'Responder a um pedido de orçamento de manutenção',
      contexto: 'Visita técnica rápida; garantia de 90 dias; pagamento via Pix ou cartão',
      formato: 'Mensagem objetiva em até 45 palavras',
      tom: 'profissional, respeitoso e formal'
    },
    limpar: {
      papel: '',
      tarefa: '',
      contexto: '',
      formato: '',
      tom: 'simpático, acolhedor e direto'
    }
  };

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.getAttribute('data-preset');
      const data = presetsData[presetKey];
      if (data) {
        if (inputPapel) inputPapel.value = data.papel;
        if (inputTarefa) inputTarefa.value = data.tarefa;
        if (inputContexto) inputContexto.value = data.contexto;
        if (inputFormato) inputFormato.value = data.formato;
        if (inputTom) inputTom.value = data.tom;
        updateBuiltPrompt();
      }
    });
  });

  btnCopyBuilder?.addEventListener('click', () => {
    copyTextToClipboard(outputPrompt.textContent, () => {
      showToast('Pedido copiado com sucesso!');
      if (copyFeedbackMsg) {
        copyFeedbackMsg.classList.add('show');
        setTimeout(() => copyFeedbackMsg.classList.remove('show'), 2500);
      }
    });
  });

  /* ---------------- 8. CÓPIA INLINE DAS 10 RECEITAS ---------------- */
  document.querySelectorAll('.btn-copy-inline').forEach(btn => {
    btn.addEventListener('click', () => {
      const promptBox = btn.closest('.prompt-box-dashed');
      if (promptBox) {
        const promptTextEl = promptBox.querySelector('.prompt-text');
        if (promptTextEl) {
          const textToCopy = promptTextEl.innerText.trim();
          copyTextToClipboard(textToCopy, () => {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<span>✓ Copiado!</span>';
            showToast('Modelo copiado com sucesso!');
            setTimeout(() => { btn.innerHTML = originalHtml; }, 2000);
          });
        }
      }
    });
  });

  /* ---------------- 9. CONTROLE DE RECEITAS RECOLHIDAS ("VER MAIS") ---------------- */
  const extraRecipesWrap = document.getElementById('extra-recipes-wrap');
  const btnToggleRecipes = document.getElementById('btn-toggle-recipes');
  const toggleRecipesText = document.getElementById('toggle-recipes-text');

  function expandAllRecipes() {
    if (!extraRecipesWrap) return;
    extraRecipesWrap.classList.add('show-all');
    if (toggleRecipesText) toggleRecipesText.textContent = 'Recolher receitas (-)';
  }

  function collapseExtraRecipes() {
    if (!extraRecipesWrap) return;
    extraRecipesWrap.classList.remove('show-all');
    if (toggleRecipesText) toggleRecipesText.textContent = 'Ver todas as 10 receitas (+)';
  }

  btnToggleRecipes?.addEventListener('click', () => {
    if (extraRecipesWrap?.classList.contains('show-all')) {
      collapseExtraRecipes();
      const targetEl = document.getElementById('receitas-praticas');
      if (targetEl) {
        if (lenisInstance) lenisInstance.scrollTo(targetEl, { offset: getScrollOffset() });
        else targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      expandAllRecipes();
    }
  });

  const filterPills = document.querySelectorAll('.filter-pill');
  const recipeCards = document.querySelectorAll('.recipe-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterCat = pill.getAttribute('data-filter');

      if (filterCat !== 'all') {
        expandAllRecipes();
      }

      recipeCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterCat === 'all' || cardCat === filterCat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------------- 10. ACORDEÃO MITOS E VERDADES ---------------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      } else {
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------------- 11. ABAS DE IDADE ---------------- */
  const ageTabs = document.querySelectorAll('.age-tab');
  const agePanels = document.querySelectorAll('.age-panel');

  ageTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ageTabs.forEach(t => t.classList.remove('active'));
      agePanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(`panel-${tab.getAttribute('data-age')}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  /* ---------------- 12. BANCO DE 24 QUESTÕES & QUIZ DINÂMICO RECOLHIDO ---------------- */
  const quizIntroBox = document.getElementById('quiz-intro-box');
  const quizActiveArea = document.getElementById('quiz-active-area');
  const btnStartQuiz = document.getElementById('btn-start-quiz');
  const btnCollapseQuiz = document.getElementById('btn-collapse-quiz');
  const dynamicQuestionsContainer = document.getElementById('dynamic-questions-container');
  const quizForm = document.getElementById('quiz-form');
  const quizResultPanel = document.getElementById('quiz-result-panel');
  const scoreValEl = document.getElementById('score-val');
  const resultTitleEl = document.getElementById('result-status-title');
  const resultDescEl = document.getElementById('result-status-desc');
  const btnReloadQuiz = document.getElementById('btn-reload-quiz');

  const questionPool = [
    {
      id: 1,
      question: 'A Inteligência Artificial generativa é aquela que...',
      options: [
        { key: 'a', text: 'Só serve para destravar o celular por impressão digital.' },
        { key: 'b', text: 'Cria novos conteúdos (textos, imagens, resumos) a partir de um pedido seu.' },
        { key: 'c', text: 'Funciona apenas se o aparelho estiver desconectado da internet.' }
      ],
      correct: 'b',
      rationale: 'A Inteligência Artificial generativa gera textos e mídias originais com base no comando solicitado.'
    },
    {
      id: 2,
      question: 'Se a resposta da Inteligência Artificial foi escrita com muita segurança e vocabulário formal, isso significa que ela está 100% certa?',
      options: [
        { key: 'V', text: 'Verdadeiro' },
        { key: 'F', text: 'Falso' }
      ],
      correct: 'F',
      rationale: 'Falso! A máquina pode "alucinar" e inventar dados errados com escrita impecável.'
    },
    {
      id: 3,
      question: 'Qual informação é recomendável colocar numa conversa com a Inteligência Artificial?',
      options: [
        { key: 'a', text: 'CPF e senha de aplicativo de banco' },
        { key: 'b', text: '"Cliente A pediu um orçamento para conserto de telhado"' },
        { key: 'c', text: 'Foto da frente e verso de um documento de identidade' },
        { key: 'd', text: 'Endereço residencial completo de um vizinho' }
      ],
      correct: 'b',
      rationale: 'Usar códigos como "Cliente A" preserva a privacidade conforme a LGPD.'
    },
    {
      id: 4,
      question: 'A resposta da Inteligência Artificial veio genérica e vaga. O que você deve fazer?',
      options: [
        { key: 'a', text: 'Desistir imediatamente de usar a ferramenta.' },
        { key: 'b', text: 'Fornecer mais contexto, detalhes e pedir ajustes na conversa.' },
        { key: 'c', text: 'Enviar apenas a frase "escreva direito".' }
      ],
      correct: 'b',
      rationale: 'Conversar em etapas e alimentar o assistente com mais contexto refina a resposta.'
    },
    {
      id: 5,
      question: 'Você recebe um áudio no WhatsApp com a voz idêntica de um filho pedindo um Pix emergencial. A atitude correta é:',
      options: [
        { key: 'a', text: 'Fazer o Pix com pressa no desespero.' },
        { key: 'b', text: 'Desligar e ligar de volta no número original ou pedir a palavra-código da família.' },
        { key: 'c', text: 'Responder passando os dados do seu cartão.' }
      ],
      correct: 'b',
      rationale: 'Golpistas usam Inteligência Artificial para clonar voz! Confirme sempre por uma ligação tradicional.'
    },
    {
      id: 6,
      question: 'A Inteligência Artificial calculou o custo total e o orçamento de um serviço. Preciso conferir na calculadora?',
      options: [
        { key: 'V', text: 'Sim, sempre conferir' },
        { key: 'F', text: 'Não precisa, computador nunca erra conta' }
      ],
      correct: 'V',
      rationale: 'A Inteligência Artificial comete erros aritméticos básicos com facilidade. Sempre confira na calculadora.'
    },
    {
      id: 7,
      question: 'Para saber a dosagem correta de um remédio ou contraindicações de saúde, o correto é:',
      options: [
        { key: 'a', text: 'Perguntar e confiar exclusivamente na resposta da Inteligência Artificial.' },
        { key: 'b', text: 'Ler a bula oficial e consultar um médico ou farmacêutico.' }
      ],
      correct: 'b',
      rationale: 'Questões médicas exigem orientação profissional legalmente habilitada.'
    },
    {
      id: 8,
      question: 'Textos e imagens criados por Inteligência Artificial podem reproduzir preconceitos e estereótipos?',
      options: [
        { key: 'V', text: 'Verdadeiro' },
        { key: 'F', text: 'Falso' }
      ],
      correct: 'V',
      rationale: 'A Inteligência Artificial aprendeu com a internet e reproduz os vieses presentes na base de dados.'
    },
    {
      id: 9,
      question: 'O que significa a palavra "Prompt" no contexto de Inteligência Artificial?',
      options: [
        { key: 'a', text: 'O pedido ou comando em texto/voz que você faz para a Inteligência Artificial.' },
        { key: 'b', text: 'Um tipo de vírus que rouba senhas bancárias.' },
        { key: 'c', text: 'O cabo que liga o celular ao computador.' }
      ],
      correct: 'a',
      rationale: 'Prompt é o conjunto de instruções dadas à Inteligência Artificial para orientar o resultado.'
    },
    {
      id: 10,
      question: 'De acordo com a analogia do e-book, por que a Inteligência Artificial se parece com um "estagiário super rápido"?',
      options: [
        { key: 'a', text: 'Porque ela tem contrato formal de trabalho.' },
        { key: 'b', text: 'Porque é rápida e lê muito, mas não conhece seu negócio e precisa de supervisão humana.' },
        { key: 'c', text: 'Porque ela só trabalha meio período.' }
      ],
      correct: 'b',
      rationale: 'Ela tem volume e agilidade, mas quem confere e responde pelos atos é o humano.'
    },
    {
      id: 11,
      question: 'Ao gerar imagens com Inteligência Artificial para um cartaz ou anúncio comercial, qual cuidado com textos é recomendado?',
      options: [
        { key: 'a', text: 'Mandar a Inteligência Artificial escrever textos longos dentro do desenho.' },
        { key: 'b', text: 'Gerar a imagem sem texto e adicionar os dizeres depois num editor como o Canva.' },
        { key: 'c', text: 'Usar marcas registradas de outras empresas sem autorização.' }
      ],
      correct: 'b',
      rationale: 'IAs visuais costumam distorcer palavras escritas. Adicionar letras depois garante perfeição.'
    },
    {
      id: 12,
      question: 'Ao utilizar transcrição de áudios de clientes ou reuniões, o que é fundamental?',
      options: [
        { key: 'a', text: 'Publicar o áudio nas redes sem autorização.' },
        { key: 'b', text: 'Pedir permissão aos envolvidos e conferir dados numéricos antes de agir.' },
        { key: 'c', text: 'Nunca revisar o texto porque transcrição automática é 100% exata.' }
      ],
      correct: 'b',
      rationale: 'Gravações exigem consentimento e revisão cuidadosa de valores e prazos.'
    },
    {
      id: 13,
      question: 'Qual é a "Regra de Ouro" destacada no projeto de extensão?',
      options: [
        { key: 'a', text: 'A Inteligência Artificial é sua autoridade máxima e deve tomar todas as decisões.' },
        { key: 'b', text: 'O responsável final é sempre você; use a Inteligência Artificial como ajudante, nunca como chefe.' },
        { key: 'c', text: 'Tudo o que a máquina sugerir deve ser aplicado sem questionar.' }
      ],
      correct: 'b',
      rationale: 'O discernimento crítico e a responsabilidade civil/ética cabem ao ser humano.'
    },
    {
      id: 14,
      question: 'Para quem tem dificuldade com o teclado ou letras pequenas no celular, qual recurso facilita o uso da Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Utilizar o botão de microfone do teclado para falar suas dúvidas em voz alta.' },
        { key: 'b', text: 'Desistir de usar tecnologia moderna.' },
        { key: 'c', text: 'Comprar um teclado mecânico de computador caro.' }
      ],
      correct: 'a',
      rationale: 'A fala natural pelo microfone é acessível e converte a voz em instruções precisas.'
    },
    {
      id: 15,
      question: 'Por que estudantes não devem simplesmente colar trabalhos escolares inteiros gerados por Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Porque a Inteligência Artificial gasta muita eletricidade.' },
        { key: 'b', text: 'Porque configura plágio e anula o desenvolvimento do aprendizado próprio.' },
        { key: 'c', text: 'Porque professores nunca percebem a diferença.' }
      ],
      correct: 'b',
      rationale: 'A Inteligência Artificial deve ser usada como tutora didática para explicar e treinar, não como cola.'
    },
    {
      id: 16,
      question: 'O que significa o termo "Alucinação" em Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Quando a tela do celular começa a piscar cores estranhas.' },
        { key: 'b', text: 'Quando a máquina inventa dados, leis ou fontes falsas e as apresenta como verdades.' },
        { key: 'c', text: 'Quando o aparelho celular aquece demais ao carregar.' }
      ],
      correct: 'b',
      rationale: 'Alucinação é a produção de respostas fictícias ou errôneas com tom convicto.'
    },
    {
      id: 17,
      question: 'Quais são as "4 Checagens" essenciais antes de usar um dado importante da Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Conta, Fonte oficial, Bom senso e Profissional especializado.' },
        { key: 'b', text: 'Bateria, Sinal de rede, Memória e Antivírus.' },
        { key: 'c', text: 'Likes, Comentários, Compartilhamentos e Visualizações.' }
      ],
      correct: 'a',
      rationale: 'Verificar a conta, checar em sites oficiais, usar bom senso e consultar especialistas.'
    },
    {
      id: 18,
      question: 'Por que devemos ter cuidado extra com datas e dias da semana gerados por Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Porque a Inteligência Artificial erra correlações de calendário com muita facilidade.' },
        { key: 'b', text: 'Porque o ano tem 14 meses na linguagem da máquina.' },
        { key: 'c', text: 'Não precisamos ter cuidado nenhum.' }
      ],
      correct: 'a',
      rationale: 'A ferramenta frequentemente erra que dia da semana cai determinada data.'
    },
    {
      id: 19,
      question: 'O que é a LGPD (Lei nº 13.709/2018)?',
      options: [
        { key: 'a', text: 'Uma lei que proíbe o uso de computadores à noite.' },
        { key: 'b', text: 'A Lei Geral de Proteção de Dados Pessoais do Brasil.' },
        { key: 'c', text: 'Um plano tarifário de operadoras de telefonia móvel.' }
      ],
      correct: 'b',
      rationale: 'A LGPD protege os direitos fundamentais de liberdade e de privacidade dos cidadãos.'
    },
    {
      id: 20,
      question: 'O que é um "Deepfake"?',
      options: [
        { key: 'a', text: 'Um vídeo ou áudio simulado com Inteligência Artificial para imitar realisticamente uma pessoa real.' },
        { key: 'b', text: 'Uma foto tirada no fundo do oceano.' },
        { key: 'c', text: 'Um modelo de televisão de alta resolução.' }
      ],
      correct: 'a',
      rationale: 'Deepfakes clonam voz e fisionomia e exigem cautela redobrada contra fraudes.'
    },
    {
      id: 21,
      question: 'Qual dos 5 ingredientes do bom pedido define COMO a resposta deve ser entregue (ex: tabela, lista, texto curto)?',
      options: [
        { key: 'a', text: 'Papel' },
        { key: 'b', text: 'Formato' },
        { key: 'c', text: 'Contexto' }
      ],
      correct: 'b',
      rationale: 'O formato determina a estrutura de saída desejada (mensagem curta, tabela, tópicos).'
    },
    {
      id: 22,
      question: 'Por que pedir "Me dê 3 opções diferentes" é um truque eficiente?',
      options: [
        { key: 'a', text: 'Porque ajuda você a comparar alternativas e escolher a mais adequada.' },
        { key: 'b', text: 'Porque a ferramenta cobra mais barato por pacote de 3.' },
        { key: 'c', text: 'Porque a primeira resposta é sempre descartada pelo sistema.' }
      ],
      correct: 'a',
      rationale: 'Ter opções variadas facilita mesclar os melhores trechos com seu próprio estilo.'
    },
    {
      id: 23,
      question: 'O que protege a Lei dos Direitos Autorais (Lei nº 9.610/1998)?',
      options: [
        { key: 'a', text: 'O direito de copiar qualquer imagem da internet sem citar a fonte.' },
        { key: 'b', text: 'Os direitos dos criadores sobre suas obras intelectuais e artísticas.' },
        { key: 'c', text: 'A venda de produtos sem nota fiscal.' }
      ],
      correct: 'b',
      rationale: 'Direitos autorais protegem quem cria; não se deve reivindicar autoria de obra alheia.'
    },
    {
      id: 24,
      question: 'Em relação a custos e dinheiro, você precisa pagar para aprender a usar assistentes de Inteligência Artificial?',
      options: [
        { key: 'a', text: 'Sim, é obrigatório pagar mensalidade cara desde o primeiro clique.' },
        { key: 'b', text: 'Não, as principais ferramentas oferecem versões gratuitas suficientes para uso diário.' }
      ],
      correct: 'b',
      rationale: 'Versões gratuitas de ChatGPT, Gemini, Copilot e Meta AI cobrem com sobra o aprendizado.'
    }
  ];

  let currentSelectedQuestions = [];

  function pickRandomQuestions(pool, count = 8) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  function renderActiveQuiz() {
    currentSelectedQuestions = pickRandomQuestions(questionPool, 8);

    dynamicQuestionsContainer.innerHTML = currentSelectedQuestions.map((q, idx) => `
      <div class="quiz-card" data-index="${idx}" data-qid="${q.id}">
        <div class="q-header">
          <span class="q-num">${idx + 1}</span>
          <span class="q-title">${q.question}</span>
        </div>
        <div class="q-options">
          ${q.options.map(opt => `
            <label class="option-label">
              <input type="radio" name="quiz_q_${idx}" value="${opt.key}">
              <span>${opt.text}</span>
            </label>
          `).join('')}
        </div>
        <div class="q-feedback" id="quiz-feedback-${idx}"></div>
      </div>
    `).join('');

    if (quizResultPanel) quizResultPanel.style.display = 'none';
  }

  btnStartQuiz?.addEventListener('click', () => {
    quizIntroBox.style.display = 'none';
    quizActiveArea.style.display = 'flex';
    renderActiveQuiz();
    if (lenisInstance) {
      lenisInstance.scrollTo(quizActiveArea, { offset: getScrollOffset() });
    } else {
      quizActiveArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  btnCollapseQuiz?.addEventListener('click', () => {
    quizActiveArea.style.display = 'none';
    quizIntroBox.style.display = 'flex';
    if (lenisInstance) {
      lenisInstance.scrollTo(quizIntroBox, { offset: getScrollOffset() });
    } else {
      quizIntroBox.scrollIntoView({ behavior: 'smooth' });
    }
  });

  btnReloadQuiz?.addEventListener('click', () => {
    renderActiveQuiz();
    if (lenisInstance) {
      lenisInstance.scrollTo(quizActiveArea, { offset: getScrollOffset() });
    } else {
      quizActiveArea.scrollIntoView({ behavior: 'smooth' });
    }
    showToast('8 novas questões sorteadas!');
  });

  quizForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let score = 0;
    let allAnswered = true;

    currentSelectedQuestions.forEach((q, idx) => {
      const selected = quizForm.querySelector(`input[name="quiz_q_${idx}"]:checked`);
      const feedbackEl = document.getElementById(`quiz-feedback-${idx}`);
      const cardEl = dynamicQuestionsContainer.querySelector(`.quiz-card[data-index="${idx}"]`);

      if (!selected) {
        allAnswered = false;
        if (feedbackEl) {
          feedbackEl.className = 'q-feedback show-wrong';
          feedbackEl.textContent = 'Por favor, selecione uma resposta para esta questão.';
        }
        return;
      }

      const isCorrect = selected.value === q.correct;
      if (isCorrect) {
        score++;
        cardEl?.classList.remove('answered-wrong');
        cardEl?.classList.add('answered-correct');
        if (feedbackEl) {
          feedbackEl.className = 'q-feedback show-correct';
          feedbackEl.innerHTML = `<strong>Correto!</strong> ${q.rationale}`;
        }
      } else {
        cardEl?.classList.remove('answered-correct');
        cardEl?.classList.add('answered-wrong');
        if (feedbackEl) {
          feedbackEl.className = 'q-feedback show-wrong';
          feedbackEl.innerHTML = `<strong>Incorreto.</strong> ${q.rationale}`;
        }
      }
    });

    if (!allAnswered) {
      showToast('Responda todas as 8 questões para ver sua nota!');
      return;
    }

    if (scoreValEl) scoreValEl.textContent = score;

    if (score >= 7) {
      resultTitleEl.textContent = 'Excelente! Você está preparado(a) para usar a Inteligência Artificial com segurança!';
      resultDescEl.textContent = 'Você compreendeu a fundo os 5 ingredientes do prompt, a proteção de dados (LGPD) e a importância do bom senso humano.';
    } else if (score >= 4) {
      resultTitleEl.textContent = 'Bom resultado! Vale a pena revisar alguns pontos.';
      resultDescEl.textContent = 'Você já assimilou boa parte do guia. Sugerimos revisar o Capítulo 7 sobre Segurança e Cuidados contra Golpes.';
    } else {
      resultTitleEl.textContent = 'Vamos praticar mais um pouco!';
      resultDescEl.textContent = 'O aprendizado é passo a passo. Volte ao Capítulo 3, teste os prompts com calma e tente o simulado novamente.';
    }

    if (quizResultPanel) {
      quizResultPanel.style.display = 'block';
      if (lenisInstance) {
        lenisInstance.scrollTo(quizResultPanel, { offset: getScrollOffset() });
      } else {
        quizResultPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  /* ---------------- 13. BUSCA RÁPIDA NO GLOSSÁRIO ---------------- */
  const glossarySearch = document.getElementById('glossary-search');
  const glossaryItems = document.querySelectorAll('.glossary-item');

  glossarySearch?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    glossaryItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? 'block' : 'none';
    });
  });

  /* ---------------- 14. ASSISTENTE DE LEITURA EM VOZ ALTA (ACESSIBILIDADE / IDOSOS) ---------------- */
  const btnToggleTts = document.getElementById('btn-toggle-tts');
  const ttsWidget = document.getElementById('tts-floating-widget');
  const btnStopTts = document.getElementById('btn-stop-tts');
  const btnCloseTtsWidget = document.getElementById('btn-close-tts-widget');
  const ttsStatusLabel = document.getElementById('tts-status-label');
  const ttsDragHandle = document.getElementById('tts-drag-handle');

  let isTtsActive = false;
  let synth = window.speechSynthesis;

  function stopSpeaking() {
    if (synth) synth.cancel();
    if (ttsStatusLabel) ttsStatusLabel.textContent = 'Modo Ouvir Ativo';
  }

  function speakText(text) {
    if (!synth || !text || text.trim() === '') return;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    utterance.onstart = () => {
      if (ttsStatusLabel) ttsStatusLabel.textContent = 'Lendo em voz alta...';
    };

    utterance.onend = () => {
      if (ttsStatusLabel) ttsStatusLabel.textContent = 'Modo Ouvir Ativo';
    };

    utterance.onerror = () => {
      if (ttsStatusLabel) ttsStatusLabel.textContent = 'Modo Ouvir Ativo';
    };

    synth.speak(utterance);
  }

  function activateTtsMode() {
    isTtsActive = true;
    btnToggleTts?.classList.add('active');
    if (ttsWidget) ttsWidget.style.display = 'block';
    showToast('Modo de Voz ativado! Clique em qualquer texto para ouvir.');
  }

  function deactivateTtsMode() {
    isTtsActive = false;
    stopSpeaking();
    btnToggleTts?.classList.remove('active');
    if (ttsWidget) ttsWidget.style.display = 'none';
    document.querySelectorAll('.tts-hover-highlight').forEach(el => el.classList.remove('tts-hover-highlight'));
  }

  btnToggleTts?.addEventListener('click', () => {
    if (isTtsActive) deactivateTtsMode();
    else activateTtsMode();
  });

  btnStopTts?.addEventListener('click', stopSpeaking);
  btnCloseTtsWidget?.addEventListener('click', deactivateTtsMode);

  document.addEventListener('mouseover', (e) => {
    if (!isTtsActive) return;
    const target = e.target.closest('p, h1, h2, h3, h4, li, .prompt-text, .advice-card, .feature-card, .recipe-card');
    document.querySelectorAll('.tts-hover-highlight').forEach(el => el.classList.remove('tts-hover-highlight'));
    if (target && !ttsWidget.contains(target)) {
      target.classList.add('tts-hover-highlight');
    }
  });

  document.addEventListener('click', (e) => {
    if (!isTtsActive) return;
    if (ttsWidget.contains(e.target) || e.target.closest('#btn-toggle-tts')) return;

    const target = e.target.closest('p, h1, h2, h3, h4, li, .prompt-text, .advice-card, .feature-card, .recipe-card');
    if (target) {
      const textToRead = target.innerText;
      speakText(textToRead);
    }
  });

  // Arrastar e Soltar o Microfone sobre o Texto
  let isDraggingMic = false;

  if (ttsDragHandle) {
    ttsDragHandle.addEventListener('mousedown', (e) => {
      if (e.target.closest('button')) return;
      isDraggingMic = true;
      document.body.classList.add('tts-active-drag');
    });

    document.addEventListener('mouseup', (e) => {
      if (isDraggingMic) {
        isDraggingMic = false;
        document.body.classList.remove('tts-active-drag');

        const elemUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
        const textElem = elemUnderCursor?.closest('p, h1, h2, h3, h4, li, .prompt-text, .advice-card, .feature-card, .recipe-card');
        if (textElem && !ttsWidget.contains(textElem)) {
          speakText(textElem.innerText);
        }
      }
    });

    ttsDragHandle.addEventListener('touchstart', (e) => {
      if (e.target.closest('button')) return;
      isDraggingMic = true;
      document.body.classList.add('tts-active-drag');
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (isDraggingMic) {
        isDraggingMic = false;
        document.body.classList.remove('tts-active-drag');
        const touch = e.changedTouches[0];
        const elemUnderCursor = document.elementFromPoint(touch.clientX, touch.clientY);
        const textElem = elemUnderCursor?.closest('p, h1, h2, h3, h4, li, .prompt-text, .advice-card, .feature-card, .recipe-card');
        if (textElem && !ttsWidget.contains(textElem)) {
          speakText(textElem.innerText);
        }
      }
    }, { passive: true });
  }

});
