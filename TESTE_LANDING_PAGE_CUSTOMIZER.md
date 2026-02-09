# 🎨 Guia de Teste - Landing Page Customizer

## ✅ Status do Sistema

O Docker foi rebuildo com sucesso e todos os containers estão rodando:
- ✅ PostgreSQL (porta 5433)
- ✅ API (porta 3001)
- ✅ Web (porta 3000)
- ✅ Nginx (porta 80)

## 🔗 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Admin Landing Customizer**: http://localhost:3000/admin/landing-customizer
- **API**: http://localhost:3001/api

## 📋 Roteiro de Testes

### 1. Acesso ao Painel Administrativo

1. Acesse: http://localhost:3000
2. Faça login como administrador
3. Navegue até: **Admin → Landing Customizer** ou acesse diretamente: http://localhost:3000/admin/landing-customizer

### 2. Teste das Abas do Landing Customizer

O sistema possui 9 abas principais:

#### 📌 Aba 1: Header
**O que testar:**
- [ ] Upload de logo do hotel
- [ ] Alteração da cor de fundo do header
- [ ] Alteração das cores dos textos do menu
- [ ] Configuração das cores hover dos links
- [ ] Estilo e cor do botão de reserva

#### 🎬 Aba 2: Hero (Slider)
**O que testar:**
- [ ] Criar novo slide
  - Título, subtítulo e descrição
  - Tipo de background (cor sólida, gradiente ou imagem)
  - Upload de imagem de fundo
  - Configuração do botão CTA (texto, cor, cor hover)
  - Cor do texto
  - Visibilidade de elementos (título, subtítulo, descrição, botão, rating)
- [ ] Editar slide existente
- [ ] Reordenar slides (arrastar e soltar)
- [ ] Desativar/ativar slides
- [ ] Deletar slides
- [ ] Verificar se o slider na landing page está funcionando com autoplay

#### 🏨 Aba 3: Accommodations (Acomodações)
**O que testar:**
- [ ] Alterar título da seção
- [ ] Alterar cor de fundo
- [ ] Configurar cores dos cards
- [ ] Ajustar espaçamentos
- [ ] Verificar se as alterações refletem na landing page

#### 🎁 Aba 4: Promotions (Pacotes/Promoções)
**O que testar:**
- [ ] Alterar título da seção
- [ ] Configurar cores de fundo e cards
- [ ] Ajustar badges e botões
- [ ] Verificar reflexão na landing page

#### ⭐ Aba 5: Highlights (Destaques)
**O que testar:**
- [ ] Criar novo destaque
  - Upload de imagem
  - Título e descrição
  - Ícone (opcional)
- [ ] Editar destaque existente
- [ ] Reordenar destaques
- [ ] Deletar destaques
- [ ] Configurar cores da seção
- [ ] Verificar exibição na landing page

#### 🖼️ Aba 6: Gallery (Galeria)
**O que testar:**
- [ ] Upload múltiplo de imagens (arrastar ou selecionar)
- [ ] Adicionar descrição/alt text às imagens
- [ ] Reordenar imagens da galeria
- [ ] Deletar imagens
- [ ] Configurar layout da galeria (grid, carousel)
- [ ] Verificar lightbox/modal de visualização

#### 🤝 Aba 7: Partners (Parceiros)
**O que testar:**
- [ ] Adicionar logo de parceiro
- [ ] Upload de múltiplos logos
- [ ] Configurar cor de fundo da seção
- [ ] Ajustar espaçamento entre logos
- [ ] Deletar parceiros
- [ ] Verificar exibição na landing page

#### 📧 Aba 8: Newsletter
**O que testar:**
- [ ] Alterar título e descrição
- [ ] Configurar cor de fundo
- [ ] Ajustar cores do formulário
- [ ] Configurar texto e cor do botão
- [ ] Ativar/desativar seção

#### 🦶 Aba 9: Footer
**O que testar:**
- [ ] Upload de logo do rodapé
- [ ] Alterar cor de fundo
- [ ] Configurar cores dos textos
- [ ] Editar dados de contato (telefone, email)
- [ ] Editar endereço e localização
- [ ] Customizar texto de copyright
- [ ] Configurar links de redes sociais

### 3. Testes de Upload de Imagens

#### Sistema de Storage Próprio
**O que testar:**
- [ ] Upload de imagem única
- [ ] Upload múltiplo de imagens
- [ ] Otimização automática (verificar tamanho dos arquivos)
- [ ] Categorização correta (LANDING_HERO, LANDING_GALLERY, etc.)
- [ ] URLs de acesso às imagens
- [ ] Exclusão de imagens não utilizadas

#### Formatos e Validações
- [ ] Testar upload de JPEG
- [ ] Testar upload de PNG
- [ ] Testar upload de WEBP
- [ ] Verificar rejeição de arquivos não permitidos (PDF, GIF, etc.)
- [ ] Verificar limite de tamanho (5MB por arquivo)
- [ ] Verificar compressão automática com Sharp

### 4. Testes de Persistência

**O que testar:**
- [ ] Fazer alterações em várias abas
- [ ] Salvar configurações
- [ ] Recarregar a página do admin
- [ ] Verificar se as configurações foram mantidas
- [ ] Acessar a landing page pública
- [ ] Verificar se TODAS as alterações estão visíveis

### 5. Testes de Responsividade

**O que testar:**
- [ ] Abrir admin em desktop
- [ ] Abrir admin em tablet
- [ ] Abrir admin em mobile
- [ ] Verificar usabilidade em todos os tamanhos
- [ ] Testar a landing page em diferentes dispositivos

### 6. Testes de Performance

**O que testar:**
- [ ] Tempo de carregamento da landing page
- [ ] Lazy loading de imagens
- [ ] Otimização de imagens (verificar tamanho após upload)
- [ ] Performance do slider (transições suaves)
- [ ] Tempo de resposta da API

## 🔍 Endpoints da API para Teste Manual

### Hero Slides
```bash
# Listar slides
curl http://localhost:3001/api/landing/hero-slides

# Criar slide (requer autenticação)
curl -X POST http://localhost:3001/api/landing/admin/hero-slides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title": "Novo Slide",
    "subtitle": "Subtítulo",
    "description": "Descrição completa",
    "backgroundType": "color",
    "backgroundValue": "#0466C8",
    "buttonText": "Reservar Agora",
    "buttonColor": "#0466C8"
  }'
```

### Highlights
```bash
# Listar destaques
curl http://localhost:3001/api/landing/highlights

# Criar destaque (requer autenticação)
curl -X POST http://localhost:3001/api/landing/admin/highlights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "title": "Novo Destaque",
    "description": "Descrição do destaque",
    "imageUrl": "/uploads/landing/highlights/imagem.jpg",
    "icon": "star"
  }'
```

### Gallery
```bash
# Listar galeria
curl http://localhost:3001/api/landing/gallery

# Adicionar imagem (requer autenticação)
curl -X POST http://localhost:3001/api/landing/admin/gallery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "imageUrl": "/uploads/landing/gallery/imagem.jpg",
    "alt": "Descrição da imagem"
  }'
```

### Upload de Arquivos
```bash
# Upload único
curl -X POST http://localhost:3001/api/upload/single \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "file=@/caminho/para/imagem.jpg" \
  -F "category=LANDING_HERO" \
  -F "alt=Descrição da imagem"

# Upload múltiplo
curl -X POST http://localhost:3001/api/upload/multiple \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "files=@/caminho/para/imagem1.jpg" \
  -F "files=@/caminho/para/imagem2.jpg" \
  -F "category=LANDING_GALLERY"
```

### Settings (Configurações de Seções)
```bash
# Obter configurações de uma seção
curl http://localhost:3001/api/landing/settings/header

# Salvar configurações (requer autenticação)
curl -X POST http://localhost:3001/api/landing/admin/settings/header \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "backgroundColor": "#FFFFFF",
    "textColor": "#000000",
    "logoUrl": "/uploads/landing/header/logo.png"
  }'
```

## 📁 Estrutura de Armazenamento

As imagens são armazenadas em:
```
c:/Projetos Cursor/fusehotel/apps/api/uploads/
├── landing/
│   ├── header/
│   ├── hero/
│   ├── highlights/
│   ├── gallery/
│   ├── partners/
│   └── footer/
├── accommodations/
├── promotions/
└── general/
```

## 🗃️ Tabelas do Banco de Dados

Novas tabelas criadas:
- `UploadedFile` - Metadados de todos os arquivos
- `HeroSlide` - Slides do hero/banner principal
- `Highlight` - Destaques/features
- `GalleryImage` - Imagens da galeria
- `Partner` - Logos de parceiros
- `LandingPageSettings` - Configurações JSON de cada seção

## 🐛 Checklist de Problemas Comuns

- [ ] Se upload falhar: verificar permissões da pasta `uploads/`
- [ ] Se imagens não aparecerem: verificar se o Express está servindo arquivos estáticos
- [ ] Se slider não funcionar: verificar se embla-carousel-autoplay foi instalado
- [ ] Se alterações não salvarem: verificar token JWT no localStorage
- [ ] Se API retornar 401: fazer login novamente

## 🎯 Resultado Esperado

Após todos os testes, você deve ser capaz de:
1. ✅ Customizar completamente a landing page via admin
2. ✅ Fazer upload de imagens sem serviços externos
3. ✅ Ver todas as alterações refletidas instantaneamente
4. ✅ Ter um sistema de slider funcional com autoplay
5. ✅ Gerenciar galeria, destaques e parceiros
6. ✅ Persistir todas as configurações no banco de dados
7. ✅ Ter storage próprio com otimização automática

## 📝 Observações Finais

- Todas as imagens são otimizadas automaticamente pelo Sharp
- O slider tem autoplay de 5 segundos
- É possível ter múltiplos slides ativos
- Cada seção tem configurações independentes
- O sistema está 100% funcional sem dependências externas

## 🚀 Próximos Passos (Opcional)

Se desejar expandir o sistema:
- [ ] Adicionar preview em tempo real no admin
- [ ] Implementar drag-and-drop para reordenação
- [ ] Adicionar mais opções de gradientes
- [ ] Implementar versionamento de configurações
- [ ] Adicionar analytics de seções mais visualizadas
- [ ] Implementar A/B testing de slides

---

**Documentação completa**: Ver arquivo `LANDING_PAGE_CUSTOMIZER_COMPLETE.md`
