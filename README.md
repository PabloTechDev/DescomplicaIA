# IA sem Complicação — Guia Prático para o Dia a Dia
### Projeto de Extensão Universitária II · Universidade Paulista (UNIP Campus Anchieta)
**Autor & Desenvolvedor:** Pablo Alexandre de Vasconcelos  
**Curso:** Bacharelado em Ciência da Computação  
**Programa Institucional:** Programa 8: Inova Mais UNIP (Área Temática: Tecnologia e Produção)  
**Linhas de Extensão:** Inovação Tecnológica, Tecnologias Sociais, Inclusão Digital e Empreendedorismo  
**Regulamentação:** Resolução CNE/CES nº 7/2018

---

## 📌 Visão Geral do Projeto

O **IA sem Complicação** é uma aplicação web concisa, interativa e *mobile-first*, estruturada a partir do e-book oficial do projeto de extensão. Seu objetivo principal é **democratizar o uso prático, crítico, ético e seguro de ferramentas de Inteligência Artificial para a comunidade leiga** (pequenos comerciantes, autônomos, estudantes, pessoas idosas e famílias).

---

## 🚀 Principais Melhorias e Funcionalidades Implementadas

1. **Correção Definitiva da Navegação Mobile:**
   - O menu hambúrguer foi totalmente isolado com `visibility: hidden; transform: translateX(100%);` e bloqueio de transbordo (`overflow-x: hidden`), impedindo que o menu apareça ao arrastar a tela para o lado no celular.
2. **Lupa de Busca Inteligente:**
   - Botão de pesquisa no topo com modal rápido. Busca termos a partir de 2 letras (evitando sobrecarga com letras isoladas) e leva o usuário diretamente à seção desejada com destaque visual (*highlight*).
3. **Assistente Guiado "Estou Perdido: Por Onde Começo?":**
   - Filtro amigável onde o usuário escolhe seu perfil (*Idoso, Comerciante, Estudante, Iniciante*) e seu objetivo imediato (*Falar por voz, Criar avisos, Prevenção a golpes, Prompts*), sendo encaminhado para o conteúdo ideal.
4. **Assistente de Leitura em Voz Alta (Acessibilidade para Idosos / Dificuldade de Leitura):**
   - Botão *"Ouvir Página"* que ativa um widget flutuante de áudio (`Web Speech API`).
   - O usuário pode tocar em qualquer frase ou card para ouvi-la com clareza.
   - Permite também arrastar o ícone de microfone: a tela recebe uma suave tonalidade verde e, ao soltar sobre um parágrafo, a leitura começa imediatamente.
   - Botão de parada imediata (⏹) e encerramento fácil (✕) para não confundir o usuário.
5. **Seção de 10 Receitas Prontas Recolhida com "Ver Mais":**
   - Apresenta inicialmente os primeiros modelos de forma compacta e disponibiliza o botão *"Ver todas as 10 receitas (+)"*. Clicar em qualquer filtro de categoria (*Vendas, Rotina, Custos, etc.*) expande automaticamente os cards correspondentes.
6. **Quiz Dinâmico com Banco de 24 Questões:**
   - Inicia recolhido com um banner amigável para não poluir a leitura da página.
   - Ao clicar em *"Iniciar o Questionário"*, sorteia aleatoriamente **8 questões** de um banco de 24 perguntas baseadas no e-book.
   - Toda vez que o usuário refaz o teste, novas questões são sorteadas.
   - Correção imediata, justificativa pedagógica e cálculo de nota com diagnóstico oficial.
7. **Design Conciso, Sóbrio e Sem Excesso de Emojis:**
   - Textos enxutos, diretos ao ponto e desprovidos de redundâncias.
   - Substituição de emojis por ícones inline em formato SVG limpo.
   - Fim dos efeitos de brilho ou poluição visual, mantendo a paleta elegante do e-book.
8. **Fontes Oficiais e Governamentais Ampliadas:**
   - Inclusão de referências de alto prestígio: ANPD (LGPD), CERT.br / CGI.br (Segurança contra golpes), MCTI (EBIA), Senado Federal (Marco Legal da IA - PL 2338/2023), Procon-SP, UNESCO e OCDE.
9. **Autoria e Redes Oficiais:**
   - Rodapé configurado com os links oficiais de **Pablo Alexandre de Vasconcelos**:
     - GitHub: [https://github.com/PabloTechDev](https://github.com/PabloTechDev)
     - LinkedIn: [https://www.linkedin.com/in/pablo-vsc](https://www.linkedin.com/in/pablo-vsc)

---

## 💻 Como Abrir e Executar

1. Abra a pasta do projeto:
   ```bash
   cd "c:\Users\pablo\Projetos\Extensão II"
   ```
2. Abra o arquivo `index.html` em qualquer navegador:
   ```powershell
   Start-Process index.html
   ```

---

## 🎓 Alinhamento com a Extensão Universitária II da UNIP

- **Inclusão Digital Real:** Linguagem acessível sem jargões para pessoas de qualquer idade.
- **Formação Cidadã & Ética:** Cuidado com a privacidade (LGPD), combate à desinformação, defesa contra golpes e prevenção ao plágio.
- **Protagonismo Discente:** Desenvolvido integralmente por **Pablo Alexandre de Vasconcelos** como contribuição acadêmica e social à comunidade.
