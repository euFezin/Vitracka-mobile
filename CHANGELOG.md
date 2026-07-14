# Changelog — Vitracka Mobile

Todas as mudanças relevantes do projeto serão documentadas neste arquivo.

O formato segue o padrão de versionamento semântico.

## [0.2.1-alpha] - 2026-07-14

### Adicionado

- **Tela de Métricas**: nova tela dedicada ao histórico de água e sono, com cards de médias (diária, semanal, mensal) e lista dos últimos 30 dias, reaproveitando o endpoint `/api/tracker/historico` já existente desde a v0.2.0.
- Link "Ver histórico completo" no card de médias do Dashboard, levando à nova tela de Métricas.

### Melhorado

- Nenhuma melhoria estrutural nesta versão.

### Corrigido

- Nenhuma correção relevante nesta versão.

### Notas para a próxima versão

- Geração de treino no backend foi reformulada (dias por nível de atividade, lista fechada de exercícios, validação automática) — o app mobile já se beneficia automaticamente disso via API, sem necessidade de mudança no cliente.
- Meta de água ainda não é configurável pelo usuário (fixa em 3000ml).
- Persistência de token e alteração de plano já cobertas na v0.2.0; deploy do backend segue como pendência.

<br>

## [0.2.0-alpha] - 2026-07-12

**Status:** Publicada

### Adicionado

- Implementação da persistência de sessão utilizando `expo-secure-store`, mantendo o usuário autenticado entre as aberturas do aplicativo.

- Criação do sistema de alteração do plano alimentar diretamente pelo Dashboard, permitindo alternar entre bulking, cutting e manutenção sem a necessidade de refazer o onboarding.

- Inclusão das páginas institucionais **Sobre**, **Funcionalidades**, **Suporte** (com FAQ) e **Política de Privacidade**, disponíveis através da tela de Configurações.

- Implementação do sistema de acompanhamento diário de água e sono integrado ao Dashboard.

- Criação da estrutura de persistência no backend para armazenamento dos registros diários de água, sono e preparação para futura integração da contagem de passos.

- Adição de cards de hidratação e sono no Dashboard, permitindo registrar rapidamente o consumo de água e as horas dormidas.

### Melhorado

- Reorganização completa do Dashboard para centralizar informações de progresso, plano alimentar, metas, hidratação e sono em uma única tela.

- Reformulação da navegação inferior, substituindo o atalho de Check-in pelo acesso às Configurações e reduzindo redundâncias na interface.

- Exibição de médias de hidratação e sono calculadas pelo backend, proporcionando uma visão mais completa do acompanhamento diário.

### Corrigido

- Correções de espaçamento entre o campo de mensagem da IA e a barra de navegação inferior em diferentes plataformas.

- Ajuste no fluxo de autenticação para evitar a exibição de telas intermediárias durante o processo de logout.

### Conhecido

- A meta diária de hidratação permanece fixa em **3000 ml**, sem possibilidade de personalização pelo usuário.

- As médias de água e sono ainda exigem o recarregamento da tela após um novo registro para refletirem os valores atualizados.

- O backend continua dependente da rede local de desenvolvimento, impossibilitando o uso do aplicativo fora da mesma rede até a realização do deploy da API.

<br>

## [0.1.0-alpha] - 2026-07-11

**Status:** Em desenvolvimento

### Adicionado

- Criação da primeira versão mobile do ecossistema Vitracka.
- Implementação da estrutura inicial do aplicativo utilizando React Native.
- Configuração da base do projeto mobile com TypeScript e Expo.
- Implementação do sistema de navegação entre telas utilizando React Navigation.

### Funcionalidades

- Implementação do fluxo de autenticação:
  - Tela de login;
  - Tela de cadastro;
  - Gerenciamento de sessão do usuário.

- Criação da dashboard mobile com:
  - Resumo nutricional;
  - Controle de calorias e macronutrientes;
  - Visualização de metas;

- Implementação da interface de chat com inteligência artificial:
  - Interface de mensagens;
  - Estrutura preparada para integração com a IA do backend.

- Implementação da visualização do plano alimentar:
  - Refeições organizadas;
  - Informações nutricionais;
  - Distribuição de macronutrientes.

- Implementação da visualização do plano de treino:
  - Organização dos exercícios;
  - Informações de séries e repetições;
  - Estrutura de acompanhamento.

- Criação do sistema de check-in:
  - Registro de atividades;
  - Acompanhamento de consistência;
  - Histórico de progresso.

- Implementação da área de configurações:
  - Dados pessoais;
  - Objetivos;
  - Preferências do usuário.

### Arquitetura

- Separação da aplicação mobile do backend principal do Vitracka.
- Estrutura inicial preparada para comunicação com API REST.
- Organização do projeto visando escalabilidade e evolução independente.

### Próximos passos

- Integração completa com a API do Vitracka Backend.
- Implementação de autenticação via token.
- Persistência de dados no aplicativo.
- Melhorias de experiência do usuário.
- Preparação para publicação em dispositivos Android e iOS.
