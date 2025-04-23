![deepseek_mermaid_20250423_c3332c](https://github.com/user-attachments/assets/20c3b167-5734-4334-bc64-ddf59509f89a)# 🚀 TextRight - Corretor Automático de Redação

## 📌 Índice
- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Como Usar](#-como-usar)
  - [Online](#online)
  - [Localmente](#localmente)
- [Tecnologias](#-tecnologias)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## 🌟 Visão Geral
O TextRight é uma ferramenta avançada de correção textual que utiliza inteligência artificial para:

- Identificar erros gramaticais complexos
- Sugerir melhorias de estilo e clareza
- Analisar estrutura e coesão textual
- Oferecer feedback detalhado instantâneo

## ✨ Funcionalidades
| Recurso | Descrição |
|---------|-----------|
| 📝 **Correção Gramatical** | Identifica erros de ortografia, pontuação e concordância |
| 🧠 **Análise Semântica** | Avalia coerência e progressão temática |
| 📊 **Pontuação Automática** | Classifica o texto com base em critérios de redação |
| 🔄 **Multiplataforma** | Funciona em qualquer dispositivo com navegador moderno |

## 🖥️ Como Usar

### Online
1. Acesse [textright.com](https://textright.com)
2. Clique em "Enviar Documento"
3. Selecione seu arquivo (TXT, DOC ou DOCX)
4. Aguarde a análise (geralmente 15-30 segundos)
5. Revise as sugestões de melhoria
   
🔧 Tecnologias Principais
![deepseek_mermaid_20250423_6aef5a](https://github.com/user-attachments/assets/7506c11a-e0e3-400e-b5fb-294c9ef69858)


Frontend: Bootstrap 5 + EJS Templates

Backend: Node.js com Express

IA: Google Gemini API

Processamento: WordExtractor (para arquivos .doc)

🤝 Contribuição
Siga estes passos para contribuir:

Faça um fork do projeto

Crie uma branch para sua feature (git checkout -b feature/incrivel)

Commit suas mudanças (git commit -am 'Adiciona feature incrível')

Push para a branch (git push origin feature/incrivel)

Abra um Pull Request
### Localmente
```bash
# 1. Clone o repositório
git clone https://github.com/gualvesx/CorretorTexto-TEXTRIGHT.git
cd CorretorTexto-TEXTRIGHT

# 2. Instale as dependências
npm install

# 3. Configure o ambiente (crie um arquivo .env)
echo "GEMINI_API_KEY=sua_chave_aqui" > .env

# 4. Inicie o servidor
node app.js

