#!/bin/bash

# Script de backup automático de uploads para FuseHotel
# Faz backup do volume Docker de uploads antes do deploy

set -e

echo "=== FuseHotel - Backup de Uploads ==="
echo ""

# Configurações
BACKUP_DIR="/root/backups/fusehotel"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="uploads_backup_${TIMESTAMP}.tar.gz"
VOLUME_NAME=$(docker volume ls --format '{{.Name}}' | grep "fusehotel.*uploads_data" | head -1)

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

echo "Data/Hora: $(date)"
echo "Diretório de backup: $BACKUP_DIR"
echo "Nome do backup: $BACKUP_NAME"
echo ""

# Verificar se volume existe
if [ -z "$VOLUME_NAME" ]; then
  echo "⚠️ Volume de uploads não encontrado"
  echo "Isso é normal para primeiro deploy"
  echo "Nenhum backup necessário"
  exit 0
fi

echo "Volume encontrado: $VOLUME_NAME"

# Verificar se há arquivos no volume
FILE_COUNT=$(docker run --rm -v "$VOLUME_NAME:/data" alpine sh -c "find /data -type f 2>/dev/null | wc -l" || echo "0")

if [ "$FILE_COUNT" -eq 0 ]; then
  echo "⚠️ Volume está vazio - nenhum backup necessário"
  exit 0
fi

echo "Arquivos no volume: $FILE_COUNT"
echo ""

# Fazer backup do volume
echo "Criando backup..."
docker run --rm \
  -v "$VOLUME_NAME:/data:ro" \
  -v "$BACKUP_DIR:/backup" \
  alpine \
  tar czf "/backup/$BACKUP_NAME" -C /data .

if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_NAME" | cut -f1)
  echo "✅ Backup criado com sucesso!"
  echo "Arquivo: $BACKUP_DIR/$BACKUP_NAME"
  echo "Tamanho: $BACKUP_SIZE"
  echo ""

  # Listar backups existentes
  echo "=== Backups existentes ==="
  ls -lh "$BACKUP_DIR" | grep "uploads_backup_" || echo "Nenhum backup anterior"
  echo ""

  # Limpar backups antigos (manter últimos 7 dias)
  echo "Limpando backups antigos (>7 dias)..."
  find "$BACKUP_DIR" -name "uploads_backup_*.tar.gz" -type f -mtime +7 -delete

  REMAINING=$(ls -1 "$BACKUP_DIR" | grep "uploads_backup_" | wc -l)
  echo "Backups mantidos: $REMAINING"

  exit 0
else
  echo "❌ Erro ao criar backup"
  exit 1
fi
