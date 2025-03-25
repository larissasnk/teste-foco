
# Setup Docker Laravel 10 com PHP 8.1

Com o projeto clonado

Acesse a pasta 
```sh
cd teste-foco
```

```sh
cd back-end
```

Crie o Arquivo .env
```sh
cp .env.example .env
```


Atualize as variáveis de ambiente do arquivo .env
```dosini
APP_NAME="laravel"
APP_URL=http://localhost:8989

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=root

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```


Suba os containers do projeto
```sh
docker-compose up -d
```


Acesse o container app
```sh
docker-compose exec app bash
```


Instale as dependências do projeto
```sh
composer install
```


Gere a key do projeto Laravel
```sh
php artisan key:generate
```


Acesse o projeto
[http://localhost:8989](http://localhost:8989)



Ao clonar o repositório, o usuário acessará a pasta `back-end` e poderá subir o container conforme o passo a passo.

[Link para acessar a documentação da api](http://localhost:8989/api/documentation#/)

