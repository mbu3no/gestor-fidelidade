# Gestor de Fidelidade Multiposto

Sistema web para gestao e simulacao de programas de fidelidade em postos de combustivel. Permite configurar, calcular e analisar a viabilidade financeira de diferentes mecanicas de premiacao.

## Funcionalidades

### Roleta de Premios

- Cadastro de premios com nome, probabilidade e custo unitario
- Definicao de margem de lucro desejada e valor do ticket (por giro)
- Calculo automatico do custo esperado por giro
- Analise de viabilidade: compara receita esperada vs custo esperado
- Validacao de probabilidades (soma deve ser 100%)

### Catalogo de Pontos

- Cadastro de premios com nome, custo para o posto e pontos necessarios para resgate
- Definicao do lucro medio por litro abastecido
- Calculo automatico de litros necessarios para cada resgate
- Analise de margem: mostra se o premio gera lucro ou prejuizo ao posto
- Indicadores de viabilidade por premio

## Stack Tecnica

| Tecnologia   | Versao   | Finalidade                    |
|------------- |--------- |------------------------------ |
| React        | 19.x     | Biblioteca de interface       |
| Vite         | 8.x      | Bundler e dev server          |
| Tailwind CSS | 4.x      | Estilizacao utilitaria        |
| Lucide React | 1.x      | Icones                        |
| ESLint       | 9.x      | Linting                       |

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## Instalacao

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

### Build de producao

```bash
npm run build
```

Os arquivos otimizados serao gerados na pasta `dist/`.

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
│   ├── App.jsx          # Componente principal com toda a logica
│   ├── index.css         # Estilos globais e Tailwind
│   └── main.jsx          # Ponto de entrada da aplicacao
├── index.html            # Template HTML
├── package.json
├── vite.config.js
├── tailwind.config.js
└── eslint.config.js
```

## Persistencia de Dados

Os dados sao armazenados no `localStorage` do navegador. Nao ha backend ou banco de dados — toda a informacao permanece local no dispositivo do usuario.

## Temas

A aplicacao suporta tema claro e escuro, com alternancia via botao na interface. A preferencia do usuario e salva no `localStorage`.

## Licenca

Uso interno. Todos os direitos reservados.
