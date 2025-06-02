# CarCareNow

Repositorio: [https://github.com/PabloFernandezDev/Proyecto](https://github.com/PabloFernandezDev/Proyecto)

## 📋 Índice

- [Descripción](#-descripción)
- [Requisitos Previos](#-requisitos-previos)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración del Backend](#-configuración-del-backend)
- [Configuración del Frontend](#-configuración-del-frontend)
- [Acceso](#-acceso)

## 🎯 Descripción

CarCareNow es un proyecto hecho con symfony y react con la finalidad de simular un taller mecánico.


## 🛠 Requisitos previos

Antes de empezar, asegúrate de tener instalado:

- PHP ≥ 8.2
- Composer
- MySQL / MariaDB
- Node.js y npm
- Symfony CLI

## 📁 Estructura del proyecto

```
Proyecto/
├── Backend_Symfony/        # Backend Symfony
│   ├── config/             # Configuraciones de Symfony
│   ├── migrations/         # Migraciones de base de datos
│   ├── public/             # Punto de entrada público
│   ├── src/                # Código fuente
│   │   ├── Controller/     # Controladores de la API
│   │   ├── Entity/         # Entidades de la base de datos
│   │   ├── Repository/     # Repositorios de datos
│   │   └── DataFixtures/   # Datos de prueba
│
└── Frontend_React/         # Frontend React
    ├── routers/            # Rutas del proyecto
    ├── src/                # Código fuente
        |── assets/         # Imágenes e iconos
        |── components      # Componentes
```

## ⚙️ Configuración del Backend

1. Ve al directorio del backend:

```bash
cd Backend_Symfony
```

2. Instala las dependencias:

```bash
composer install
```

3. Configura la conexión a la base de datos en el archivo `.env`. Ejemplo:

```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/proyecto?serverVersion=10.4.32-MariaDB&charset=utf8mb4"
#                  ↑       ↑                 ↑      ↑                        ↑
#                  1       2                 3      4                        5
#  1: Usuario de la base de datos
#  2: Contraseña del usuario
#  3: Puerto de la base de datos
#  4: Nombre de la base de datos
#  5: Versión del servidor de base de datos
```

> Asegúrate de modificar estos valores según tu entorno local.
 
4. Crea la base de datos:

```bash
symfony console doctrine:database:create
symfony console doctrine:schema:create
symfony console doctrine:fixtures:load
```

5. Levanta el servidor de Symfony:

```bash
symfony serve -d
```

## ⚛️ Configuración del Frontend

1. Ve al directorio del frontend:

```bash
cd ../Frontend_React
```

2. Instala las dependencias de npm:

```bash
npm install
```

3. Arranca la aplicación en desarrollo:

```bash
npm run dev
```

## 🌐 Acceso

- **Frontend**: `http://localhost:5173/`
- **Backend (API)**: `http://localhost:8000/`
