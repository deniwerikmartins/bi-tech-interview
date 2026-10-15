#!/bin/bash
set -e

echo "==> [1/6] Configurando .env..."
if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.docker /var/www/html/.env
    echo "     .env criado a partir do .env.docker"
else
    echo "     .env já existe, mantendo."
fi

echo "==> [2/6] Gerando APP_KEY..."
php artisan key:generate --force --no-interaction

echo "==> [3/6] Otimizando autoloader..."
composer dump-autoload --optimize

echo "==> [3.5/6] Ajustando permissões do storage..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "==> [4/6] Aguardando MySQL ficar pronto..."
until mysqladmin ping -h"${DB_HOST:-mysql}" -uroot -p"${DB_PASSWORD:-secret}" --skip-ssl --silent 2>/dev/null; do
    echo "     MySQL ainda não está pronto, aguardando 3s..."
    sleep 3
done
echo "     MySQL pronto!"

echo "==> [5/6] Executando migrations e seeders..."
php artisan migrate --force --no-interaction
php artisan db:seed --force --no-interaction

echo "==> [6/6] Iniciando serviços (Nginx + PHP-FPM)..."
service nginx start
php-fpm
