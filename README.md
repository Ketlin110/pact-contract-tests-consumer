# pact-contract-tests-consumer
Testes de contrato do lado do Consumer usando Pact e PactFlow.

## Pré-requisitos
- Node.js 20+
- Conta no PactFlow com token de leitura/escrita

## Instalação
```bash
npm install
```

## Configuração
Criar um `.env` baseado no `.env.example`:
```
PACT_BROKER_URL=https://sua-org.pactflow.io
PACT_BROKER_TOKEN=seu-token-aqui
```
Para gerar o token: PactFlow → avatar → Settings → API Tokens → Read/write token

## Como rodar os testes
```bash
npm test
```
O consumer gera o contrato em `src/contracts/` automaticamente.

## Como publicar o contrato no PactFlow
Dentro da pasta do consumer:
```bash
./pact/bin/pact-broker publish ./src/contracts --consumer-app-version=1.0.0 --branch=main --broker-base-url=SEU_URL --broker-token=SEU_TOKEN
```

## CI/CD
O workflow `.github/workflows/consumer.yml` roda automaticamente no push/PR para `main`:
1. Instala dependências
2. Roda os testes e gera o contrato
3. Publica o contrato no PactFlow
4. Executa o `can-i-deploy`
