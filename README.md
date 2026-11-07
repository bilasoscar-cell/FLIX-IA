# FLIX.Ia — versão com IA real

Esta versão inclui:
- Chat com a OpenAI Responses API.
- Geração de imagens com GPT Image.
- Chave de API guardada apenas no servidor (ficheiro `.env`), nunca no navegador.

## 1. O que precisas
- Node.js 20 ou superior.
- Uma chave da OpenAI API e faturação/créditos API ativos. A subscrição do ChatGPT não inclui automaticamente utilização da API.
- Acesso à Internet.

Cria/consulta a tua chave em https://platform.openai.com/api-keys

## 2. Instalar e iniciar no Windows
1. Extrai a pasta ZIP.
2. Instala Node.js: https://nodejs.org/
3. Abre a pasta `FLIX_IA_completo` no Explorador.
4. Na barra de endereço da pasta escreve `cmd` e carrega Enter.
5. Executa:
   ```bash
   npm install
   ```
6. Cria uma cópia de `.env.example` chamada `.env`.
7. Abre `.env` e substitui `coloca_a_tua_chave_aqui` pela tua chave. Não envies a chave a ninguém nem a publiques.
8. Executa:
   ```bash
   npm start
   ```
9. Abre http://localhost:3000 no Chrome.

## 3. Publicar online
Este projeto precisa de um serviço que execute Node.js (não basta arrastar apenas o HTML para Netlify Drop).
- Cria um serviço web Node no Render, Railway ou outro alojamento compatível.
- Define o comando de instalação `npm install` e o comando de arranque `npm start`.
- Adiciona `OPENAI_API_KEY` nas variáveis de ambiente do serviço de alojamento.
- Publica a pasta/repositório do projeto. Não incluas o `.env` nem `node_modules`.

## Notas
- O chat usa o modelo `gpt-6-astra` através da Responses API.
- A geração de imagens usa `gpt-image-2.5-flare`.
- A utilização da API pode ter custos separados, consoante os modelos e a quantidade de pedidos.
- A disponibilidade de alguns modelos/funções pode depender da conta e da verificação da organização.
- Para produção pública, adiciona autenticação, limites de utilização por utilizador, proteção contra abuso e monitorização de custos. O limite de tamanho das mensagens no servidor é uma proteção básica, não substitui esses controlos.
