# Gestor de Fidelidade Multiposto

Sistema web para gestão e simulação de programas de fidelidade em postos de combustível. Permite configurar, calcular e analisar a viabilidade financeira de diferentes mecânicas de premiação.

## Funcionalidades

### Roleta de Prêmios

- Cadastro de prêmios com nome, probabilidade e custo unitário
- Definição de margem de lucro desejada e valor do ticket (por giro)
- Cálculo automático do custo esperado por giro
- Análise de viabilidade: compara receita esperada vs custo esperado
- Validação de probabilidades (soma deve ser 100%)

### Catálogo de Pontos

- Cadastro de prêmios com nome, custo para o posto e pontos necessários para resgate
- Definição do lucro médio por litro abastecido
- Cálculo automático de litros necessários para cada resgate
- Análise de margem: mostra se o prêmio gera lucro ou prejuízo ao posto
- Indicadores de viabilidade por prêmio

## Stack Técnica

| Tecnologia   | Versão   | Finalidade                    |
|------------- |--------- |------------------------------ |
| React        | 19.x     | Biblioteca de interface       |
| Vite         | 8.x      | Bundler e dev server          |
| Tailwind CSS | 4.x      | Estilização utilitária        |
| Lucide React | 1.x      | Ícones                        |
| ESLint       | 9.x      | Linting                       |

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Instalação

```bash
git clone https://github.com/mbu3no/gestor-fidelidade.git
cd gestor-fidelidade
npm install
```

## Uso

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build de produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview do build

```bash
npm run preview
```

## Estrutura do Projeto

```
gestor-fidelidade/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx          # Componente principal com toda a lógica
│   ├── index.css         # Estilos globais e Tailwind
│   └── main.jsx          # Ponto de entrada da aplicação
├── index.html            # Template HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## Persistência de Dados

Os dados são armazenados no `localStorage` do navegador. Não há backend ou banco de dados — toda a informação permanece local no dispositivo do usuário.

## Temas

A aplicação suporta tema claro e escuro, com alternância via botão na interface. A preferência do usuário é salva no `localStorage`.

## Licença

Uso interno. Todos os direitos reservados.
