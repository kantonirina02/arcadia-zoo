FROM php:8.2-fpm

# Installation des paquets système et dépendances PHP
RUN apt-get update && apt-get install -y \
  git \
  unzip \
  libicu-dev \
  libpng-dev \
  libjpeg-dev \
  libfreetype6-dev \
  libssl-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install intl pdo pdo_mysql gd

# Installation de l'extension officielle MongoDB pour PHP
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Installation de Composer (le gestionnaire de paquets PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/backend
