#!/bin/bash

# Script de verificação pré-deploy para FuseHotel
# Valida estrutura do projeto antes do deploy

set -e

echo "=== FuseHotel - Verificação Pré-Deploy ==="
echo ""

ERRORS=0
WARNINGS=0

# Função para verificar arquivo
check_file() {
  if [ ! -f "$1" ]; then
    echo "❌ ERRO: $1 não encontrado"
    ERRORS=$((ERRORS + 1))
    return 1
  else
    echo "✓ $1"
    return 0
  fi
}

# Função para verificar diretório
check_dir() {
  if [ ! -d "$1" ]; then
    echo "❌ ERRO: Diretório $1 não encontrado"
    ERRORS=$((ERRORS + 1))
    return 1
  else
    echo "✓ $1/"
    return 0
  fi
}

# Verificar estrutura básica
echo "=== Verificando estrutura do projeto ==="
check_file "package.json"
check_file "docker-compose.vps.yml"
check_file ".github/workflows/deploy-vps.yml"

echo ""
echo "=== Verificando API (Backend) ==="
check_dir "apps/api"
check_dir "apps/api/src"
check_file "apps/api/package.json"
check_file "apps/api/tsconfig.json"
check_file "apps/api/src/server.ts"
check_file "apps/api/src/app.ts"
check_file "apps/api/src/prisma/schema.prisma"

echo ""
echo "=== Verificando estrutura da API ==="
check_dir "apps/api/src/controllers"
check_dir "apps/api/src/services"
check_dir "apps/api/src/routes"
check_dir "apps/api/src/middlewares"
check_dir "apps/api/src/prisma"
check_dir "apps/api/src/prisma/migrations"
check_dir "apps/api/src/prisma/seeds"

echo ""
echo "=== Verificando Web (Frontend) ==="
check_dir "apps/web"
check_dir "apps/web/src"
check_file "apps/web/package.json"
check_file "apps/web/tsconfig.json"
check_file "apps/web/vite.config.ts"
check_file "apps/web/index.html"

echo ""
echo "=== Verificando Shared Package ==="
check_dir "packages/shared"
check_file "packages/shared/package.json"

echo ""
echo "=== Verificando Dockerfiles ==="
check_file "infra/docker/Dockerfile.api.vps"
check_file "infra/docker/Dockerfile.web.vps"
check_file "infra/nginx/nginx.vps.conf"

echo ""
echo "=== Verificando rotas críticas ==="
check_file "apps/api/src/routes/index.ts"
check_file "apps/api/src/routes/auth.routes.ts"
check_file "apps/api/src/routes/users.routes.ts"
check_file "apps/api/src/routes/accommodations.routes.ts"
check_file "apps/api/src/routes/reservations.routes.ts"
check_file "apps/api/src/routes/settings.routes.ts"
check_file "apps/api/src/routes/system-settings.routes.ts"

echo ""
echo "=== Verificando controllers críticos ==="
check_file "apps/api/src/controllers/auth.controller.ts"
check_file "apps/api/src/controllers/users.controller.ts"
check_file "apps/api/src/controllers/accommodations.controller.ts"
check_file "apps/api/src/controllers/reservations.controller.ts"

echo ""
echo "=== Verificando services críticos ==="
check_file "apps/api/src/services/auth.service.ts"
check_file "apps/api/src/services/accommodation.service.ts"
check_file "apps/api/src/services/reservation.service.ts"
check_file "apps/api/src/services/system-settings.service.ts"

echo ""
echo "=== Verificando seeds ==="
if [ -f "apps/api/src/prisma/seeds/index.ts" ]; then
  echo "✓ Seed principal encontrado"
else
  echo "⚠️ AVISO: Seed principal não encontrado"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=== Resumo da Verificação ==="
echo "Erros: $ERRORS"
echo "Avisos: $WARNINGS"

if [ $ERRORS -gt 0 ]; then
  echo ""
  echo "❌ Verificação FALHOU - $ERRORS erro(s) encontrado(s)"
  echo "Por favor, corrija os erros antes de fazer o deploy"
  exit 1
fi

if [ $WARNINGS -gt 0 ]; then
  echo ""
  echo "⚠️ Verificação passou com $WARNINGS aviso(s)"
  echo "Deploy pode continuar, mas revise os avisos"
  exit 0
fi

echo ""
echo "✅ Verificação passou - todos os arquivos críticos estão presentes"
exit 0
