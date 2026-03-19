**DOCUMENTACIÓN TÉCNICA**

📌 **1️⃣ Nombre del Proyecto**

Comunidad DDG

🚀 **Descripción del Proyecto**

¿Qué hace nuestra aplicación?
Esta aplicación web tiene como objetivo facilitar la transmisión de
información en tiempo real entre los usuarios de una comunidad
pequeña. Los usuarios podrán compartir publicaciones que incluyan
texto e imágenes sobre los eventos o sucesos que están ocurriendo en
su entorno.
La funcionalidad de la aplicación es similar a la de plataformas como X
(anteriormente conocida como Twitter), pero enfocada en la difusión de
información dentro de una comunidad específica.
La aplicación contará con una pantalla donde se mostrarán todas las
publicaciones generadas por los usuarios y también los anuncios.
Además, los usuarios podrán interactuar con los anuncios publicados,
según su rol: administrador o usuario común. Los administradores
tendrán la capacidad de gestionar y moderar las publicaciones, mientras
que los usuarios normales podrán realizar publicaciones dentro de la
plataforma. Y el último rol será el de vigilante, quien será encargado de
gestionar el acceso de los visitantes, pidiéndoles datos generales, como
por ejemplo: nombre, número de casa a visitar, número de placa, etc. y
será el encargado de administrar horarios en el transcurso de la semana
a los vigilantes que estén bajo el control de él.

**¿Para quién está dirigida?**

El objetivo fué darle una facilidad a los usuarios o a las personas que
viven dentro de una comunidad pequeña, el hecho de estar más
informadas de lo que pasa, que puedan compartir información para
informar a otras personas, y sobre todo el hecho de que se incluyan
más en la formación de una comunidad, ya que hoy en día en colonias o
en pequeños pueblos, siempre existe la formación de grupos en físico,
pero a medida que la tecnología ha avanzado las personas cada vez
más se han sumergido en el mundo de la tecnología.

**¿Qué problema resuelve?**

Ayudar a las personas que tienen problemas para estar informadas, y poder 
brindarles una opción en crecimiento para poder informarse con facilidad, 
que son las tecnologías, y también el hecho de tener una interfaz fácil de 
manejar y bastante intuitiva.

📦 **Requisitos Previos**

Node.js >= v22.20.0

NPM >= 10.9.3

Git

Cuenta en: https://www.mongodb.com/ y un cluster creado.

⚙️ **Instalación**

Paso 1: Abrir terminal en la ruta que le resulte conveniente y ejecute la siguiente instrucción: git clone https://github.com/golic98/ProyectoIS2025

Paso 2: Abrir la carpeta y encontrará 2 sub-carpetas: client y service, abrir 2 terminales y colocar: cd cliente (en la primera terminal) y luego cd service (en la otra terminal), y en ellas debe hacer: npm install, para que se instalen todas las dependencias.

▶️ **Ejecución de la Aplicación**

En la terminal que utilizó para la sub-carpeta client hacer: npm run dev.
En la terminal que utilizó para la sub-carpeta service hacer: npm run dev.

🔐 **Variables de Entorno**

En la sub-carpeta llamada client, debe colocar en la ubicación raíz un archivo: .env.
Y debe colocar lo siguiente: 

VITE_APP_API_URL = "http://localhost:1234/api"

En la sub-carpeta llamada service, debe colocar en la ubicación raíz un archivo: .env.
Y debe colocar lo siguiente, donde usuario y password son las credenciales del cluster que creó:

MONGO_URL=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority

PORT=3000

JWT_SECRET=changeme



📘 2️⃣ **Documentación de Arquitectura**

📌 **Diagrama de Arquitectura del Sistema**

![alt text](image-3.png)



🏗️  **Decisiones Arquitectónicas**

**React.js** ➝ permite una interfaz dinámica, rápida y modular para mejorar la experiencia del usuario.

**Node.js + Express** ➝ facilita crear una API eficiente en JavaScript con buen rendimiento y escalabilidad.

**MongoDB Atlas** ➝ base NoSQL perfecta para manejar publicaciones y datos flexibles sin esquemas rígidos.

**JWT** ➝ seguridad basada en tokens para manejo de roles (admin, usuario, vigilante).

**Arquitectura cliente-servidor** ➝ separa responsabilidades y facilita el mantenimiento del proyecto.


📁 **Estructura de Carpetas del Proyecto**

**Carpeta cliente**

![alt text](image.png)

**api**: Dentro de esta carpeta se almacenan las archivos que contienen las rutas que se establecieron 
en el backend.

**assets**: Aquí se guardan las imágenes que se utilizaron.

**components**: Aquí se guardan los archivos que se utilizaron en varias partes de la aplicación, como
tablas, barra de navegación y otros componentes.

**context**: Aquí existen 2 archivos donde se mandan a llamar las rutas de la carpeta api, y en estos se aplican las funcionalidades para los métodos correspondientes: POST, GET, UPDATE, DELETE.

**pages**: Aquí están carpetas como: admin, home, login, login-access, register, vigilant; En ellas están las vistas, como la estructura y sus diseños de cada rol que existe en nuestra aplicación.


**protected**: Archivos donde se maneja las configuraciones para poder aplicar, en cada rol, las rutas proteguidas.

**main.js**: Aquí se implementa el llamado de todas las funciones, y la gestión de las rutas, utilizando las mejores practicas para cada método.


**Carpeta de service**

![alt text](image-5.png)


**config**: Aquí está la parte de conexión a la base de datos en la nube.

**controllers**: Aquí se reciben las peticiones HTTP y devuelven una respuesta al cliente.

**libs**: Código reutilizable o utilidades generales que no pertenecen a una capa específica, por ejemplo: configuración de JWT.

**middlewares**: Funciones que se ejecutan antes de llegar al controller y sirven para validar, revisar permisos o transformar datos.

**models**: Representan la estructura de los datos y definen cómo luce una entidad en la base de datos.

**repository**: Es la capa encargada de hablar con la base de datos, contiene métodos como buscar, guardar, actualizar, eliminar.

**routes**: Define las rutas HTTP de la API (endpoints).

**schema**: Valida lo que envía el frontend.

**service**: Contienen la lógica de negocios, validan, aplican reglas, procesan información.

**app.js**: Es el punto principal de configuración de una aplicación Node.js con Express.



🗄️ **Diagrama de Base de Datos**


![alt text](image-6.png)


📘 **4️⃣. Manual de Desarrollo / Contribución**

**🧩 4.1. Guía de Estilo de Código**

✔ JavaScript Standard Style
✔ Variables y funciones en camelCase
✔ Uso de async/await en lugar de then/catch
✔ Código modular y reutilizable


🔄 **4.2. Estrategia de Branching (GIT)**

**Rama**

main: Contiene la versión estable y en producción

develop: Funcionalidades completas pero en pruebas

🛠 **4.3. Cómo Agregar Nuevas Funcionalidades**

Guía paso a paso para futuros desarrolladores:

**Paso 1**: Crear nueva rama

git checkout -b feature/nueva-funcionalidad

**Paso 2**: Seguir una estructura de carpetas, por ejemplo: en capas

**Paso 3**: Validar entrada de datos con schemas.

**Paso 4**: Probar en local con: npm run dev

**Paso 5**: Escribir commits con convención conventional commits: 

**feat**: Nueva funcionalidad

**fix**: Corrección de error

**docs**: Documentación

**refactor**: Mejora sin cambiar comportamiento

**Paso 6**: Hacer Pull Request describiendo:

1. Qué se añadió

2. Qué problema soluciona

3. Cambios importantes del código


**📡 5️⃣. Documentación de API**

La documentación está en: http://localhost:1234/api-docs, cuando activa el servicio.

**DOCUMENTACIÓN DE LÓGICA DE NEGOCIO**

**1. Diagrama UML**

**1.1 Diagramas de Casos de Uso - Actores y sus interacciones con el sistema.**


![alt text](image-7.png)



**ENLACES DE PROYECTO EN DEPLOY**

https://deploy-vercel-frontendt-is.vercel.app/

https://deploy-vercel-backend-is.vercel.app/


**DOCUMENTACION DE PLAN DE PRUEBAS**

https://ucaedusv-my.sharepoint.com/:w:/g/personal/00214917_uca_edu_sv/IQBQUykDyuH3T5srPJStd7VwAZ1MF4RKqN4R93p3XjavFeQ?e=vj6wXM
