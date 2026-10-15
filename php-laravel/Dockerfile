FROM php:8.2-fpm

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    zip \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Instala Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Define diretório de trabalho
WORKDIR /var/www/html

# Copia arquivos de dependências primeiro (cache layer)
COPY composer.json composer.lock ./

# Instala dependências PHP (sem scripts para não falhar sem .env)
RUN composer install --no-scripts --no-autoloader --no-interaction --prefer-dist

# Copia o restante da aplicação
COPY . .

# Completa autoloader
RUN composer dump-autoload --optimize

# Configura Nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Copia e habilita entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
