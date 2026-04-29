# Roteiro de Apresentação — Contract Testing com Pact e PactFlow

## 1. Contexto — O problema

- Times diferentes desenvolvendo serviços que se comunicam
- Provider muda a API sem avisar → consumer quebra em produção
- Testes de integração são caros, lentos e frágeis
- Como garantir compatibilidade sem subir tudo junto?

---

## 2. O que é Contract Testing?

- Um **contrato** é um acordo formal entre consumer e provider
- O consumer documenta o que ele espera da API (campos, tipos, status)
- O provider verifica se sua API cumpre o que foi prometido
- Se o provider quebrar o contrato → pipeline falha antes de ir pra produção

**Diferença de outros testes:**
- Teste de integração → sobe os dois serviços juntos, caro e lento
- Contract testing → cada serviço testa independente, rápido e barato

---

## 3. Fluxo — Como funciona na prática

```
Consumer
  └─ escreve o teste → gera o contrato (.json)
  └─ publica o contrato no PactFlow
  └─ can-i-deploy? ✅

PactFlow
  └─ armazena o contrato
  └─ cruza os resultados de verificação

Provider
  └─ busca o contrato do PactFlow
  └─ verifica se a API cumpre o contrato
  └─ publica o resultado no PactFlow
  └─ can-i-deploy? ✅
```

---

## 4. Na prática — O que foi construído

### Consumer (`pact-contract-tests-consumer`)
- Teste escrito em Jest + Pact
- Define a interação esperada: `GET /users/1` → retorna `id`, `name`, `email`
- Gera o contrato em `src/contracts/`
- Pipeline publica o contrato no PactFlow com versão e branch

### Provider (`pact-contract-tests-provider`)
- Sobe um servidor Express fictício simulando a API
- Usa o `Verifier` do Pact para buscar o contrato do PactFlow
- Verifica se a API responde conforme o contrato
- Publica o resultado da verificação no PactFlow

### PactFlow
- Armazena os contratos e resultados
- Exibe o `Can I Deploy?` — verde se tudo ok, vermelho se algo quebrou
- Rastreia versões e branches de consumer e provider

### GitHub Actions
- Consumer: testes → gera contrato → publica → can-i-deploy
- Provider: verificação → publica resultado → can-i-deploy
- Tudo automático a cada push na branch main

---

## 5. Demo ao vivo — Quebrando o contrato

1. No consumer, adicionar um campo novo obrigatório no contrato (ex: `phone`)
2. Fazer push → pipeline do consumer publica novo contrato
3. Fazer push no provider sem alterar a API
4. Pipeline do provider falha — a API não retorna `phone`
5. PactFlow mostra `Can I Deploy? ❌`
6. Reverter a mudança → tudo volta ao verde

**Mensagem:** o problema foi detectado no CI, não em produção.

---

## 6. Próximos passos para adoção

- Configurar webhook no PactFlow para disparar o provider automaticamente
- Usar o commit SHA real como versão (já está configurado no CI)
- Expandir para outros endpoints e serviços do time
- Definir quem é responsável pelo contrato — consumer driven
