# Manual de Desarrollo y Contribución 📘

Esta guía está diseñada para desarrolladores que desean contribuir al proyecto. Sigue estos estándares para asegurar la calidad y consistencia del código.

---

## 🧩 Guía de Estilo de Código

Para mantener el código legible y limpio, el equipo utiliza las siguientes reglas:

*   **Estándar de Formato**: Seguir la convención *JavaScript Standard Style*.
*   **Nomenclatura**: 
    *   Variables, constantes y funciones en `camelCase` (ej: `getUserData`, `isVerified`).
    *   Componentes de React en `PascalCase` (ej: `NavBarVigilant`, `UpdateTaskForm`).
*   **Asincronía**: Priorizar siempre el uso de `async/await` en lugar de encadenar promesas con `.then().catch()`.
*   **Arquitectura Limpia**: Mantener el código modular, desacoplado y reutilizable. La lógica de negocio pesada debe ir en los servicios correspondientes (`service/src/services`), no en los controladores o vistas.

---

## 🔄 Estrategia de Branching (Git Flow Simplificado)

El repositorio cuenta con dos ramas principales para controlar el ciclo de vida del software:

| Rama | Descripción | Estado de Estabilidad |
| :--- | :--- | :--- |
| `main` | Código en producción listo para usuarios finales. | **Estable y Protegida** |
| `develop` | Código de integración con funcionalidades terminadas en periodo de pruebas. | **Pre-estable / En Pruebas** |

> [!WARNING]
> Nunca envíes cambios directamente a la rama `main`. Todas las modificaciones deben ingresar a través de Pull Requests dirigidas a la rama `develop`.

---

## 🛠️ Cómo Agregar Nuevas Funcionalidades

Sigue este proceso paso a paso al desarrollar una nueva característica o solucionar un error:

### Paso 1: Crear una rama de desarrollo
Crea una rama a partir de `develop` utilizando un nombre descriptivo:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-de-tu-funcionalidad
# O si es una corrección
git checkout -b fix/nombre-del-error
```

### Paso 2: Desarrollar respetando la arquitectura de capas
*   **Frontend**: Organiza tus componentes dentro de `client/src/components` o `client/src/pages` según corresponda. Define interfaces tipadas en `client/src/interfaces/` si estás manejando datos nuevos.
*   **Backend**: Divide el código según la arquitectura establecida en `service/src`:
    1.  Define el endpoint en `routes/`.
    2.  Valida la entrada con schemas Zod en `schema/`.
    3.  Implementa la lógica del negocio en `services/`.
    4.  Interactúa con la base de datos a través de `repository/`.
    5.  Vincula la petición y la respuesta en `controllers/`.

### Paso 3: Validar la entrada de datos
Siempre valida las entradas de datos en el backend mediante un middleware de validación con esquemas adecuados para proteger el servidor de datos corruptos o ataques de inyección.

### Paso 4: Pruebas locales
Asegúrate de ejecutar y probar el sistema localmente antes de confirmar los cambios:
```bash
# En el cliente
npm run dev

# En el servicio backend
npm run dev
```

### Paso 5: Realizar Commits con Convención
Utiliza la estructura de **Conventional Commits** para tus mensajes de confirmación:

*   `feat: <descripción>` - Nueva funcionalidad.
*   `fix: <descripción>` - Corrección de un error.
*   `docs: <descripción>` - Cambios en la documentación.
*   `refactor: <descripción>` - Refactorización de código sin cambiar su funcionalidad.
*   `style: <descripción>` - Cambios estéticos de código o diseño.

*Ejemplo:* `feat: add filter by date in vigilant schedules page`

### Paso 6: Solicitar Pull Request (PR)
Sube tu rama y abre una Pull Request detallando:

1.  **Qué se añadió**: Explicación breve de las características creadas.
2.  **Qué problema soluciona**: Contexto o ID de la tarea/incidencia.
3.  **Cambios importantes**: Aspectos técnicos destacados que requieren revisión minuciosa.
