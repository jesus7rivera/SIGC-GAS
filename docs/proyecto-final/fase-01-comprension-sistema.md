# Fase 1 - Comprensión del Sistema

## 1. Descripción del sistema

SIGC-GAS (Sistema de Gestión y Control de Cilindros) es una
aplicación web desarrollada para la empresa CORSURSA, orientada
al control operativo de cilindros de gas.

El sistema permite gestionar clientes, cilindros, movimientos,
usuarios y consultar información operativa mediante un chatbot.

También incorpora mecanismos de autenticación, autorización por
roles y controles de seguridad para proteger el acceso al sistema.

---

## 2. Objetivo del sistema

Centralizar y mejorar el control de cilindros de gas de CORSURSA,
permitiendo registrar su estado, controlar movimientos de salida,
devolución y mantenimiento, realizar seguimiento de préstamos,
gestionar clientes y proporcionar información operativa para
apoyar la toma de decisiones.

El sistema también busca garantizar que las funcionalidades sean
utilizadas únicamente por usuarios autorizados según su rol.

---

## 3. Arquitectura del sistema

SIGC-GAS utiliza una arquitectura web cliente-servidor organizada
principalmente en tres capas.

### Capa de presentación

Corresponde al frontend desarrollado con React y Vite.

Sus principales responsabilidades son:

- Mostrar la interfaz gráfica.
- Gestionar la navegación.
- Mostrar información de clientes, cilindros y movimientos.
- Gestionar formularios.
- Mostrar el dashboard.
- Mostrar el chatbot.
- Gestionar la interfaz de usuarios.
- Consumir la API mediante Axios.

### Capa de aplicación

Corresponde al backend desarrollado con Node.js y Express.

Sus responsabilidades incluyen:

- Exponer los endpoints de la API REST.
- Ejecutar reglas de negocio.
- Gestionar autenticación.
- Aplicar autorización por roles.
- Controlar intentos fallidos de acceso.
- Gestionar clientes.
- Gestionar cilindros.
- Gestionar movimientos.
- Gestionar usuarios.
- Procesar consultas del chatbot.

### Capa de datos

El sistema utiliza MongoDB como base de datos y Mongoose como ODM.

Las principales entidades manejadas son:

- Usuarios.
- Clientes.
- Cilindros.
- Movimientos.

---

## 4. Comunicación entre componentes

La comunicación principal del sistema se representa de la
siguiente manera:

Frontend React
      |
      | HTTP / REST / JSON
      | JWT Bearer Token
      v
Backend Node.js + Express
      |
      | Mongoose
      v
MongoDB

El frontend realiza solicitudes HTTP a la API.

Cuando un usuario inicia sesión correctamente, el backend genera
un token JWT.

Las solicitudes a recursos protegidos incluyen el token mediante
el encabezado Authorization.

---

## 5. Tecnologías utilizadas

| Categoría | Tecnología | Uso |
|---|---|---|
| Frontend | React 19.2.6 | Desarrollo de la interfaz |
| Build frontend | Vite 8.0.12 | Desarrollo y compilación |
| Navegación | React Router DOM 7.18.0 | Gestión de rutas |
| Comunicación HTTP | Axios 1.18.1 | Consumo de API REST |
| Gráficos | Recharts 3.9.0 | Visualización de datos |
| Reportes PDF | jsPDF | Generación de documentos PDF |
| Tablas PDF | jspdf-autotable | Generación de tablas |
| Alertas | SweetAlert2 | Mensajes interactivos |
| Backend | Node.js | Entorno del servidor |
| API | Express 5.2.1 | Desarrollo de API REST |
| Base de datos | MongoDB | Persistencia |
| ODM | Mongoose 9.7.2 | Comunicación con MongoDB |
| Autenticación | JSON Web Token | Sesiones y autenticación |
| Seguridad | bcryptjs 3.0.3 | Hash de contraseñas |
| Calidad | ESLint | Análisis estático |
| Automatización | Selenium | Pruebas funcionales |
| CI/CD | GitHub Actions | Ejecución automática de pruebas |

---

## 6. Actores del sistema

### Administrador

Es el usuario con mayores privilegios dentro de SIGC-GAS.

Puede acceder a las funciones operativas y administrativas,
incluyendo gestión de clientes y gestión de usuarios.

Entre sus operaciones se encuentran:

- Iniciar sesión.
- Consultar dashboard.
- Gestionar clientes.
- Gestionar cilindros.
- Registrar movimientos.
- Utilizar el chatbot.
- Consultar usuarios.
- Desbloquear cuentas.
- Restablecer contraseñas.

### Operador

Es el usuario encargado principalmente de operaciones relacionadas
con cilindros y movimientos.

Puede:

- Iniciar sesión.
- Consultar dashboard.
- Gestionar cilindros.
- Registrar movimientos.
- Utilizar el chatbot.

No puede acceder a funciones administrativas como gestión de
clientes ni gestión de usuarios.

---

## 7. Módulos principales

| Módulo | Ruta Backend | Descripción |
|---|---|---|
| Autenticación | /api/auth | Inicio de sesión y seguridad |
| Dashboard | /api/dashboard | Información general |
| Clientes | /api/clientes | Gestión de clientes |
| Cilindros | /api/cilindros | Gestión de cilindros |
| Movimientos | /api/movimientos | Registro de operaciones |
| Chatbot | /api/chatbot | Consultas operativas |
| Usuarios | /api/usuarios | Gestión administrativa de usuarios |

---

## 8. Funcionalidades principales

### Autenticación

El sistema permite iniciar sesión mediante correo electrónico y
contraseña.

Después de cinco intentos fallidos consecutivos, la cuenta se
bloquea temporalmente durante cinco minutos.

### Gestión de clientes

El Administrador puede registrar, consultar, editar y eliminar
clientes.

### Gestión de cilindros

Permite registrar y controlar cilindros y sus estados.

Los cilindros pueden encontrarse en estados como Disponible,
Prestado o Mantenimiento.

### Gestión de movimientos

Permite registrar operaciones relacionadas con los cilindros,
incluyendo salidas, devoluciones y mantenimiento.

### Dashboard

Presenta información resumida sobre el estado operativo del
sistema.

### Chatbot

El chatbot permite realizar consultas relacionadas con la
información del negocio.

Entre las consultas implementadas se encuentran:

- Clientes activos.
- Clientes inactivos.
- Cilindros prestados.
- Cilindros en mantenimiento.
- Préstamos prolongados.
- Clientes sin actividad durante determinado número de días.
- Resumen de riesgos operativos.

El chatbot se presenta como un widget integrado al layout
principal del sistema.

### Gestión de usuarios

El Administrador puede consultar usuarios y visualizar su estado
de acceso.

También puede:

- Desbloquear cuentas bloqueadas.
- Restablecer contraseñas.

Las contraseñas son almacenadas mediante hash bcrypt y no son
expuestas mediante la API.

---

## 9. Casos de uso principales

| Código | Caso de uso | Actor |
|---|---|---|
| CU-01 | Iniciar sesión | Administrador / Operador |
| CU-02 | Consultar dashboard | Administrador / Operador |
| CU-03 | Gestionar clientes | Administrador |
| CU-04 | Gestionar cilindros | Administrador / Operador |
| CU-05 | Registrar movimientos | Administrador / Operador |
| CU-06 | Consultar chatbot | Administrador / Operador |
| CU-07 | Consultar préstamos prolongados | Administrador / Operador |
| CU-08 | Consultar clientes sin actividad | Administrador / Operador |
| CU-09 | Consultar resumen de riesgos | Administrador / Operador |
| CU-10 | Consultar usuarios | Administrador |
| CU-11 | Desbloquear cuenta | Administrador |
| CU-12 | Restablecer contraseña | Administrador |

---

## 10. Funcionalidades no integradas

En el código fuente existen los archivos:

- Reportes.jsx
- Configuraciones.jsx

Actualmente estos componentes no están registrados como rutas en
App.jsx y, por tanto, no se consideran módulos funcionales del
sistema para la presente evaluación.

---

## 11. Conclusión de la Fase 1

SIGC-GAS es una aplicación web cliente-servidor que integra
funciones operativas, administrativas y de seguridad para el
control de cilindros de gas.

La identificación de sus actores, arquitectura, tecnologías,
módulos y casos de uso permitirá posteriormente evaluar los
atributos de calidad y establecer requisitos no funcionales
medibles.