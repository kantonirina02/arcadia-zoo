FROM php:8.2-apache

# Installer les dépendances système pour PostgreSQL, MongoDB
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libicu-dev \
    libpq-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Installer les extensions PHP (Intl, PDO PgSQL, MongoDB)
RUN docker-php-ext-install intl pdo pdo_pgsql \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Activer le module Apache Rewrite pour Symfony
RUN a2enmod rewrite

# Modifier le DocumentRoot d'Apache pour pointer vers le dossier "public" de Symfony
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Copier le code source
COPY . /var/www/html/

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Variables d'environnement pour Composer et Symfony
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_ENV=prod

# Installer les dépendances du projet
RUN composer install --no-dev --optimize-autoloader

# Nettoyer le cache et configurer les permissions
RUN php bin/console cache:clear --env=prod \
    && chown -R www-data:www-data /var/www/html/var
