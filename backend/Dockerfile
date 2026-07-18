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
RUN sed -ri -e "s!/var/www/html!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/sites-available/*.conf
RUN sed -ri -e "s!/var/www/!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Configurer Apache pour que toutes les requêtes soient redirigées vers index.php (comme le fait .htaccess)
RUN echo "<Directory ${APACHE_DOCUMENT_ROOT}>\n\tAllowOverride All\n\tFallbackResource /index.php\n</Directory>" >> /etc/apache2/conf-available/symfony.conf \
    && a2enconf symfony

# Copier le code source
COPY . /var/www/html/

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Variables d'environnement pour Composer et Symfony
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV APP_ENV=prod

# Installer les dépendances du projet (sans --no-dev pour permettre les fixtures)
RUN composer install --optimize-autoloader

# Nettoyer le cache, générer les clés JWT et configurer les permissions
RUN php bin/console cache:clear --env=prod \
    && php bin/console lexik:jwt:generate-keypair --skip-if-exists \
    && chown -R www-data:www-data /var/www/html/var /var/www/html/config/jwt
