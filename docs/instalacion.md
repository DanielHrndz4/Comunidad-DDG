# Instalación y Configuración ⚙️

Esta sección describe detalladamente los requisitos previos y los pasos necesarios para instalar, configurar y ejecutar la aplicación de **Comunidad DDG** localmente.

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu sistema:

*   **Node.js** >= `v22.20.0`
*   **NPM** >= `10.9.3`
*   **Git**
*   **MongoDB Atlas**: Una cuenta en [MongoDB Atlas](https://www.mongodb.com/) con un cluster creado y credenciales de conexión listas.

---

## ⚙️ Instalación Paso a Paso

### Paso 1: Clonar el Repositorio

Abre una terminal en la ruta en la que desees almacenar el proyecto y ejecuta la siguiente instrucción:

```bash
git clone https://github.com/golic98/ProyectoIS2025.git
cd ProyectoIS2025
```

### Paso 2: Instalar Dependencias

El proyecto está dividido en dos partes principales: `client` (frontend) y `service` (backend). Para instalar todas las dependencias, debes abrir dos terminales o pestañas y realizar lo siguiente:

=== "Cliente (Frontend)"
    ```bash
    cd client
    npm install
    ```

=== "Servicio (Backend)"
    ```bash
    cd service
    npm install
    ```

---

## 🔐 Variables de Entorno

Debes configurar los archivos de entorno `.env` en cada subcarpeta para que la aplicación funcione correctamente.

### 1. Configuración del Cliente (`client/.env`)

Crea un archivo llamado `.env` en la raíz de la carpeta `client/` y agrega la dirección URL de tu API del backend:

```env
VITE_APP_API_URL="http://localhost:3000/api"
```

> [!NOTE]
> Modifica el puerto de acuerdo al que esté escuchando tu backend (por defecto `3000` si se inicia localmente).

### 2. Configuración del Backend (`service/.env`)

Crea un archivo llamado `.env` en la raíz de la carpeta `service/` y configura las siguientes variables, reemplazando `<usuario>` y `<password>` por tus credenciales de MongoDB Atlas:

```env
MONGO_URL=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/comunidad_ddg?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=tu_clave_secreta_aqui
```

---

## ▶️ Ejecución de la Aplicación

Para levantar los servicios locales de desarrollo, ejecuta el comando correspondiente en cada terminal:

=== "Terminal 1: Cliente"
    ```bash
    cd client
    npm run dev
    ```
    *Por defecto, esto levantará la aplicación web de Vite en `http://localhost:5173` (o el puerto configurado por Vite).*

=== "Terminal 2: Servicio (API)"
    ```bash
    cd service
    npm run dev
    ```
    *Esto levantará el servidor backend Express en el puerto configurado (ej. `http://localhost:3000`).*
