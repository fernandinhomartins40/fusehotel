#!/bin/bash

# Script para configurar SSL com Let's Encrypt (Certbot) para FuseHotel
# Uso: ./setup-ssl.sh

set -e

echo "=== FuseHotel - Configuração SSL com Let's Encrypt ==="
echo ""

DOMAIN="perolahotel.com"
WWW_DOMAIN="www.perolahotel.com"
EMAIL="admin@perolahotel.com"  # Altere para seu email

echo "Domínio principal: $DOMAIN"
echo "Domínio adicional: $WWW_DOMAIN"
echo "Email para notificações: $EMAIL"
echo ""

# Verificar se certbot está instalado
if ! command -v certbot &> /dev/null; then
  echo "Certbot não encontrado. Instalando..."
  apt-get update
  apt-get install -y certbot python3-certbot-nginx
fi

echo "Certbot instalado: $(certbot --version)"
echo ""

# Verificar se Nginx está rodando
if ! systemctl is-active --quiet nginx; then
  echo "❌ Nginx não está rodando"
  echo "Inicie o Nginx primeiro: systemctl start nginx"
  exit 1
fi

echo "✓ Nginx está rodando"
echo ""

# Verificar se configuração do Nginx existe
if [ ! -f "/etc/nginx/sites-available/perolahotel.conf" ]; then
  echo "⚠️ Configuração do Nginx não encontrada"
  echo "Execute o deploy primeiro para criar a configuração"
  exit 1
fi

echo "✓ Configuração do Nginx encontrada"
echo ""

# Testar configuração do Nginx
echo "Testando configuração do Nginx..."
nginx -t

if [ $? -ne 0 ]; then
  echo "❌ Configuração do Nginx inválida"
  exit 1
fi

echo "✓ Configuração do Nginx válida"
echo ""

# Verificar DNS
echo "Verificando DNS..."
echo "IP do $DOMAIN: $(dig +short $DOMAIN | tail -1)"
echo "IP do $WWW_DOMAIN: $(dig +short $WWW_DOMAIN | tail -1)"
echo "IP do servidor: $(curl -s ifconfig.me)"
echo ""

read -p "Os IPs conferem? Continue (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
  echo "Configure o DNS corretamente antes de continuar"
  exit 0
fi

# Obter certificado SSL
echo ""
echo "Obtendo certificado SSL..."
certbot --nginx \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive \
  --redirect

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Certificado SSL configurado com sucesso!"
  echo ""
  echo "Certificados criados em:"
  echo "  /etc/letsencrypt/live/$DOMAIN/fullchain.pem"
  echo "  /etc/letsencrypt/live/$DOMAIN/privkey.pem"
  echo ""
  echo "Renovação automática configurada via certbot timer"
  echo ""
  echo "Testando HTTPS..."
  curl -I "https://$DOMAIN" | head -5
  echo ""
  echo "✅ Configuração concluída!"
  echo "Acesse: https://$DOMAIN"
else
  echo "❌ Erro ao obter certificado SSL"
  echo ""
  echo "Verifique:"
  echo "1. DNS está configurado corretamente"
  echo "2. Portas 80 e 443 estão abertas no firewall"
  echo "3. Nginx está configurado corretamente"
  exit 1
fi
