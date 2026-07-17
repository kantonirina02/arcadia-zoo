FROM php:8.2-fpm

# 1. Mise à jour et installation des librairies système requises
RUN apt-get update && apt-get install -y \
  git \
  unzip \
  libicu-dev \
  libpng-dev \
  libjpeg-dev \
  libfreetype6-dev \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# 2. Configuration spécifique et installation des extensions PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install intl pdo pdo_mysql gd \
  && pecl install mongodb \
  && docker-php-ext-enable mongodb

# 3. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Définition du répertoire de travail par défaut
WORKDIR /var/www/backend
