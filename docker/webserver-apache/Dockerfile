FROM php:8.2-apache-buster

# Setting up constants for an environment
ENV TIMEZONE            CET
ENV PHP_MEMORY_LIMIT    512M

# Setting up general libraries
RUN apt-get update
RUN apt-get install -y apt-utils vim wget alien ca-certificates git make autoconf g++ gcc \
    libmemcached-dev libc-dev libzip-dev libssl-dev zlib1g-dev re2c libpcre3-dev \
    build-essential libicu-dev libxml2-dev libjpeg-dev libfreetype6-dev \
    libsodium-dev libldap2-dev libaio1 iproute2 lsb-release librabbitmq-dev libssh-dev

# Setting up php
RUN docker-php-ext-configure intl \
  && docker-php-ext-install intl \
  && docker-php-ext-install gettext \
  && docker-php-ext-install opcache \
  && docker-php-ext-install pdo_mysql
RUN docker-php-ext-install bcmath \
  sockets
RUN pecl install apcu \
  && docker-php-ext-enable apcu
RUN pecl install zip \
  && docker-php-ext-enable zip \
  && docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ \
  && pecl install xdebug \
  && docker-php-ext-enable xdebug

# Install composer
RUN curl -sS http://getcomposer.org/installer | php \
  && mv composer.phar /usr/local/bin/composer

# Setting up httpd issues
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN a2enmod rewrite headers && /etc/init.d/apache2 restart
#RUN echo "127.0.0.1     www.my.crypto.com my.crypto.com" >> /etc/hosts

WORKDIR "/code"
