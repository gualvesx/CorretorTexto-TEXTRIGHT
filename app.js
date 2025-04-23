require('dotenv').config();
const express = require('express');
const multer = require('multer');
const WordExtractor = require('word-extractor');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const IA = require('./IA');

const app = express();
const extractor = new WordExtractor();
const viewsPath = path.join(__dirname, 'views');
const uploadsPath = path.join(__dirname, 'uploads');
const publicPath = path.join(__dirname, 'public');

// 2. Criar estrutura de diretórios necessária
async function setupDirectories() {
    try {
        await fs.mkdir(viewsPath, { recursive: true });
        await fs.mkdir(uploadsPath, { recursive: true });
        await fs.mkdir(publicPath, { recursive: true });
        
        // Criar index.ejs básico se não existir
        const indexPath = path.join(viewsPath, 'index.ejs');
        if (!fsSync.existsSync(indexPath)) {
            const template = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <% if(chat) { %>
            <div class="mb-4">
                <h3>Seu Texto:</h3>
                <pre class="bg-light p-3"><%= chat %></pre>
            </div>
        <% } %>
        
        <% if(feedback) { %>
            <div class="mb-4">
                <h3>Feedback:</h3>
                <div class="bg-light p-3"><%- feedback %></div>
            </div>
        <% } %>

        <form action="/" method="post" enctype="multipart/form-data" class="mb-4">
            <div class="mb-3">
                <label class="form-label">Envie seu documento:</label>
                <input type="file" class="form-control" name="documento" accept=".txt,.doc,.docx" required>
            </div>
            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>
    </div>
</body>
</html>`;
            await fs.writeFile(indexPath, template);
            console.log('Arquivo index.ejs criado automaticamente');
        }
    } catch (err) {
        console.error('Erro ao configurar diretórios:', err);
        process.exit(1);
    }
}

// 3. Configuração do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(publicPath));

app.set('views', viewsPath);
app.set('view engine', 'ejs');

// 4. Configuração do Multer
const storage = multer.diskStorage({
    destination: uploadsPath,
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// 5. Rotas
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Assistente de Redação',
        chat: '',
        feedback: ''
    });
});

app.post('/', upload.single('documento'), async (req, res) => {
    if (!req.file) {
        return res.status(400).render('index', {
            title: 'Erro',
            chat: '',
            feedback: 'Nenhum arquivo enviado ou tipo inválido!'
        });
    }

    try {
        const filePath = path.join(uploadsPath, req.file.filename);
        let textContent = '';

        if (req.file.mimetype === 'text/plain') {
            textContent = await fs.readFile(filePath, 'utf8');
        } 
        else if (req.file.mimetype.includes('msword') || req.file.mimetype.includes('wordprocessingml')) {
            const extracted = await extractor.extract(filePath);
            textContent = extracted.getBody();
        }
        else {
            textContent = "Tipo de arquivo não suportado para visualização direta";
        }

        const feedback = await IA.executar(textContent);
        const feedbackFormatado = feedback.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        res.render('index', {
            title: 'Feedback do Documento',
            chat: textContent,
            feedback: feedbackFormatado
        });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).render('index', {
            title: 'Erro',
            chat: '',
            feedback: 'Ocorreu um erro ao processar seu documento.'
        });
    }
});

// 6. Inicialização do servidor
async function startServer() {
    await setupDirectories();
    
    app.listen(3000, () => {
        console.log('Servidor rodando em http://localhost:3000');
        console.log(`Visualizações: ${viewsPath}`);
        console.log('Arquivos na pasta views:', fsSync.readdirSync(viewsPath));
    });
}

startServer().catch(err => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
});