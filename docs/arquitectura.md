# Arquitectura y Diseño de Datos 📘

Esta sección detalla los componentes estructurales de la aplicación, las decisiones de diseño arquitectónico tomadas, la distribución de carpetas del proyecto y la estructura lógica de la base de datos.

---

## 📌 Diagrama de Arquitectura del Sistema

A continuación se muestra el flujo de comunicación y la distribución de responsabilidades entre el frontend, la API del backend, el almacenamiento y los servicios externos de mensajería:

```mermaid
graph TD
    %% Definición de Nodos
    Client[Cliente: React.js + Vite] <-->|Peticiones HTTPS + JWT / JSON| API[Servicio API: Node.js + Express]
    API <-->|Mongoose ODM| DB[(Base de Datos: MongoDB Atlas)]
    API -->|Notificación OTP / Correo| SMTP[Servidor de Correo: Nodemailer]

    %% Estilos de los nodos
    style Client fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000
    style API fill:#8CC84B,stroke:#333,stroke-width:2px,color:#000
    style DB fill:#47A248,stroke:#333,stroke-width:2px,color:#fff
    style SMTP fill:#FFB900,stroke:#333,stroke-width:2px,color:#000
```

---

## 🏗️ Decisiones Arquitectónicas

*   **React.js (Frontend)**: Permite crear una interfaz de usuario interactiva y modular a través de componentes reutilizables, agilizando el renderizado en el navegador.
*   **Node.js + Express (Backend)**: Facilita el desarrollo de un backend ligero y escalable en JavaScript, ofreciendo un gran rendimiento de E/S no bloqueante para gestionar múltiples peticiones simultáneas.
*   **MongoDB Atlas (Base de Datos)**: Base de datos NoSQL ideal para almacenar información dinámica y no estructurada como publicaciones, anuncios y bitácoras de visitas, sin las restricciones de un esquema tabular rígido.
*   **JSON Web Tokens (JWT)**: Garantiza la autenticación segura sin estado. Almacena la identidad y rol del usuario (`admin`, `vigilant`, `user`), permitiendo que el backend proteja los endpoints según los permisos del solicitante.
*   **Arquitectura Cliente-Servidor Desacoplada**: Separa completamente las responsabilidades visuales (React) de las operaciones lógicas y persistencia (Node.js/Express), facilitando la escalabilidad y el despliegue independiente.

---

## 📁 Estructura de Carpetas del Proyecto

El código fuente del proyecto se organiza bajo las siguientes estructuras lógicas para el cliente y el servidor:

### 1. Estructura del Cliente (`client/`)

```text
client/
├── public/                 # Archivos públicos de la aplicación
└── src/
    ├── api/                # Rutas y configuración de Axios para las llamadas HTTP
    ├── assets/             # Imágenes y assets visuales compartidos
    ├── components/         # Componentes transversales reutilizables
    │   ├── forms/          # Formularios (creación, edición, pagos, etc.)
    │   ├── tables/         # Tablas para visualización de datos de la app
    │   └── ui/             # Componentes básicos de interfaz (botones, inputs, mapas)
    ├── context/            # Contextos de React (AuthContext, TaskContext) para manejo de estado
    ├── hooks/              # Custom hooks (e.g. useGeolocation para el mapa SIG)
    ├── interfaces/         # Interfaces TypeScript para contratos de datos
    ├── pages/              # Vistas principales clasificadas por roles
    │   ├── admin/          # Panel administrativo y vista SIG espacial
    │   ├── home/           # Vista inicial de la landing o muro principal
    │   ├── login-access/   # Vistas de anuncios, reportes y pagos de usuarios autenticados
    │   ├── login/          # Vistas de acceso y verificación OTP
    │   └── vigilant/       # Registro de accesos, visitas y horarios
    ├── protected/          # Enrutador protegido por roles de seguridad
    └── utils/              # Tiendas de almacenamiento local y cálculos espaciales
```

### 2. Estructura del Servicio (`service/`)

```text
service/
├── config/                 # Conexión a la base de datos MongoDB Atlas
└── src/
    ├── controllers/        # Controladores controladores de peticiones HTTP
    ├── libs/               # Utilidades globales (firma JWT, nodemailer, etc.)
    ├── middlewares/        # Validaciones de tokens JWT y middleware de errores
    ├── models/             # Modelos definidos de Mongoose (esquemas de colecciones)
    ├── repository/         # Capa intermedia de acceso y operaciones a base de datos
    ├── routes/             # Endpoints y enrutado de la API
    ├── schema/             # Esquemas de validación estructural (Zod)
    ├── services/           # Lógica del negocio y reglas de dominio
    └── swagger/            # Configuración de especificaciones OpenAPI / Swagger
```

---

## 🗄️ Diagrama de Base de Datos (Modelo Entidad-Relación)

A continuación se detalla la representación física y lógica de las colecciones de MongoDB y sus interacciones de cardinalidad:

```mermaid
erDiagram
    USER {
        ObjectId id PK
        string name
        string username UNIQUE
        string email UNIQUE
        string password
        string telephone
        int age
        string role "admin/vigilant/normal/user"
        boolean isVerified
        string otpCode
        date otpExpires
        date createdAt
        date updatedAt
    }

    TASK {
        ObjectId id PK
        string title
        string description
        date date
        string image
        ObjectId user FK
        Point location "SIG coordinates"
        boolean isDangerZone
        date createdAt
        date updatedAt
    }

    TASK2 {
        ObjectId id PK
        string title2
        string description2
        date date2
        string image
        ObjectId user FK
        Point location
        date createdAt
        date updatedAt
    }

    PAY {
        ObjectId id PK
        string numberTarget
        string context
        number amount
        date date
        number cvc
        ObjectId user FK
        date createdAt
        date updatedAt
    }

    SCHEDULE {
        ObjectId id PK
        string name
        string lunes
        string martes
        string miercoles
        string jueves
        string viernes
        string sabado
        string domingo
    }

    VISIT {
        ObjectId id PK
        string visitName
        string dui
        string numPlaca
        string visitHouse
        date date
    }

    %% Relaciones
    USER ||--o{ TASK : "publica incidentes"
    USER ||--o{ TASK2 : "publica anuncios"
    USER ||--o{ PAY : "realiza pagos"
```
