# BUGS.md

Registro de bugs conhecidos e problemas identificados durante o desenvolvimento do Vitracka Mobile.

---

# Bugs Conhecidos

## [BUG-001] - Ícones da Tab Bar não aparecem no Android

**Status:** Aberto
**Prioridade:** Média
**Categoria:** Interface / Navegação
**Plataforma afetada:** Android
**Plataforma funcionando:** iOS

### Descrição

A barra de navegação inferior apresenta comportamento inconsistente no Android. Algumas abas não são renderizadas visualmente, enquanto no iOS todas as opções aparecem corretamente.

Atualmente, no Android, apenas os ícones da Dashboard e do Chat com IA são exibidos.

### Comportamento esperado

A Tab Bar deve apresentar todas as opções disponíveis para navegação:

- Dashboard;
- Refeições;
- Chat com IA;
- Treino;
- Check-in.

### Contexto

O problema ocorre na implementação da navegação utilizando `Tabs` do Expo Router com uma barra personalizada em formato de pill e um botão central customizado para a IA.

### Possíveis causas

- O componente customizado `ChatTabButton` pode estar sobrescrevendo propriedades de estilo enviadas pelo React Navigation.
- Diferenças de renderização entre Android e iOS no componente de navegação inferior.
- Conflito entre o tamanho do botão central e as dimensões disponíveis da barra de navegação.
- Configurações de espaçamento interno da `tabBarStyle`.

### Arquivos relacionados

```
app/(tabs)/_layout.tsx
```

### Tentativas realizadas

- Ajuste de altura da barra de navegação.
- Alteração das dimensões do botão central.
- Alteração do espaçamento horizontal da barra.

### Próximas ações

- Revisar o componente `ChatTabButton`.
- Testar a remoção temporária do botão customizado para validar a origem do problema.
- Verificar comportamento em diferentes resoluções Android.

---
