# Plan de Pruebas 🧪

Esta sección contiene la información y el acceso a la documentación correspondiente al aseguramiento de calidad (QA) y plan de pruebas ejecutado para el proyecto **Comunidad DDG**.

---

## 📋 Documentación de Plan de Pruebas

El plan de pruebas detallado incluye los escenarios de prueba funcionales y no funcionales, casos de prueba para el registro con OTP, control de acceso de vigilantes, mapas interactivos (SIG), pasarela de simulación de pagos, y validación de roles de seguridad.

Puedes consultar el documento oficial de pruebas en la siguiente dirección:

👉 [Documento Oficial del Plan de Pruebas (SharePoint)](https://ucaedusv-my.sharepoint.com/:w:/g/personal/00214917_uca_edu_sv/IQBQUykDyuH3T5srPJStd7VwAZ1MF4RKqN4R93p3XjavFeQ?e=vj6wXM)

---

## 🎯 Cobertura de las Pruebas

El plan de pruebas aborda las siguientes áreas críticas:

1.  **Autenticación y Roles**:
    *   Registro de usuarios, envío de correo de verificación y código OTP.
    *   Restricción de rutas en base a roles (`admin`, `vigilant`, `user`).
2.  **Muro de Publicaciones**:
    *   Creación de publicaciones e incidentes con coordenadas geográficas y carga de imágenes.
    *   Moderación y eliminación de contenido inapropiado por parte del rol administrador.
3.  **Módulo de Vigilancia**:
    *   Registro correcto de los datos del visitante (DUI, placa, casa destino).
    *   Visualización y administración de la agenda de turnos semanales de vigilantes.
4.  **Pagos**:
    *   Simulación de transacciones, validación del formato de tarjeta, CVC, y almacenamiento en base de datos.
