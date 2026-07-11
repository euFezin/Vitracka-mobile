# Changelog

Todas as mudanças relevantes do projeto serão documentadas neste arquivo.

O formato segue o padrão de versionamento semântico.

---

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
