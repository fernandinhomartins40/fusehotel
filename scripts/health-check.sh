#!/bin/bash

# Script de health check para FuseHotel
# Verifica se todos os serviços estão funcionando corretamente

set -e

echo "=== FuseHotel - Health Check ==="
echo "Data/Hora: $(date)"
echo ""

ERRORS=0

# Função para testar endpoint
test_endpoint() {
  local url=$1
  local name=$2
  local expected_code=${3:-200}

  echo -n "Testando $name... "

  http_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

  if [ "$http_code" -eq "$expected_code" ]; then
    echo "✅ OK (HTTP $http_code)"
    return 0
  else
    echo "❌ FALHOU (HTTP $http_code, esperado $expected_code)"
    ERRORS=$((ERRORS + 1))
    return 1
  fi
}

# Verificar containers
echo "=== Verificando Containers ==="
docker-compose -f docker-compose.vps.yml ps

echo ""
echo "=== Verificando Serviços ==="

# Health check do backend
test_endpoint "http://localhost:3091/health" "API Health Check"

# Frontend
test_endpoint "http://localhost:3091/" "Frontend" 200

# API - autenticação (deve retornar erro sem token, mas significa que está funcionando)
test_endpoint "http://localhost:3091/api/auth/me" "API Auth Endpoint" 401

echo ""
echo "=== Verificando Recursos ==="

# Verificar uso de CPU e memória dos containers
echo "Uso de recursos dos containers:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" \
  fusehotel-api-vps fusehotel-web-vps fusehotel-postgres-vps fusehotel-nginx-vps 2>/dev/null || echo "Containers não encontrados"

echo ""
echo "=== Verificando Volumes ==="

# Verificar volumes
for volume in $(docker volume ls --format '{{.Name}}' | grep fusehotel); do
  size=$(docker run --rm -v "$volume:/data" alpine du -sh /data 2>/dev/null | cut -f1 || echo "N/A")
  files=$(docker run --rm -v "$volume:/data" alpine find /data -type f 2>/dev/null | wc -l || echo "0")
  echo "$volume: $size ($files arquivos)"
done

echo ""
echo "=== Verificando Logs Recentes ==="
echo "Últimas 10 linhas do log da API:"
docker logs fusehotel-api-vps --tail=10 2>&1 | grep -v "warn" || echo "Sem logs"

echo ""
echo "=== Resumo ==="
if [ $ERRORS -eq 0 ]; then
  echo "✅ Todos os serviços estão funcionando corretamente"
  exit 0
else
  echo "❌ $ERRORS serviço(s) com problema"
  exit 1
fi
