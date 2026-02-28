import { useState, useEffect, useCallback, useRef } from "react";

// ══════════════════════════════════════════════════════════════
// FAROL 360° — Instituto Salto (Produção v1.3 FINAL)
// Consolidado + URL do Apps Script atualizada
// ══════════════════════════════════════════════════════════════

// ═══ CONFIGURAÇÃO ═══
const API_URL =
  "https://script.google.com/macros/s/AKfycbyhstntlV4upgV1MICswuebVYKYaTcJAayuOGA02trY3y5d6GIynt_Eq4iCKOt5jdYY/exec";
const IS_DEV = API_URL.includes("COLE_SUA_URL_AQUI");

// ── Competencies (14 competências: P1(4) + P2(5) + P3(5)) ──
const COMPETENCIES = {
  "1.1": {
    dimension: "P1",
    dimName: "Propósito",
    name: "Conduz a escola com visão clara e compartilhada",
    descriptors: {
      1: "Reconhece a importância de uma visão para a escola, mas ainda atua de forma reativa, com pouca clareza sobre prioridades e sem envolver a equipe no planejamento.",
      2: "Comunica metas básicas, define algumas prioridades de forma mais explícita e começa a envolver a equipe na revisão do PPP, ainda sem constância ou sistematização.",
      3: "Constrói visão clara com a comunidade, usa o PPP para orientar decisões, revisa prioridades com regularidade e mobiliza a equipe em torno de objetivos comuns.",
      4: "Sua escola tem visão reconhecida na rede; sistematiza processos de participação e inspira outras unidades a construir projetos consistentes e colaborativos.",
    },
  },
  "1.2": {
    dimension: "P1",
    dimName: "Propósito",
    name: "Coloca a aprendizagem e o desenvolvimento integral no centro",
    descriptors: {
      1: "Reconhece os desafios de aprendizagem, mas ainda prioriza demandas administrativas acima das pedagógicas.",
      2: "Dedica mais tempo às decisões pedagógicas e começa a usar dados básicos para compreender resultados de aprendizagem.",
      3: "Organiza tempo e recursos para garantir foco pedagógico; usa dados para orientar ações; articula acolhimento, inclusão e rigor acadêmico.",
      4: "É reconhecido por sua capacidade de orientar a escola para a aprendizagem com equidade e compartilha estratégias com outras escolas e redes.",
    },
  },
  "1.3": {
    dimension: "P1",
    dimName: "Propósito",
    name: "Age como líder público comprometido com o interesse coletivo",
    descriptors: {
      1: "Demonstra boa vontade, mas ainda enfrenta dificuldades para tomar decisões transparentes e coerentes em contextos de pressão.",
      2: "Busca justificativas técnicas para decisões, comunica com mais clareza e começa a fortalecer processos éticos junto à equipe.",
      3: "Decide com integridade, justiça e transparência; lida com conflitos com firmeza; mantém coerência entre discurso e prática.",
      4: "Torna-se exemplo de liderança ética na rede; orienta outros gestores; suas práticas influenciam formações, diretrizes e políticas de gestão.",
    },
  },
  "1.4": {
    dimension: "P1",
    dimName: "Propósito",
    name: "Sustenta uma cultura de altas expectativas com acolhimento",
    descriptors: {
      1: "Demonstra preocupação com desempenho, mas comunica expectativas de forma irregular ou pouco alinhada ao apoio a estudantes e equipe.",
      2: "Passa a combinar exigência com apoio; reforça metas; reconhece avanços, ainda sem manter uma rotina consistente de acompanhamento.",
      3: "Constrói cultura em que estudantes e profissionais se sentem apoiados e desafiados; usa feedback, reconhecimento e diálogo para sustentar altas expectativas.",
      4: "Sua escola é reconhecida pelo clima de altas expectativas e pertencimento; compartilha práticas que inspiram outras unidades a fortalecer sua cultura escolar.",
    },
  },

  "2.1": {
    dimension: "P2",
    dimName: "Pedagogia",
    name: "Observa, acompanha e apoia o trabalho pedagógico",
    descriptors: {
      1: "Realiza visitas de sala pontuais, geralmente motivadas por problemas. Oferece orientações gerais, ainda pouco conectadas às necessidades reais da prática docente.",
      2: "Organiza uma rotina básica de observação e registra aspectos essenciais. Dá feedbacks mais específicos e acolhedores, ainda sem acompanhamento sistemático ao longo do tempo.",
      3: "Mantém rotina consistente de observações; oferece feedback formativo claro, construtivo e baseado em evidências; acompanha planos pedagógicos e apoia docentes em metas de desenvolvimento.",
      4: "Sistematiza práticas de acompanhamento usadas por outros gestores; forma pares; constrói cultura de prática reflexiva sustentada por ciclos regulares de observação e feedback.",
    },
  },
  "2.2": {
    dimension: "P2",
    dimName: "Pedagogia",
    name: "Usa dados de aprendizagem para orientar decisões",
    descriptors: {
      1: "Tem acesso a dados, mas utiliza pouco. As decisões pedagógicas ainda se baseiam mais em impressões do que em informações sistemáticas.",
      2: "Passa a analisar resultados básicos do cotidiano pedagógico (participação, avaliações internas, frequência) e começa a relacioná-los com práticas de sala de aula.",
      3: "Analisa diferentes fontes de dados pedagógicos, identifica desigualdades de aprendizagem, cruza indicadores, compartilha achados com a equipe e planeja ações focalizadas.",
      4: "Torna-se referência no uso pedagógico de dados; promove formações sobre análise de dados; inspira e apoia outras escolas a implementarem estratégias de monitoramento.",
    },
  },
  "2.3": {
    dimension: "P2",
    dimName: "Pedagogia",
    name: "Promove formação docente contínua e relevante",
    descriptors: {
      1: "Organiza formações de forma reativa, baseadas em demandas emergenciais ou orientações externas, sem conexão clara com prioridades pedagógicas.",
      2: "Planeja formações mais alinhadas ao PPP, identifica necessidades da equipe e começa a integrar momentos de estudo e troca.",
      3: "Constrói plano sólido de formação contínua, articula especialistas, promove práticas colaborativas, conecta teoria e prática e garante tempo protegido para aprender.",
      4: "Sua escola se torna polo de aprendizagem; sistematiza experiências formativas; participa de redes de desenvolvimento docente e influencia políticas de formação.",
    },
  },
  "2.4": {
    dimension: "P2",
    dimName: "Pedagogia",
    name: "Integra currículo, avaliação e metodologias",
    descriptors: {
      1: "Reconhece documentos curriculares, mas a articulação entre o que se ensina, como se ensina e como se avalia ainda é pouco clara na escola.",
      2: "Estabelece diálogos mais frequentes com docentes sobre currículo e avaliação; incentiva ajustes pontuais em metodologias.",
      3: "Cria coerência entre currículo, metodologias, tempos, espaços e avaliações; apoia o uso de instrumentos variados; garante alinhamento entre planejamento e prática.",
      4: "Contribui para revisões curriculares da rede; sistematiza práticas de integração; inspira escolas a fortalecer coerência pedagógica e foco em aprendizagens essenciais.",
    },
  },
  "2.5": {
    dimension: "P2",
    dimName: "Pedagogia",
    name: "Articula estratégias de inclusão e personalização",
    descriptors: {
      1: "Reconhece a diversidade dos estudantes, mas apoia ações inclusivas apenas de maneira pontual.",
      2: "Organiza adaptações básicas, inicia diálogo com profissionais de apoio e identifica necessidades específicas de grupos ou estudantes.",
      3: "Sustenta planos articulados de inclusão (PAEs, AEE, adaptações curriculares, acessibilidade); garante participação de todos; apoia docentes a diferenciar estratégias.",
      4: "É reconhecido pela condução ética e eficaz de inclusão; compartilha práticas com a rede; forma docentes e gestores sobre atendimento, equidade e personalização.",
    },
  },

  "3.1": {
    dimension: "P3",
    dimName: "Pessoas",
    name: "Desenvolve e acompanha profissionais da escola",
    descriptors: {
      1: "Faz orientações pontuais, geralmente reativas. Ainda não realiza conversas sistemáticas sobre desenvolvimento ou acompanhamento da prática.",
      2: "Organiza conversas individuais com alguns profissionais, define metas básicas e acompanha avanços de maneira irregular, ainda com pouca sistematização.",
      3: "Mantém rotina de desenvolvimento profissional com toda a equipe; define metas claras; oferece orientação específica; registra avanços e ajusta planos.",
      4: "Acompanha e desenvolve equipes de forma inspiradora; forma outros gestores sobre coaching educacional; sistematiza práticas de acompanhamento usadas pela rede.",
    },
  },
  "3.2": {
    dimension: "P3",
    dimName: "Pessoas",
    name: "Cultiva segurança psicológica e colaboração",
    descriptors: {
      1: "Demonstra abertura ao diálogo, mas ainda existe medo, silêncio ou desconfiança na equipe. Conflitos são deixados de lado ou tratados superficialmente.",
      2: "Cria espaços de fala e escuta, estabelece rotinas básicas de colaboração e intervém quando há tensões mais evidentes.",
      3: "Constrói ambiente em que as pessoas dizem a verdade sem medo; incentiva colaboração real; acolhe vulnerabilidades; combate rumores e fofocas com práticas de transparência.",
      4: "É referência em segurança psicológica na rede; contribui com formações sobre cultura organizacional e colaboração para outros gestores e escolas.",
    },
  },
  "3.3": {
    dimension: "P3",
    dimName: "Pessoas",
    name: "Enfrenta discriminações e conflitos com justiça",
    descriptors: {
      1: "Hesita em intervir diante de situações de racismo, machismo, LGBTfobia, assédio ou violência. As respostas são lentas ou pouco firmes.",
      2: "Enfrenta discriminações com mais rapidez e procura apoio quando necessário; comunica com mais clareza a posição da escola.",
      3: "Intervém com justiça e firmeza sempre que há discriminação ou violência, documentando casos e acionando a rede de proteção; protege estudantes e profissionais com postura ética.",
      4: "É exemplo de atuação ética e conduz formações sobre convivência e direitos; inspira políticas da rede e apoia outros gestores na condução de casos complexos.",
    },
  },
  "3.4": {
    dimension: "P3",
    dimName: "Pessoas",
    name: "Organiza o trabalho com clareza e respeito",
    descriptors: {
      1: "A equipe tem dúvidas frequentes sobre papéis, responsabilidades e expectativas. Tarefas são distribuídas de forma ambígua.",
      2: "Melhora a distribuição de funções e estabelece rotinas mais claras na escola; há ajustes visíveis nos fluxos de comunicação.",
      3: "Garante clareza de funções, processos, horários e rotinas, reduzindo ambiguidades e facilitando o trabalho pedagógico; comunica decisões com transparência.",
      4: "É reconhecido por estruturar equipes de forma eficiente e humana, sendo referência na rede; apoia outras escolas a revisarem suas práticas de organização.",
    },
  },
  "3.5": {
    dimension: "P3",
    dimName: "Pessoas",
    name: "Promove bem-estar profissional e apoio mútuo",
    descriptors: {
      1: "Reconhece dificuldades da equipe, mas o suporte oferecido é informal e irregular. Falta atenção estruturada ao bem-estar.",
      2: "Adota práticas de apoio como momentos de escuta, encaminhamentos e ajustes de rotina; há espaços de convivência e cuidado, mesmo que pontuais.",
      3: "Promove cultura de apoio mútuo, observa sinais de sobrecarga e organiza estratégias preventivas de bem-estar; equilibra demandas com saúde dos profissionais.",
      4: "É referência em bem-estar profissional e contribui para políticas de valorização docente; inspira outras escolas a adotarem práticas estruturadas de apoio.",
    },
  },
};

// ── Question Bank ──
const QUESTIONS = {
  "1.1": {
    1: [
      { id: "1.1_L1_Q1", text: "O gestor costuma tomar decisões de forma reativa, sem uma direção clara de prioridades para a escola?" },
      { id: "1.1_L1_Q2", text: "Você percebe que a equipe tem dificuldade em saber quais são as prioridades da gestão?" },
    ],
    2: [
      { id: "1.1_L2_Q1", text: "O gestor comunica metas para a escola e envolve a equipe em conversas sobre o PPP, mesmo que ainda de forma irregular?" },
      { id: "1.1_L2_Q2", text: "Você percebe que ele define prioridades de forma mais explícita do que antes, ainda que sem uma rotina fixa de revisão?" },
    ],
    3: [
      { id: "1.1_L3_Q1", text: "O gestor constrói a visão da escola com a participação da comunidade e usa o PPP como referência real para decisões do dia a dia?" },
      { id: "1.1_L3_Q2", text: "Ele revisa prioridades com regularidade e mobiliza a equipe em torno de objetivos comuns?" },
    ],
    4: [
      { id: "1.1_L4_Q1", text: "A escola deste gestor é reconhecida na rede como tendo um projeto educativo claro e bem construído?" },
      { id: "1.1_L4_Q2", text: "Ele inspira ou apoia outras escolas a construírem seus próprios projetos de forma participativa?" },
    ],
  },

  "1.2": {
    1: [
      { id: "1.2_L1_Q1", text: "Você percebe que demandas administrativas ainda ocupam mais tempo e atenção do gestor do que as questões pedagógicas?" },
      { id: "1.2_L1_Q2", text: "Quando surgem decisões importantes, o impacto na aprendizagem dos estudantes costuma ficar em segundo plano?" },
    ],
    2: [
      { id: "1.2_L2_Q1", text: "O gestor tem dedicado mais tempo a decisões pedagógicas e começa a olhar dados de aprendizagem para entender resultados?" },
      { id: "1.2_L2_Q2", text: "Você nota que ele está mudando o equilíbrio entre o administrativo e o pedagógico, mesmo que ainda sem consistência plena?" },
    ],
    3: [
      { id: "1.2_L3_Q1", text: "O gestor organiza tempo e recursos da escola com foco claro na aprendizagem, articulando acolhimento, inclusão e rigor acadêmico?" },
      { id: "1.2_L3_Q2", text: "Ele usa dados de forma regular para orientar ações pedagógicas e garantir que a aprendizagem seja prioridade?" },
    ],
    4: [
      { id: "1.2_L4_Q1", text: "Este gestor é reconhecido na rede por sua capacidade de orientar a escola para a aprendizagem com equidade?" },
      { id: "1.2_L4_Q2", text: "Ele compartilha estratégias com outras escolas ou redes sobre como manter o foco na aprendizagem?" },
    ],
  },

  "1.3": {
    1: [
      { id: "1.3_L1_Q1", text: "Você percebe que o gestor tem dificuldade em tomar decisões transparentes quando está sob pressão?" },
      { id: "1.3_L1_Q2", text: "Há situações em que as decisões parecem pouco coerentes ou motivadas por fatores que não são o interesse coletivo?" },
    ],
    2: [
      { id: "1.3_L2_Q1", text: "O gestor busca justificativas técnicas para suas decisões e comunica com mais clareza os motivos por trás delas?" },
      { id: "1.3_L2_Q2", text: "Você percebe esforço crescente para fortalecer processos éticos e transparentes junto à equipe?" },
    ],
    3: [
      { id: "1.3_L3_Q1", text: "O gestor decide com integridade, justiça e transparência, mesmo em situações difíceis ou impopulares?" },
      { id: "1.3_L3_Q2", text: "Ele mantém coerência entre o que diz e o que faz, enfrentando conflitos com firmeza e ética?" },
    ],
    4: [
      { id: "1.3_L4_Q1", text: "Este gestor é visto como exemplo de liderança ética na rede ou no município?" },
      { id: "1.3_L4_Q2", text: "Ele orienta ou forma outros gestores sobre práticas de gestão ética e transparente?" },
    ],
  },

  "1.4": {
    1: [
      { id: "1.4_L1_Q1", text: "As expectativas de desempenho são comunicadas de forma irregular, sem uma conexão clara com apoio a estudantes e equipe?" },
      { id: "1.4_L1_Q2", text: "Você percebe que falta uma rotina de acompanhamento que combine exigência com suporte?" },
    ],
    2: [
      { id: "1.4_L2_Q1", text: "O gestor está combinando mais exigência com apoio, reforçando metas e reconhecendo avanços, mesmo que sem rotina fixa?" },
      { id: "1.4_L2_Q2", text: "Você nota que ele começa a expressar expectativas mais altas, acompanhadas de gestos concretos de suporte?" },
    ],
    3: [
      { id: "1.4_L3_Q1", text: "O gestor sustenta uma cultura onde estudantes e profissionais se sentem ao mesmo tempo apoiados e desafiados?" },
      { id: "1.4_L3_Q2", text: "Ele usa feedback, reconhecimento e diálogo como ferramentas para manter altas expectativas com acolhimento?" },
    ],
    4: [
      { id: "1.4_L4_Q1", text: "A escola deste gestor é reconhecida pelo clima de altas expectativas e pertencimento?" },
      { id: "1.4_L4_Q2", text: "Ele compartilha práticas que inspiram outras escolas a fortalecer sua cultura de excelência e acolhimento?" },
    ],
  },

  "2.1": {
    1: [
      { id: "2.1_L1_Q1", text: "As visitas do gestor às salas de aula são pontuais e geralmente motivadas por problemas específicos?" },
      { id: "2.1_L1_Q2", text: "As orientações que ele dá aos professores são genéricas, pouco conectadas às necessidades reais de cada docente?" },
    ],
    2: [
      { id: "2.1_L2_Q1", text: "O gestor organiza uma rotina básica de observação de aulas e dá feedbacks mais específicos e acolhedores?" },
      { id: "2.1_L2_Q2", text: "Ele registra o que observa, mesmo que ainda sem um acompanhamento sistemático ao longo do tempo?" },
    ],
    3: [
      { id: "2.1_L3_Q1", text: "O gestor mantém rotina consistente de observações e oferece feedback formativo claro, construtivo e baseado em evidências?" },
      { id: "2.1_L3_Q2", text: "Ele acompanha planos pedagógicos dos docentes e apoia cada professor em metas individuais de desenvolvimento?" },
    ],
    4: [
      { id: "2.1_L4_Q1", text: "As práticas de acompanhamento deste gestor são usadas como referência por outros gestores ou pela rede?" },
      { id: "2.1_L4_Q2", text: "Ele forma pares ou contribui para construir uma cultura de prática reflexiva sustentada por ciclos regulares de observação?" },
    ],
  },

  "2.2": {
    1: [
      { id: "2.2_L1_Q1", text: "Você percebe que o gestor tem acesso a dados, mas as decisões pedagógicas se baseiam mais em impressões do que em informações sistemáticas?" },
      { id: "2.2_L1_Q2", text: "Os dados de aprendizagem são pouco discutidos com a equipe no dia a dia?" },
    ],
    2: [
      { id: "2.2_L2_Q1", text: "O gestor analisa resultados básicos e começa a relacioná-los com práticas de sala de aula?" },
      { id: "2.2_L2_Q2", text: "Ele compartilha dados de aprendizagem com os professores, mesmo que de forma esporádica?" },
    ],
    3: [
      { id: "2.2_L3_Q1", text: "O gestor analisa diferentes fontes de dados, identifica desigualdades de aprendizagem e cruza indicadores para planejar ações focalizadas?" },
      { id: "2.2_L3_Q2", text: "Ele compartilha achados com a equipe de forma regular e usa dados para tomar decisões pedagógicas concretas?" },
    ],
    4: [
      { id: "2.2_L4_Q1", text: "Este gestor é referência no uso pedagógico de dados, promovendo inclusive formações sobre análise de dados?" },
      { id: "2.2_L4_Q2", text: "Ele inspira e apoia outras escolas a implementarem estratégias de monitoramento baseadas em evidências?" },
    ],
  },

  "2.3": {
    1: [
      { id: "2.3_L1_Q1", text: "As formações na escola são reativas, sem conexão com prioridades pedagógicas?" },
      { id: "2.3_L1_Q2", text: "Falta um plano de formação contínua alinhado ao PPP da escola?" },
    ],
    2: [
      { id: "2.3_L2_Q1", text: "O gestor planeja formações mais alinhadas às prioridades da escola e identifica necessidades da equipe?" },
      { id: "2.3_L2_Q2", text: "Há momentos de estudo e troca entre os docentes, mesmo que ainda sem uma rotina consolidada?" },
    ],
    3: [
      { id: "2.3_L3_Q1", text: "O gestor construiu um plano sólido de formação contínua que conecta teoria e prática?" },
      { id: "2.3_L3_Q2", text: "Ele articula especialistas, promove práticas colaborativas e garante tempo protegido para aprender?" },
    ],
    4: [
      { id: "2.3_L4_Q1", text: "A escola deste gestor se tornou um polo de aprendizagem para a rede?" },
      { id: "2.3_L4_Q2", text: "Ele sistematiza experiências formativas e influencia políticas de formação?" },
    ],
  },

  "2.4": {
    1: [
      { id: "2.4_L1_Q1", text: "A articulação entre o que se ensina, como se ensina e como se avalia ainda é pouco clara na escola?" },
      { id: "2.4_L1_Q2", text: "Você percebe que currículo, avaliação e metodologias funcionam de forma desconectada?" },
    ],
    2: [
      { id: "2.4_L2_Q1", text: "O gestor tem dialogado mais com os docentes sobre currículo e avaliação?" },
      { id: "2.4_L2_Q2", text: "Há esforço visível para aproximar planejamento e prática, mesmo que de forma inicial?" },
    ],
    3: [
      { id: "2.4_L3_Q1", text: "O gestor cria coerência entre currículo, metodologias, tempos, espaços e avaliações na escola?" },
      { id: "2.4_L3_Q2", text: "Ele apoia o uso de instrumentos variados de avaliação e garante alinhamento entre o que se planeja e o que se pratica?" },
    ],
    4: [
      { id: "2.4_L4_Q1", text: "Este gestor contribui para revisões curriculares da rede ou sistematiza práticas de integração pedagógica?" },
      { id: "2.4_L4_Q2", text: "Ele inspira outras escolas a fortalecer a coerência entre currículo, avaliação e metodologias?" },
    ],
  },

  "2.5": {
    1: [
      { id: "2.5_L1_Q1", text: "O gestor reconhece a diversidade dos estudantes, mas o apoio a ações inclusivas ainda é pontual?" },
      { id: "2.5_L1_Q2", text: "Faltam estratégias estruturadas para atender estudantes com necessidades específicas?" },
    ],
    2: [
      { id: "2.5_L2_Q1", text: "O gestor organiza adaptações básicas e iniciou diálogo com profissionais de apoio?" },
      { id: "2.5_L2_Q2", text: "Há ações de inclusão acontecendo, mesmo que ainda sem um plano articulado?" },
    ],
    3: [
      { id: "2.5_L3_Q1", text: "O gestor sustenta planos articulados de inclusão e garante a participação de todos?" },
      { id: "2.5_L3_Q2", text: "Ele apoia docentes a diferenciar estratégias para intervenções pedagógicas diferenciadas?" },
    ],
    4: [
      { id: "2.5_L4_Q1", text: "Este gestor é reconhecido pela condução ética e eficaz de inclusão na escola e na rede?" },
      { id: "2.5_L4_Q2", text: "Ele forma docentes e gestores sobre atendimento, equidade e personalização?" },
    ],
  },

  "3.1": {
    1: [
      { id: "3.1_L1_Q1", text: "As orientações do gestor aos profissionais são pontuais e reativas, sem conversas sistemáticas sobre desenvolvimento?" },
      { id: "3.1_L1_Q2", text: "Faltam momentos estruturados de acompanhamento da prática da equipe?" },
    ],
    2: [
      { id: "3.1_L2_Q1", text: "O gestor organiza conversas individuais com alguns profissionais e define metas básicas?" },
      { id: "3.1_L2_Q2", text: "Há acompanhamento de avanços, mesmo que de maneira irregular?" },
    ],
    3: [
      { id: "3.1_L3_Q1", text: "O gestor mantém rotina de desenvolvimento profissional com toda a equipe, com metas claras e registro de avanços?" },
      { id: "3.1_L3_Q2", text: "Ele ajusta planos de desenvolvimento com base no que observa no dia a dia?" },
    ],
    4: [
      { id: "3.1_L4_Q1", text: "Este gestor acompanha e desenvolve equipes de forma inspiradora, sendo referência para outros gestores?" },
      { id: "3.1_L4_Q2", text: "Ele forma pares sobre coaching educacional ou sistematiza práticas que a rede utiliza?" },
    ],
  },

  "3.2": {
    1: [
      { id: "3.2_L1_Q1", text: "Você percebe que ainda existe medo, silêncio ou desconfiança na equipe?" },
      { id: "3.2_L1_Q2", text: "Conflitos são deixados de lado ou tratados de forma superficial?" },
    ],
    2: [
      { id: "3.2_L2_Q1", text: "O gestor cria espaços de fala e escuta e estabelece rotinas básicas de colaboração?" },
      { id: "3.2_L2_Q2", text: "Ele intervém quando há tensões mais evidentes?" },
    ],
    3: [
      { id: "3.2_L3_Q1", text: "Na escola deste gestor, as pessoas dizem a verdade sem medo, e há colaboração real?" },
      { id: "3.2_L3_Q2", text: "Ele acolhe vulnerabilidades, combate rumores e sustenta práticas de transparência?" },
    ],
    4: [
      { id: "3.2_L4_Q1", text: "A escola deste gestor é reconhecida por ter um clima saudável e colaborativo?" },
      { id: "3.2_L4_Q2", text: "Ele contribui com formações sobre cultura organizacional e segurança psicológica?" },
    ],
  },

  "3.3": {
    1: [
      { id: "3.3_L1_Q1", text: "O gestor hesita em intervir diante de situações de racismo, machismo, LGBTfobia, assédio ou violência?" },
      { id: "3.3_L1_Q2", text: "As respostas a discriminações são lentas ou pouco firmes?" },
    ],
    2: [
      { id: "3.3_L2_Q1", text: "O gestor enfrenta discriminações com mais rapidez e procura apoio quando necessário?" },
      { id: "3.3_L2_Q2", text: "Ele comunica com mais firmeza a posição da escola diante de situações de discriminação?" },
    ],
    3: [
      { id: "3.3_L3_Q1", text: "O gestor intervém com justiça e firmeza sempre que há discriminação, documentando casos e acionando a rede de proteção?" },
      { id: "3.3_L3_Q2", text: "Ele protege estudantes e profissionais com postura ética, sem hesitação?" },
    ],
    4: [
      { id: "3.3_L4_Q1", text: "Este gestor é exemplo de atuação ética e conduz formações sobre convivência e direitos?" },
      { id: "3.3_L4_Q2", text: "Ele inspira políticas da rede e apoia outros gestores na condução de casos complexos?" },
    ],
  },

  "3.4": {
    1: [
      { id: "3.4_L1_Q1", text: "A equipe tem dúvidas frequentes sobre papéis, responsabilidades e expectativas?" },
      { id: "3.4_L1_Q2", text: "As tarefas são distribuídas de forma ambígua, gerando retrabalho ou conflitos?" },
    ],
    2: [
      { id: "3.4_L2_Q1", text: "O gestor melhora a distribuição de funções e estabelece rotinas mais claras?" },
      { id: "3.4_L2_Q2", text: "Há ajustes visíveis nos fluxos de comunicação e organização do trabalho?" },
    ],
    3: [
      { id: "3.4_L3_Q1", text: "O gestor garante clareza de funções, processos e rotinas, reduzindo ambiguidades?" },
      { id: "3.4_L3_Q2", text: "Ele comunica decisões com transparência e a equipe sabe o que se espera de cada um?" },
    ],
    4: [
      { id: "3.4_L4_Q1", text: "Este gestor é reconhecido por estruturar equipes de forma eficiente e humana?" },
      { id: "3.4_L4_Q2", text: "Ele apoia outras escolas a revisarem suas práticas de organização do trabalho?" },
    ],
  },

  "3.5": {
    1: [
      { id: "3.5_L1_Q1", text: "O gestor reconhece dificuldades da equipe, mas o suporte oferecido é informal e irregular?" },
      { id: "3.5_L1_Q2", text: "Falta atenção estruturada ao bem-estar emocional e profissional da equipe?" },
    ],
    2: [
      { id: "3.5_L2_Q1", text: "O gestor adota práticas de apoio como momentos de escuta e ajustes de rotina?" },
      { id: "3.5_L2_Q2", text: "Há espaços de convivência e cuidado com a equipe, mesmo que pontuais?" },
    ],
    3: [
      { id: "3.5_L3_Q1", text: "O gestor promove cultura de apoio mútuo e organiza estratégias preventivas de bem-estar?" },
      { id: "3.5_L3_Q2", text: "Ele equilibra demandas da escola com a saúde dos profissionais de forma consciente?" },
    ],
    4: [
      { id: "3.5_L4_Q1", text: "Este gestor é referência em bem-estar profissional e contribui para políticas de valorização docente?" },
      { id: "3.5_L4_Q2", text: "Ele inspira outras escolas a adotarem práticas estruturadas de apoio?" },
    ],
  },
};

const LEVEL_NAMES = { 1: "Inicial", 2: "Em Desenvolvimento", 3: "Avançado", 4: "Referência" };
const LEVEL_COLORS = { 1: "#E57024", 2: "#F5A623", 3: "#7B61FF", 4: "#5B2E91" };
const EVIDENCE_SOURCES = ["Observação direta (vi acontecer)", "Relato de terceiros (alguém me contou)", "Documentos ou registros da escola", "Reuniões ou encontros formais"];
const RESPONSE_OPTIONS = ["Sim, observei isso", "Observei parcialmente", "Não observei", "Não sei avaliar"];

// ── API helpers ──
async function apiGet(params) {
  const ctrl = new AbortController();
  const timeout = params?.action === "validate" ? 20000 : 12000;
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const url = API_URL + "?" + new URLSearchParams(params).toString();
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return { error: `Erro do servidor (${r.status}). Tente novamente.` };
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      if (IS_DEV) console.warn("API response (not JSON):", text.slice(0, 200));
      return { error: "Resposta inesperada do servidor." };
    }
  } catch (e) {
    if (e.name === "AbortError") return { error: "Conexão lenta. Tente novamente em alguns segundos." };
    return { error: "Sem conexão. Verifique sua internet." };
  } finally {
    clearTimeout(t);
  }
}

async function apiPost(body) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!r.ok) return { error: `Erro do servidor (${r.status}). Tente novamente.` };
    const text = await r.text();
    try {
      return JSON.parse(text);
    } catch {
      if (IS_DEV) console.warn("API response (not JSON):", text.slice(0, 200));
      return { error: "Resposta inesperada do servidor." };
    }
  } catch (e) {
    if (e.name === "AbortError") return { error: "Conexão lenta. Tente novamente." };
    return { error: "Sem conexão. Verifique sua internet." };
  } finally {
    clearTimeout(t);
  }
}

// ── Helpers ──
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── selectQuestions — IDs únicos garantidos via Set ──
function selectQuestions(competencyId, selectedLevel) {
  const q = QUESTIONS[competencyId];
  if (!q) return [];
  const used = new Set();
  const result = [];

  function add(item, type, level) {
    if (!item || used.has(item.id)) return;
    result.push({ id: item.id, text: item.text, level, type });
    used.add(item.id);
  }
  function pickUnused(pool, level, type) {
    if (!pool || pool.length === 0) return;
    const available = pool.filter((p) => !used.has(p.id));
    const pick = available.length > 0 ? pickRandom(available) : pickRandom(pool);
    add(pick, type, level);
  }
  function safePool(level) {
    return q[level] && q[level].length > 0 ? q[level] : null;
  }

  if (selectedLevel === 1) {
    const p1 = safePool(1),
      p2 = safePool(2);
    if (p1) {
      const v = shuffle([...p1]);
      v.forEach((x) => add(x, "validation", 1));
    }
    if (p2) {
      const s = shuffle([...p2]);
      s.forEach((x) => add(x, "probe", 2));
    }
  } else if (selectedLevel === 4) {
    const p3 = safePool(3),
      p4 = safePool(4);
    if (p3) {
      const c = shuffle([...p3]);
      c.forEach((x) => add(x, "calibration", 3));
    }
    if (p4) {
      const v = shuffle([...p4]);
      v.forEach((x) => add(x, "validation", 4));
    }
  } else {
    const below = safePool(selectedLevel - 1),
      curr = safePool(selectedLevel),
      above = safePool(selectedLevel + 1);
    if (below) pickUnused(below, selectedLevel - 1, "calibration");
    if (curr) {
      const v = shuffle([...curr]);
      v.forEach((x) => add(x, "validation", selectedLevel));
    }
    if (above) pickUnused(above, selectedLevel + 1, "probe");
  }

  return shuffle(result);
}

// ── Coherence — trata undefined e "Não sei" ──
function calculateCoherence(responses, questions) {
  const valIndexes = questions.map((q, i) => (q.type === "validation" ? i : -1)).filter((i) => i >= 0);
  const valResps = valIndexes.map((i) => responses[i] || "Não sei avaliar");
  const valid = valResps.filter((r) => r !== "Não sei avaliar");
  const naoSeiCount = valResps.length - valid.length;
  const naoSeiPct = valResps.length > 0 ? Math.round((naoSeiCount / valResps.length) * 100) : 0;

  if (valid.length === 0) return { score: "INDETERMINADO", nao_sei_pct: naoSeiPct, valid_count: 0 };

  const yesCount = valid.filter((r) => r === "Sim, observei isso").length;
  const noCount = valid.filter((r) => r === "Não observei").length;

  let score;
  if (yesCount >= 1 && noCount === 0) score = "ALTO";
  else if (noCount === valid.length) score = "BAIXO";
  else score = "MÉDIO";

  if (naoSeiCount > 0 && score === "ALTO") score = "MÉDIO";

  return { score, nao_sei_pct: naoSeiPct, valid_count: valid.length };
}

// ── SVG Logo ──
function Logo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <defs>
        <linearGradient id="lg" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E57024" />
          <stop offset="100%" stopColor="#5B2E91" />
        </linearGradient>
        <linearGradient id="bg" x1="0" y1="12" x2="64" y2="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E57024" stopOpacity="0" />
          <stop offset="50%" stopColor="#E57024" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E57024" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="14" rx="28" ry="6" fill="url(#bg)" opacity="0.4" />
      <path d="M26 22L28 56H36L38 22Z" fill="url(#lg)" />
      <rect x="27" y="30" width="10" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="27.5" y="40" width="9" height="4" rx="1" fill="white" opacity="0.9" />
      <rect x="25" y="17" width="14" height="7" rx="3" fill="#5B2E91" />
      <rect x="28" y="18" width="8" height="5" rx="2" fill="#E57024" opacity="0.9" />
      <path d="M29 12L32 8L35 12Z" fill="#5B2E91" />
      <rect x="24" y="54" width="16" height="4" rx="2" fill="#5B2E91" opacity="0.8" />
      <circle cx="32" cy="20" r="3" fill="#FFD700" opacity="0.6" />
    </svg>
  );
}

function StepDots({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "16px 0" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 28 : 10,
            height: 10,
            borderRadius: 5,
            background: i < current ? "#5B2E91" : i === current ? "#E57024" : "#E0E0E0",
            transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      ))}
    </div>
  );
}

export default function Farol360() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [token, setToken] = useState("");
  const [evalData, setEvalData] = useState(null);
  const [evidenceSource, setEvidenceSource] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qResponses, setQResponses] = useState({});
  const [evidenceText, setEvidenceText] = useState("");
  const [evidenceLinks, setEvidenceLinks] = useState("");
  const [instSupport, setInstSupport] = useState("");
  const [progRating, setProgRating] = useState(null);
  const [progSuggestion, setProgSuggestion] = useState("");
  const [coherence, setCoherence] = useState(null);
  const [showNudge, setShowNudge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [evaluationId, setEvaluationId] = useState(null);
  const [submitFallback, setSubmitFallback] = useState(null);
  const [submitWarning, setSubmitWarning] = useState(null);
  const [startTime] = useState(new Date().toISOString());
  const [animateIn, setAnimateIn] = useState(true);
  const mainRef = useRef(null);
  const snapshotRef = useRef(null);

  // Token extraction (aceita ?t=... OU ?token=...)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("t") || p.get("token") || "";
    if (!t && !IS_DEV) {
      setError("Link inválido. Nenhum token encontrado. Use o link exato que recebeu.");
      setLoading(false);
      return;
    }
    setToken(t || "demo");
  }, []);

  // Validate token
  useEffect(() => {
    if (!token) return;

    setStep(0);
    setEvidenceSource("");
    setSelectedLevel(null);
    setQuestions([]);
    setQResponses({});
    setEvidenceText("");
    setEvidenceLinks("");
    setInstSupport("");
    setProgRating(null);
    setProgSuggestion("");
    setCoherence(null);
    setSubmitError(null);
    setSubmitFallback(null);
    setSubmitWarning(null);
    setSubmitted(false);
    setAlreadySubmitted(false);
    setEvaluationId(null);
    setLoading(true);

    if (IS_DEV) {
      setEvalData({
        evaluator: { id: "A001", name: "Maria Santos", role: "Mentora", token: "demo" },
        manager: {
          id: "G001",
          name: "João Oliveira",
          school: "EM Monteiro Lobato",
          municipality: "Porto Alegre",
          network: "Municipal",
          competencyId: "2.1",
          selfLevel: 2,
          cycle: "T1-2026",
        },
      });
      setLoading(false);
      return;
    }

    apiGet({ action: "validate", token }).then((d) => {
      if (d.already_submitted) setAlreadySubmitted(true);
      else if (d.valid) setEvalData(d);
      else setError(d.error || "Token inválido");
      setLoading(false);
    });
  }, [token]);

  // Generate questions
  useEffect(() => {
    if (selectedLevel && evalData) {
      setQuestions(selectQuestions(evalData.manager.competencyId, selectedLevel));
      setQResponses({});
    }
  }, [selectedLevel, evalData]);

  // Autosave
  const draftFailCount = useRef(0);
  const draftTimer = useRef(null);
  const lastDraftHash = useRef("");

  useEffect(() => {
    snapshotRef.current = {
      step,
      selectedLevel,
      evidenceSource,
      qResponses,
      evidenceText: evidenceText.slice(0, 4000),
      evidenceLinks: evidenceLinks.slice(0, 2000),
      instSupport: instSupport.slice(0, 2000),
      progRating,
      progSuggestion,
    };
  }, [step, selectedLevel, evidenceSource, qResponses, evidenceText, evidenceLinks, instSupport, progRating, progSuggestion]);

  useEffect(() => {
    if (!evalData?.evaluator?.id || !token || submitted || IS_DEV || error) return;

    let cancelled = false;

    function scheduleDraft() {
      if (cancelled) return;
      const delay = draftFailCount.current >= 3 ? 60000 : 15000;

      draftTimer.current = setTimeout(async () => {
        if (!cancelled && snapshotRef.current && snapshotRef.current.step >= 2) {
          const hash = JSON.stringify(snapshotRef.current);
          if (hash !== lastDraftHash.current) {
            const res = await apiPost({
              action: "draft",
              token,
              evaluator_id: evalData.evaluator.id,
              snapshot: snapshotRef.current,
            });
            if (res.error) draftFailCount.current++;
            else {
              draftFailCount.current = 0;
              lastDraftHash.current = hash;
            }
          }
        }
        if (!cancelled) scheduleDraft();
      }, delay);
    }

    scheduleDraft();
    return () => {
      cancelled = true;
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [evalData, submitted, token, error]);

  // goTo
  const goToTimer = useRef(null);
  useEffect(() => {
    return () => {
      if (goToTimer.current) clearTimeout(goToTimer.current);
    };
  }, []);

  const goTo = useCallback((s) => {
    setAnimateIn(false);
    if (goToTimer.current) clearTimeout(goToTimer.current);
    goToTimer.current = setTimeout(() => {
      setStep(s);
      setAnimateIn(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 250);
  }, []);

  const competency = evalData ? COMPETENCIES[evalData.manager.competencyId] : null;
  const hasQuestionBank = evalData ? Boolean(QUESTIONS[evalData.manager.competencyId]) : false;
  const allAnswered = questions.length > 0 && questions.every((_, i) => RESPONSE_OPTIONS.includes(qResponses[i]));
  const wc = evidenceText.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (submitting || submitted) return;

    if (!selectedLevel) {
      setSubmitError("Selecione um nível antes de enviar.");
      return;
    }
    if (!evidenceSource) {
      setSubmitError("Selecione a fonte de evidência.");
      return;
    }
    if (!allAnswered) {
      setSubmitError("Responda todas as perguntas.");
      return;
    }
    if (!evidenceText.trim()) {
      setSubmitError("Descreva uma situação concreta.");
      return;
    }

    setSubmitError(null);
    setSubmitFallback(null);
    setSubmitWarning(null);
    setSubmitting(true);

    const coh = calculateCoherence(questions.map((_, i) => qResponses[i] ?? "Não sei avaliar"), questions);
    setCoherence(coh);

    const normalizedLinks = [
      ...new Set(
        evidenceLinks
          .split(/\s+/)
          .map((l) => l.trim())
          .filter((l) => l.startsWith("http://") || l.startsWith("https://"))
      ),
    ].slice(0, 20);

    const payload = {
      action: "submit",
      token,
      evaluator_id: evalData.evaluator.id,
      gestor_id: evalData.manager.id,
      competency: evalData.manager.competencyId,
      cycle: evalData.manager.cycle,
      selected_level: selectedLevel,
      evidence_source: evidenceSource,
      coherence_score: coh.score,
      coherence_nao_sei_pct: coh.nao_sei_pct,
      coherence_valid_count: coh.valid_count,
      timestamp_start: startTime,
      timestamp_end: new Date().toISOString(),
      evidence_text: evidenceText.slice(0, 4000),
      evidence_links: normalizedLinks,
      institutional_support: instSupport.slice(0, 2000),
      program_rating: progRating,
      program_suggestion: progSuggestion,
      questions: questions.map((q, i) => ({
        id: q.id,
        text: q.text,
        type: q.type,
        level: q.level,
        response: qResponses[i] || "Não respondida",
      })),
      device: [navigator.platform, navigator.language].filter(Boolean).join(" / "),
    };

    if (!IS_DEV) {
      const res = await apiPost(payload);

      if (res.error) {
        const fallback = `AVALIAÇÃO FAROL 360° — CÓPIA DE SEGURANÇA

Gestor: ${evalData.manager.name}
Competência: ${evalData.manager.competencyId}
Nível: ${selectedLevel} (${LEVEL_NAMES[selectedLevel]})
Fonte: ${evidenceSource}

EVIDÊNCIA:
${evidenceText.slice(0, 4000)}

RESPOSTAS:
${questions.map((q, i) => `${i + 1}. ${q.text} → ${qResponses[i] || "Não respondida"}`).join("\n")}

APOIO SUGERIDO:
${instSupport || "(vazio)"}

PROGRAMA: ${progRating !== null ? progRating + "/10" : "(não avaliou)"}
${progSuggestion || ""}`;

        setSubmitError(`Não foi possível enviar: ${res.error}

Se o problema persistir, copie seus dados abaixo e envie ao coordenador.`);
        setSubmitFallback(fallback);
        setSubmitting(false);
        return;
      }

      if (res.evaluation_id) setEvaluationId(res.evaluation_id);
      if (res.partial) {
        setSubmitWarning(
          "Avaliação registrada, mas pode ter ocorrido erro parcial. Protocolo: " +
            (res.evaluation_id || evaluationId || "") +
            ". Se possível, avise o coordenador."
        );
      }
    }

    setSubmitted(true);
    setSubmitting(false);
    goTo(6);
  };

  if (loading) {
    return (
      <div style={S.center}>
        <Logo size={64} />
        <p style={{ color: "#999", marginTop: 16 }}>Carregando avaliação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={S.center}>
        <Logo size={64} />
        <h2 style={{ color: "#5B2E91", marginTop: 16 }}>Link inválido</h2>
        <p style={{ color: "#666", maxWidth: 320, textAlign: "center", lineHeight: 1.6 }}>{error}</p>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div style={S.center}>
        <div style={{ fontSize: 48 }}>✅</div>
        <h2 style={{ color: "#5B2E91" }}>Avaliação já enviada</h2>
        <p style={{ color: "#666" }}>Obrigado! Sua avaliação já foi registrada.</p>
      </div>
    );
  }

  if (!evalData) return null;

  const ev = evalData.evaluator,
    mg = evalData.manager;

  return (
    <div style={S.wrap}>
      <div style={S.bgEl} />

      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logo size={36} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#5B2E91", letterSpacing: 1 }}>FAROL 360°</div>
            <div style={{ fontSize: 10, color: "#999", letterSpacing: 2 }}>INSTITUTO SALTO</div>
          </div>
        </div>
        {step > 0 && step < 6 && <StepDots current={step - 1} total={5} />}
      </header>

      <main
        style={{
          ...S.main,
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.35s ease",
        }}
      >
        {/* STEP 0 */}
        {step === 0 && (
          <div style={S.card}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Logo size={72} />
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#5B2E91", margin: "12px 0 4px" }}>Farol 360°</h1>
              <p style={{ fontSize: 14, color: "#888" }}>Avaliação de Gestores Escolares</p>
            </div>
            <div style={S.info}>
              <p style={{ margin: 0, fontSize: 14, color: "#555", lineHeight: 1.6 }}>
                Você foi convidado(a) a contribuir com sua percepção sobre a prática de um(a) gestor(a) escolar. Sua avaliação é confidencial e ajudará no desenvolvimento profissional dele(a).
              </p>
            </div>
            <p style={{ fontSize: 13, color: "#888", textAlign: "center", margin: "16px 0 0" }}>⏱ Tempo estimado: 5 a 8 minutos</p>
            <button style={S.btn} onClick={() => goTo(1)}>
              Começar avaliação
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div style={S.card}>
            <div style={S.stepLabel}>Etapa 1 de 5</div>
            <h2 style={S.h2}>Confirme seus dados</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0" }}>
              {[
                ["Seu nome", ev.name],
                ["Sua função", ev.role],
                ["Gestor(a) avaliado(a)", mg.name],
                ["Escola", mg.school],
                ["Competência em foco", `${mg.competencyId} — ${competency?.name}`],
              ].map(([l, v]) => (
                <div key={l}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#999", textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</span>
                  <div style={{ fontSize: 15, color: l === "Competência em foco" ? "#5B2E91" : "#333", fontWeight: l === "Competência em foco" ? 600 : 500 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: "#F0ECF5", margin: "20px 0" }} />

            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#5B2E91", margin: "0 0 8px" }}>Fonte principal das suas observações</h3>

            <div role="radiogroup" aria-label="Fonte de evidência" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {EVIDENCE_SOURCES.map((src) => (
                <button
                  key={src}
                  role="radio"
                  aria-checked={evidenceSource === src}
                  onClick={() => setEvidenceSource(src)}
                  style={{
                    ...S.opt,
                    borderColor: evidenceSource === src ? "#5B2E91" : "#E0E0E0",
                    background: evidenceSource === src ? "#F3EBF9" : "#fff",
                    color: evidenceSource === src ? "#5B2E91" : "#444",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      border: `2px solid ${evidenceSource === src ? "#5B2E91" : "#ccc"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {evidenceSource === src && <span style={{ width: 10, height: 10, borderRadius: 5, background: "#5B2E91" }} />}
                  </span>
                  <span style={{ fontSize: 14 }}>{src}</span>
                </button>
              ))}
            </div>

            <button
              style={{ ...S.btn, opacity: evidenceSource ? 1 : 0.4, pointerEvents: evidenceSource ? "auto" : "none" }}
              onClick={() => goTo(2)}
            >
              Confirmo — avançar
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={S.card}>
            <div style={S.stepLabel}>Etapa 2 de 5</div>

            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#5B2E91",
                background: "#F3EBF9",
                padding: "4px 10px",
                borderRadius: 20,
                display: "inline-block",
                marginBottom: 8,
              }}
            >
              {competency?.dimension} · {competency?.dimName}
            </div>

            <h2 style={{ ...S.h2, fontSize: 18 }}>
              {mg.competencyId} — {competency?.name}
            </h2>

            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: "0 0 16px" }}>
              Leia os 4 descritores e selecione o nível que melhor representa a prática atual:
            </p>

            <div role="radiogroup" aria-label="Nível de prática" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[1, 2, 3, 4].map((lv) => (
                <button
                  key={lv}
                  role="radio"
                  aria-checked={selectedLevel === lv}
                  onClick={() => setSelectedLevel(lv)}
                  style={{
                    padding: "14px 16px",
                    border: `2px solid ${selectedLevel === lv ? LEVEL_COLORS[lv] : "#E8E8E8"}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    background: selectedLevel === lv ? `${LEVEL_COLORS[lv]}08` : "#fff",
                    boxShadow: selectedLevel === lv ? `0 0 0 2px ${LEVEL_COLORS[lv]}30` : "none",
                    transition: "all 0.25s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        background: LEVEL_COLORS[lv],
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      {lv}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: LEVEL_COLORS[lv], textTransform: "uppercase" }}>{LEVEL_NAMES[lv]}</span>
                    {selectedLevel === lv && <span style={{ marginLeft: "auto", fontSize: 18 }}>✓</span>}
                  </div>

                  <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5 }}>{competency?.descriptors[lv]}</p>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={S.btn2} onClick={() => goTo(1)}>
                ← Voltar
              </button>
              <button
                style={{
                  ...S.btn,
                  flex: 1,
                  margin: 0,
                  opacity: selectedLevel && hasQuestionBank ? 1 : 0.4,
                  pointerEvents: selectedLevel && hasQuestionBank ? "auto" : "none",
                }}
                onClick={() => goTo(3)}
              >
                Avançar →
              </button>
            </div>

            {!hasQuestionBank && <div style={S.errorBox}>Banco de perguntas não encontrado para esta competência. Contate o coordenador.</div>}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div style={S.card}>
            <div style={S.stepLabel}>Etapa 3 de 5</div>
            <h2 style={S.h2}>Perguntas sobre a prática</h2>

            {questions.length === 0 ? (
              <div style={S.info}>
                <p style={{ margin: 0, fontSize: 14, color: "#C62828", lineHeight: 1.6 }}>
                  Não foi possível carregar as perguntas para esta competência. Tente voltar e selecionar o nível novamente.
                </p>
                <button style={{ ...S.btn2, marginTop: 12 }} onClick={() => goTo(2)}>
                  ← Voltar para seleção de nível
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 14, color: "#666", margin: "0 0 16px" }}>
                  Com base no nível <strong style={{ color: LEVEL_COLORS[selectedLevel] }}>{LEVEL_NAMES[selectedLevel]}</strong> selecionado:
                </p>

                {questions.map((q, qi) => (
                  <div key={qi} style={{ padding: "16px 0", borderBottom: "1px solid #F5F3F8" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 10 }}>
                      <span
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 800,
                          color: "#fff",
                          flexShrink: 0,
                          background: "#5B2E91",
                        }}
                      >
                        {qi + 1}
                      </span>
                      <p style={{ margin: 0, fontSize: 14, color: "#333", lineHeight: 1.5, flex: 1 }}>{q.text}</p>
                    </div>

                    <div role="radiogroup" aria-label={`Resposta para pergunta ${qi + 1}`} style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 30 }}>
                      {RESPONSE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          role="radio"
                          aria-checked={qResponses[qi] === opt}
                          onClick={() => setQResponses((p) => ({ ...p, [qi]: opt }))}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            border: `1.5px solid ${qResponses[qi] === opt ? "#5B2E91" : "#E8E8E8"}`,
                            borderRadius: 8,
                            background: qResponses[qi] === opt ? "#F3EBF9" : "#FAFAFA",
                            cursor: "pointer",
                            fontSize: 13,
                            textAlign: "left",
                            color: qResponses[qi] === opt ? "#5B2E91" : "#555",
                            fontWeight: qResponses[qi] === opt ? 600 : 400,
                            transition: "all 0.15s",
                          }}
                        >
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              border: `2px solid ${qResponses[qi] === opt ? "#5B2E91" : "#ccc"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {qResponses[qi] === opt && <span style={{ width: 8, height: 8, borderRadius: 4, background: "#5B2E91" }} />}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button style={S.btn2} onClick={() => goTo(2)}>
                    ← Voltar
                  </button>
                  <button style={{ ...S.btn, flex: 1, margin: 0, opacity: allAnswered ? 1 : 0.4, pointerEvents: allAnswered ? "auto" : "none" }} onClick={() => goTo(4)}>
                    Avançar →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div style={S.card}>
            <div style={S.stepLabel}>Etapa 4 de 5</div>
            <h2 style={S.h2}>Evidências e complementos</h2>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>
                Descreva uma situação concreta <span style={{ color: "#E57024" }}>*</span>
              </label>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 4px" }}>
                Dica: inclua o contexto (quando/onde), a ação do gestor e o efeito que você observou.
              </p>
              <textarea
                value={evidenceText}
                onChange={(e) => {
                  setEvidenceText(e.target.value);
                  setShowNudge(false);
                }}
                placeholder="Ex: Durante a reunião pedagógica de março, o gestor apresentou dados de frequência por turma e propôs ações específicas para cada caso..."
                style={S.ta}
                rows={5}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 11, color: wc < 30 ? "#E57024" : "#4CAF50" }}>{wc} palavras</span>
                {wc >= 30 && <span style={{ fontSize: 11, color: "#4CAF50" }}>✓ Boa descrição!</span>}
              </div>

              {showNudge && wc < 30 && (
                <div style={S.nudge}>
                  💡 Sua resposta está curta. Tente incluir: contexto + ação do gestor + efeito observado. Isso torna o feedback muito mais útil.
                </div>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>
                Links complementares <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                value={evidenceLinks}
                onChange={(e) => setEvidenceLinks(e.target.value)}
                placeholder={"Cole links para vídeos, fotos ou documentos.\nUm link por linha."}
                style={S.ta}
                rows={2}
              />
              <p style={{ fontSize: 11, color: "#999", margin: "4px 0 0" }}>⚠️ Evite informações sensíveis de estudantes.</p>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>
                Apoio institucional sugerido <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                value={instSupport}
                onChange={(e) => setInstSupport(e.target.value)}
                placeholder="Que apoio da escola ou da secretaria poderia ajudar este gestor?"
                style={S.ta}
                rows={3}
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={S.btn2} onClick={() => goTo(3)}>
                ← Voltar
              </button>
              <button
                style={{ ...S.btn, flex: 1, margin: 0, opacity: evidenceText.trim() ? 1 : 0.4, pointerEvents: evidenceText.trim() ? "auto" : "none" }}
                onClick={() => {
                  if (wc < 30 && !showNudge) {
                    setShowNudge(true);
                    return;
                  }
                  goTo(5);
                }}
              >
                {wc < 30 && !showNudge ? "Verificar →" : "Avançar →"}
              </button>
            </div>

            {showNudge && wc < 30 && (
              <button style={S.ghost} onClick={() => goTo(5)}>
                Enviar mesmo assim →
              </button>
            )}
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div style={S.card}>
            <div style={S.stepLabel}>Etapa 5 de 5</div>
            <h2 style={S.h2}>Sobre o Programa de Formação</h2>
            <p style={{ fontSize: 14, color: "#666", margin: "0 0 16px" }}>Esta seção é opcional e separada da avaliação do gestor.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Como você avalia o processo formativo do Instituto Salto?</label>
              <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", margin: "12px 0" }}>
                {Array.from({ length: 11 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setProgRating(i)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: `2px solid ${progRating === i ? "#5B2E91" : "#E0E0E0"}`,
                      background: progRating === i ? "#5B2E91" : "#FAFAFA",
                      color: progRating === i ? "#fff" : "#555",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#999" }}>
                <span>Nada satisfeito</span>
                <span>Muito satisfeito</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>
                Sugestão <span style={{ color: "#999", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea value={progSuggestion} onChange={(e) => setProgSuggestion(e.target.value)} placeholder="Sua sugestão nos ajuda a melhorar..." style={S.ta} rows={3} />
            </div>

            {submitError && <div style={S.errorBox}>{submitError}</div>}

            {submitFallback && (
              <div style={{ marginBottom: 12 }}>
                <textarea readOnly value={submitFallback} style={{ ...S.ta, fontSize: 11, background: "#FFF8E1", height: 120 }} />
                <button
                  style={{ ...S.ghost, color: "#5B2E91", textDecoration: "none", fontWeight: 600 }}
                  onClick={() => {
                    navigator.clipboard?.writeText(submitFallback);
                  }}
                >
                  📋 Copiar dados da avaliação
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={S.btn2} onClick={() => goTo(4)}>
                ← Voltar
              </button>
              <button
                style={{ ...S.btn, flex: 1, margin: 0, background: "linear-gradient(135deg, #5B2E91, #E57024)" }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Enviando..." : "✨ Enviar avaliação"}
              </button>
            </div>

            <button style={S.ghost} onClick={handleSubmit} disabled={submitting}>
              Enviar avaliação sem feedback do programa
            </button>
          </div>
        )}

        {/* STEP 6 */}
        {step === 6 && submitted && (
          <div style={{ ...S.card, textAlign: "center" }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
            <h2 style={{ ...S.h2, color: "#5B2E91" }}>Avaliação enviada!</h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
              Obrigado, <strong>{ev.name}</strong>. Sua contribuição é muito valiosa para o desenvolvimento de <strong>{mg.name}</strong>.
            </p>

            <div style={{ ...S.info, background: "#F3EBF9", borderLeft: "4px solid #5B2E91", textAlign: "left" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#5B2E91", fontWeight: 600, marginBottom: 4 }}>Resumo da avaliação</p>
              <p style={{ margin: 0, fontSize: 13, color: "#555" }}>
                Competência: <strong>{mg.competencyId} — {competency?.name}</strong>
                <br />
                Nível: <strong style={{ color: LEVEL_COLORS[selectedLevel] }}>{LEVEL_NAMES[selectedLevel]}</strong>
                <br />
                Fonte: <strong>{evidenceSource}</strong>
              </p>
              {evaluationId && <p style={{ margin: "8px 0 0", fontSize: 11, color: "#999" }}>Protocolo: {evaluationId}</p>}
            </div>

            {submitWarning && (
              <div style={{ ...S.info, background: "#FFF8E1", borderLeft: "4px solid #E57024", textAlign: "left", marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#E57024" }}>⚠️ {submitWarning}</p>
              </div>
            )}

            {IS_DEV && coherence && (
              <div style={{ ...S.info, background: "#F5F5F5", borderLeft: "4px solid #999", textAlign: "left", marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1 }}>Debug (somente dev)</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
                  Coerência: <strong>{coherence.score}</strong> · Válidas: {coherence.valid_count} · Não sei: {coherence.nao_sei_pct}%
                </p>
              </div>
            )}

            <p style={{ fontSize: 12, color: "#999", marginTop: 20 }}>Você pode fechar esta janela.</p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 20, opacity: 0.5 }}>
              <Logo size={24} />
              <span style={{ fontSize: 12, color: "#999" }}>Farol 360° · Instituto Salto</span>
            </div>
          </div>
        )}
      </main>

      {step > 0 && step < 6 && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            zIndex: 20,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 3, background: "#4CAF50" }} />
          <span style={{ fontSize: 10, color: "#999" }}>{IS_DEV ? "Modo demonstração" : "Rascunho automático ativo"}</span>
        </div>
      )}
    </div>
  );
}

const S = {
  wrap: { minHeight: "100vh", background: "#F7F5FA", fontFamily: "'Source Sans 3', 'Segoe UI', system-ui, sans-serif", position: "relative" },
  bgEl: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    backgroundImage:
      "radial-gradient(circle at 15% 15%, #5B2E9108 0%, transparent 50%), radial-gradient(circle at 85% 85%, #E5702408 0%, transparent 50%)",
    pointerEvents: "none",
  },
  header: { position: "sticky", top: 0, zIndex: 10, padding: "12px 20px", background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #EEE", display: "flex", flexDirection: "column", gap: 4 },
  main: { position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", padding: "16px 16px 100px" },
  card: { background: "#fff", borderRadius: 16, padding: "24px 20px", boxShadow: "0 2px 20px rgba(91,46,145,0.06), 0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #F0ECF5" },
  h2: { fontSize: 20, fontWeight: 700, color: "#2D2D2D", margin: "0 0 8px", lineHeight: 1.3 },
  stepLabel: { fontSize: 11, fontWeight: 700, color: "#E57024", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 },
  info: { background: "#F7F5FA", borderRadius: 12, padding: "14px 16px", margin: "12px 0" },
  label: { display: "block", fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 6 },
  btn: { display: "block", width: "100%", padding: "14px 24px", marginTop: 20, background: "#5B2E91", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },
  btn2: { padding: "14px 18px", background: "#F7F5FA", color: "#5B2E91", border: "1px solid #E0D6EC", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  ghost: { display: "block", width: "100%", padding: 10, background: "transparent", color: "#999", border: "none", fontSize: 13, cursor: "pointer", textDecoration: "underline", marginTop: 8 },
  opt: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "2px solid #E0E0E0", borderRadius: 10, background: "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
  ta: { width: "100%", padding: "12px 14px", border: "2px solid #E8E8E8", borderRadius: 10, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.5, background: "#FAFAFA" },
  nudge: { marginTop: 8, padding: "12px 14px", background: "#FFF8E1", borderRadius: 10, fontSize: 13, color: "#8D6E00", lineHeight: 1.5, border: "1px solid #FFE082" },
  errorBox: { padding: "12px 14px", background: "#FFEBEE", borderRadius: 10, fontSize: 13, color: "#C62828", lineHeight: 1.5, border: "1px solid #FFCDD2", marginBottom: 12 },
  center: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "'Source Sans 3', system-ui, sans-serif", textAlign: "center" },
};