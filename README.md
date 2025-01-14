# Проект Datalouna

Этот проект представляет собой **Node.js**-приложение на **TypeScript** с использованием **Express**, **Postgres** и **Redis**. В проекте реализованы:

- **Авторизация и аутентификация** (JWT)
- **Покупка продуктов** (операции с балансом пользователя)
- **Загрузка и кэширование данных** (пример с API Skinport и Redis)
- **Автоматическая документация** Swagger

## Структура проекта

```bash
.
├── src
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── items.controller.ts
│   │   └── purchases.controller.ts
│   ├── dtos
│   │   ├── auth.dto.ts
│   │   ├── purchase.dto.ts
│   │   └── ...
│   ├── middleware
│   │   └── auth.middleware.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── items.service.ts
│   │   └── purchases.service.ts
│   ├── types
│   │   ├── auth.types.ts
│   │   └── item.interface.ts
│   ├── db.ts           # Настройка подключения к Postgres
│   ├── redis.ts        # Настройка подключения к Redis
│   ├── config.ts       # Config (env) файл
│   ├── swagger.ts      # Настройки Swagger
│   ├── app.ts          # Создание и настройка Express-приложения
│   └── index.ts        # Тестовое подключение к БД (пример)
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## Основные технологии и библиотеки

- **Express**: фреймворк для создания веб-сервисов
- **TypeScript**: типизация и надёжность кода
- **Postgres**: основная база данных
- **Redis**: кэш и быстрая in-memory база
- **express-jwt / jsonwebtoken**: аутентификация по JWT
- **class-validator / class-transformer**: валидация DTO
- **Swagger**: автоматическая генерация и просмотр API-документации

## Предварительные требования

1. **Node.js** (версия 14+)
2. **npm** или **yarn**
3. **Docker** и **Docker Compose** (для запуска Postgres и Redis)

## Шаги запуска проекта

### 1. Клонируйте репозиторий

```bash
git clone https://github.com/ваш-репозиторий/datalouna.git
cd datalouna
```

### 2. Установите зависимости

```bash
npm install
# или
yarn
```

### 3. Настройте переменные окружения

В корне проекта может быть файл **.env**, в котором прописаны переменные окружения. Пример (значения по умолчанию):

```bash
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_DB=datalouna_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_PORT_OUT=5445

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PORT_OUT=3322

PORT=3000
```

> **Note**: Важно, чтобы `DATABASE_PORT_OUT` и `REDIS_PORT_OUT` совпадали с портами, которые вы пробрасываете в **docker-compose.yml** (см. ниже).

### 4. Запустите Docker Compose

В **docker-compose.yml** описаны сервисы для базы данных Postgres и Redis:

```bash
docker-compose up -d
```

- Контейнер Postgres будет работать на **localhost:5445** (внутри контейнера – порт 5432).
- Контейнер Redis будет работать на **localhost:3322** (внутри контейнера – порт 6379).

Проверьте, что оба контейнера запущены:

```bash
docker ps
```
Должны быть видны контейнеры **postgres** и **redis**.

### 5. Создайте таблицы и тестовые данные (при необходимости)

В проекте есть SQL-скрипты для создания таблиц и вставки тестовых данных. Вы можете выполнить их вручную или через свой способ миграций. Например, в psql:

```bash
psql -h localhost -p 5445 -U postgres -d datalouna_db -f ./path/to/your/script.sql
```

(Либо используйте любой GUI, например pgAdmin.)

### 6. Запустите приложение

```bash
npm run build    # Компиляция TypeScript -> JS
npm run start    # Запуск компилированного кода (dist/)
```

> Если хотите запустить в режиме разработчика (с `ts-node-dev`):
> ```bash
> npm run dev
> ```

Вы увидите в консоли:

```
👀 Connecting to database with the following parameters:
  Host: localhost
  Port: 5445
  Database: datalouna_db
  User: postgres

🚀 Server started on http://localhost:3000

♨️ Connected to Redis

🗃️ Database connected successfully
```

Теперь приложение доступно по адресу [http://localhost:3000](http://localhost:3000).

### 7. Проверьте Swagger-документацию

Документация генерируется автоматически. Зайдите в браузере на:
```
http://localhost:3000/docs
```
Там вы найдёте все описанные эндпоинты (Auth, Items, Purchases и т.д.).

---

## Взаимодействие с приложением

### Auth (JWT-аутентификация)

- **POST /auth/register**
  Регистрирует нового пользователя.
  Тело запроса (JSON):
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **POST /auth/login**
  Логинит пользователя, возвращает `auth_token` (JWT):
  ```json
  {
    "auth_token": "eyJhbGci..."
  }
  ```
- **POST /auth/change-password** *(требуется JWT)*
  Меняет пароль у текущего пользователя. В заголовке нужно передавать `Authorization: Bearer <token>`.

### Items (пример с Skinport API)

- **GET /items/getAll**
  Запрашивает данные о предметах из внешнего API Skinport (как для `tradable`, так и для `non-tradable`), мёрджит их и кэширует в Redis.
  - При первом запросе данные берутся из Skinport, затем записываются в Redis.
  - При последующих запросах, пока кэш не истёк, данные берутся из Redis.

### Purchases (покупка товаров)

- **GET /purchases/products**
  Возвращает список доступных продуктов (из таблицы `products` в Postgres).

- **POST /purchases/buy** *(требуется JWT)*
  Позволяет пользователю купить продукт. Вычитается стоимость из баланса пользователя, создаётся запись в таблице `purchases`.

```json
{
  "productId": 1
}
```

Если баланс недостаточен или продукт не найден, вернётся ошибка 400.

---

## Дополнительные заметки

1. **Подключение к БД**
   - Используется библиотека [postgres](https://www.npmjs.com/package/postgres) для работы с Postgres.
   - Конфигурация находится в `src/db.ts`, а параметры берутся из `process.env`.

2. **Подключение к Redis**
   - Используется официальный пакет [redis](https://www.npmjs.com/package/redis).
   - Конфигурация в `src/redis.ts`, переменные окружения тоже идут из `.env`.

3. **JWT-секрет**
   - В данном примере `secretSuper` прописан жёстко в коде. Рекомендуется вынести секрет в `.env`.

4. **Скрипты npm**
   - `npm run build` — компилирует TypeScript в `dist/`.
   - `npm run start` — запускает Node.js с уже скомпилированными файлами.
   - `npm run dev` — запускает приложение в dev-режиме (hot-reload через ts-node-dev).

5. **Swagger**
   - Настройки Swagger описаны в `src/swagger.ts`.
   - По умолчанию документация доступна по `/docs`.
