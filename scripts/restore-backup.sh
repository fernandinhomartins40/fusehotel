#!/bin/bash

# Script para restaurar backup de uploads do FuseHotel
# Uso: ./restore-backup.sh [nome_do_arquivo_backup.tar.gz]

set -e

echo "=== FuseHotel - Restaurar Backup de Uploads ==="
echo ""

BACKUP_DIR="/root/backups/fusehotel"
VOLUME_NAME=$(docker volume ls --format '{{.Name}}' | grep "fusehotel.*uploads_data" | head -1)

# Verificar se foi passado arquivo de backup
if [ -z "$1" ]; then
  echo "Uso: $0 <arquivo_backup.tar.gz>"
  echo ""
  echo "Backups disponíveis:"
  ls -lh "$BACKUP_DIR" | grep "uploads_backup_" || echo "Nenhum backup encontrado"
  exit 1
fi

BACKUP_FILE="$BACKUP_DIR/$1"

# Verificar se arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Arquivo não encontrado: $BACKUP_FILE"
  echo ""
  echo "Backups disponíveis:"
  ls -lh "$BACKUP_DIR" | grep "uploads_backup_"
  exit 1
fi

# Verificar se volume existe
if [ -z "$VOLUME_NAME" ]; then
  echo "❌ Volume de uploads não encontrado"
  echo "Execute 'docker-compose up' primeiro para criar o volume"
  exit 1
fi

echo "Volume: $VOLUME_NAME"
echo "Backup: $BACKUP_FILE"
echo "Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
echo ""

# Confirmar restauração
read -p "Confirmar restauração? Isso irá SUBSTITUIR todos os uploads atuais (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Restauração cancelada"
  exit 0
fi

echo ""
echo "Parando containers..."
docker-compose -f docker-compose.vps.yml down

echo "Restaurando backup..."
docker run --rm \
  -v "$VOLUME_NAME:/data" \
  -v "$BACKUP_DIR:/backup" \
  alpine \
  sh -c "rm -rf /data/* && tar xzf /backup/$(basename "$BACKUP_FILE") -C /data"

if [ $? -eq 0 ]; then
  echo "✅ Backup restaurado com sucesso!"

  FILE_COUNT=$(docker run --rm -v "$VOLUME_NAME:/data" alpine sh -c "find /data -type f | wc -l")
  echo "Arquivos restaurados: $FILE_COUNT"

  echo ""
  echo "Iniciando containers..."
  docker-compose -f docker-compose.vps.yml up -d

  echo ""
  echo "✅ Restauração concluída!"
else
  echo "❌ Erro ao restaurar backup"
  exit 1
fi
