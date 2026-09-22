<<<<<<< HEAD
# kinesiology-scheduler
=======
# Kinesiology Scheduler API

Este proyecto implementa el backend de un sistema de gestión de turnos para un consultorio o clínica de kinesiología. 

## Arquitectura y Patrones
- **NestJS (TypeScript)** con tipado estricto.
- **Arquitectura Hexagonal & Vertical Slicing:** El código está dividido en módulos verticales (ej. `appointments`) y dentro de cada módulo, en capas concéntricas (`domain`, `application`, `infrastructure`).
- **Base de Datos:** PostgreSQL con TypeORM.
- **Autenticación:** JWT mediante Passport.
- **Tiempo Real:** Eventos mediante WebSockets (`@nestjs/websockets`).
- **Documentación API:** Swagger integrado.

## Requisitos Previos
- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)

## Instalación

1. Clona el repositorio e instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno creando un archivo `.env` basado en el siguiente ejemplo:
```env
# .env.example
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=kinesiology
JWT_SECRET=super-secret-key-change-me
```

## Ejecución

```bash
# Desarrollo
npm run start

# Modo Watch (Desarrollo)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Pruebas
```bash
# Unitarias
npm run test

# End-to-End
npm run test:e2e

# Cobertura
npm run test:cov
```

## Documentación API (Swagger)
Al iniciar la aplicación, la documentación generada automáticamente por Swagger estará disponible en:
`http://localhost:3000/api/docs`
>>>>>>> 959baa6 (Actualizacion 10 - 22-09-2026)
