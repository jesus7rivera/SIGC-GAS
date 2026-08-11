# Fase 2 - Mapeo de Atributos de Calidad

## 1. Introducción

La presente fase identifica los principales atributos de calidad
aplicables al sistema SIGC-GAS.

El análisis considera el estado actual del sistema y las evidencias
existentes en el proyecto.

Los atributos evaluados son:

- Disponibilidad.
- Seguridad.
- Rendimiento.
- Escalabilidad.
- Mantenibilidad.
- Usabilidad.
- Portabilidad.
- Confiabilidad.

La evaluación consolidada no implica que todos los atributos cumplan
completamente los niveles esperados. Algunas mediciones específicas
permanecen no realizadas y se identifican explícitamente en las
fases posteriores de evaluación.

---

## 2. Matriz general de atributos de calidad

| Atributo | Aplicación en SIGC-GAS | Evidencia consolidada | Estado consolidado |
|---|---|---|---|
| Seguridad | Protege autenticación, autorización y contraseñas | JWT, bcrypt, roles, bloqueo temporal, gestión de usuarios, pruebas API y Selenium | Presente y probado |
| Rendimiento | Busca mantener tiempos de respuesta adecuados | Pruebas JMeter con 10 y 20 usuarios, 0 % de errores y p95 dentro de los límites definidos; permanece la advertencia del bundle de Vite | Medido y cumple |
| Usabilidad | Facilita la interacción con módulos y operaciones | Interfaz web, navegación lateral, chatbot, estados visuales, Selenium y pruebas de aceptación | Presente y evaluado |
| Disponibilidad | El sistema debe encontrarse accesible cuando sea requerido | Pruebas JMeter y API verifican continuidad en escenarios definidos; no se realizó la medición continua de 60 minutos | Evaluada parcialmente |
| Escalabilidad | Debe soportar crecimiento de usuarios, datos y operaciones | JMeter verificó carga de hasta 20 usuarios concurrentes; no se evaluó un conjunto ampliado de datos | Evaluada parcialmente |
| Mantenibilidad | Facilita corrección, prueba y evolución del código | SonarQube, ESLint, GitHub Actions, pruebas automatizadas y plan de mejora | Presente y medida |
| Portabilidad | Permite ejecutar el sistema en diferentes entornos | Uso de Node.js, React, variables de entorno y MongoDB | Parcialmente presente |
| Confiabilidad | Busca ejecutar las operaciones de forma consistente | Reglas de negocio, pruebas API, Selenium y pruebas de aceptación | Presente y probada |

---

# 3. Seguridad

## 3.1 Descripción

La seguridad es un atributo crítico en SIGC-GAS debido a que el
sistema administra usuarios, clientes, cilindros y operaciones del
negocio.

## 3.2 Controles implementados

SIGC-GAS incorpora actualmente:

- Autenticación mediante correo y contraseña.
- Tokens JWT para solicitudes protegidas.
- Hash de contraseñas mediante bcrypt.
- Autorización basada en roles.
- Separación entre Administrador y Operador.
- Bloqueo temporal después de cinco intentos fallidos.
- Bloqueo de cuenta durante cinco minutos.
- Desbloqueo administrativo.
- Restablecimiento administrativo de contraseña.
- Protección de rutas en frontend.
- Protección de endpoints en backend.
- Respuestas HTTP 401 y 403 según el tipo de acceso no autorizado.

## 3.3 Evidencias

Existen pruebas automatizadas de seguridad mediante API y Selenium.

Entre ellas:

- Login correcto.
- Login incorrecto.
- Restricción de acceso del Operador.
- Bloqueo temporal de cuenta.
- Gestión segura de usuarios.
- Validación de permisos HTTP 401 y 403.
- Validación del almacenamiento de contraseñas mediante bcrypt.

## 3.4 Estado consolidado

Presente y probado.

---

# 4. Rendimiento

## 4.1 Descripción

El rendimiento representa la capacidad del sistema para responder
dentro de tiempos aceptables ante las operaciones realizadas por
los usuarios.

## 4.2 Situación actual

El frontend y backend funcionan correctamente durante las pruebas
realizadas.

Sin embargo, durante el proceso de build de producción de Vite se
ha identificado una advertencia indicando que algunos archivos
generados superan los 500 kB después de la minificación.

El archivo JavaScript principal generado se encuentra actualmente
por encima de 1 MB antes de compresión.

También existe un recurso gráfico del logo de CORSURSA de
aproximadamente 2 MB.

## 4.3 Interpretación

Estos elementos no constituyen por sí mismos un fallo funcional,
pero representan posibles oportunidades de optimización del
rendimiento del frontend.

## 4.4 Evaluación realizada

Las pruebas de carga ejecutadas con JMeter permitieron medir:

- 10 usuarios concurrentes: 400 solicitudes, 0 % de errores y p95 de 389.60 ms.
- 20 usuarios concurrentes: 800 solicitudes, 0 % de errores y p95 de 732 ms.
- Operaciones de registro con 20 usuarios: 1200 solicitudes, 0 % de errores y p95 de 477.95 ms.
- Los criterios definidos para RNF-REN-01 a RNF-REN-04 fueron cumplidos.
- La optimización del bundle de Vite permanece como oportunidad de mejora.

Las mediciones fueron realizadas mediante JMeter y documentadas como evidencia de rendimiento.

## 4.5 Estado consolidado

Medido y cumple en los escenarios de carga definidos.

---

# 5. Usabilidad

## 5.1 Descripción

La usabilidad representa la facilidad con la que los usuarios
pueden aprender y utilizar el sistema.

## 5.2 Elementos implementados

SIGC-GAS incluye:

- Menú lateral de navegación.
- Identificación visual de CORSURSA.
- Separación de opciones según rol.
- Formularios para operaciones.
- Tablas para presentación de información.
- Botones diferenciados según acción.
- Estados visuales Activo y Bloqueado.
- Mensajes de error y confirmación.
- Modales propios del sistema.
- Chatbot accesible desde el layout principal.

## 5.3 Chatbot

El chatbot facilita consultas operativas utilizando preguntas en
lenguaje natural.

Permite consultar información como:

- Clientes activos e inactivos.
- Cilindros prestados.
- Cilindros en mantenimiento.
- Préstamos prolongados.
- Clientes sin actividad.
- Resumen de riesgos operativos.

## 5.4 Estado consolidado

Presente y evaluada.

La usabilidad fue complementada mediante criterios medibles
dentro de los requisitos no funcionales, Selenium y pruebas de aceptación.

---

# 6. Disponibilidad

## 6.1 Descripción

La disponibilidad representa la capacidad del sistema para estar
operativo y accesible cuando los usuarios lo requieran.

## 6.2 Situación actual

SIGC-GAS puede ejecutarse localmente mediante un servidor backend,
frontend y una instancia de MongoDB.

Actualmente no se dispone de una medición formal del porcentaje de
disponibilidad del sistema.

Tampoco se ha documentado todavía infraestructura de alta
disponibilidad, redundancia o recuperación automática ante fallos.

## 6.3 Estado consolidado

Evaluada parcialmente.

No se afirma un porcentaje global de disponibilidad porque
RNF-DIS-01 no fue medido durante una ventana continua de 60 minutos ni
existe infraestructura de alta disponibilidad que lo garantice.

---

# 7. Escalabilidad

## 7.1 Descripción

La escalabilidad representa la capacidad del sistema para mantener
su funcionamiento frente al crecimiento de usuarios, datos y
operaciones.

## 7.2 Situación actual

SIGC-GAS posee una arquitectura modular que separa:

- Frontend.
- API.
- Controladores.
- Servicios.
- Middleware.
- Repositorios.
- Base de datos.

Esta separación favorece futuras ampliaciones.

Las pruebas de carga con JMeter demostraron funcionamiento con
hasta 20 usuarios concurrentes y tiempos p95 dentro de los
umbrales definidos; RNF-ESC-03 no fue medido con un conjunto ampliado de datos.

## 7.3 Estado consolidado

Evaluada parcialmente mediante pruebas de carga.

---

# 8. Mantenibilidad

## 8.1 Descripción

La mantenibilidad representa la facilidad con la que el software
puede ser comprendido, corregido, probado y modificado.

## 8.2 Evidencias existentes

El proyecto presenta:

- Separación entre frontend y backend.
- Organización mediante rutas.
- Controladores.
- Servicios.
- Middleware.
- Modelos.
- Repositorios en componentes del chatbot.
- ESLint.
- Git y GitHub.
- Desarrollo mediante ramas.
- Pull Requests.
- GitHub Actions.
- Pruebas de API.
- Pruebas Selenium.
- Pruebas unitarias del chatbot.

## 8.3 Evaluación cuantitativa

SonarQube obtuvo Quality Gate PASSED y permitió medir:

- Maintainability Rating A con 24 incidencias residuales.
- Complejidad ciclomática global: 793.
- Complejidad cognitiva global: 390.
- Código duplicado: 3.1 %.
- Deuda técnica: 1 h 49 min; Debt Ratio: 0.0 %.

## 8.4 Estado consolidado

Presente y medida mediante análisis estático.

---

# 9. Portabilidad

## 9.1 Descripción

La portabilidad representa la facilidad para ejecutar o trasladar
el sistema entre diferentes entornos.

## 9.2 Evidencias existentes

SIGC-GAS utiliza tecnologías multiplataforma:

- Node.js.
- React.
- MongoDB.
- Navegadores web.

También utiliza variables de entorno para configurar elementos
como:

- Puerto del backend.
- URI de MongoDB.
- URL de la API.
- Secretos JWT.

La URL utilizada por el frontend puede configurarse mediante
VITE_API_URL.

## 9.3 Limitaciones actuales

No se ha realizado todavía una evaluación formal en diferentes
sistemas operativos o ambientes de despliegue.

## 9.4 Estado consolidado

Parcialmente presente.

---

# 10. Confiabilidad

## 10.1 Descripción

La confiabilidad representa la capacidad del sistema para realizar
sus funciones de forma consistente y mantener estados válidos ante
las operaciones realizadas.

## 10.2 Evidencias existentes

Actualmente existen pruebas automatizadas relacionadas con:

- Autenticación.
- Autorización.
- CRUD de clientes.
- Cambios de estado de cilindros.
- Salida y devolución.
- Ciclo de mantenimiento.
- Bloqueo temporal.
- Gestión de usuarios.
- Reglas de negocio.
- Chatbot.

Entre las reglas verificadas se encuentra el cambio correcto del
estado de un cilindro cuando se registra un movimiento.

## 10.3 Estado consolidado

Presente y probada mediante escenarios automatizados y de aceptación.

La evidencia obtenida permite confirmar la consistencia del sistema
en los escenarios cubiertos; no se establece una métrica de confiabilidad en producción.

---

# 11. Relación entre atributos y criterios de calidad

| Atributo | Ejemplo de criterio relacionado |
|---|---|
| Seguridad | Bloquear una cuenta después de cinco intentos fallidos |
| Rendimiento | Responder una consulta dentro de un tiempo máximo establecido |
| Usabilidad | Mostrar mensajes claros ante operaciones exitosas o fallidas |
| Disponibilidad | Mantener un nivel definido de disponibilidad durante el horario operativo |
| Escalabilidad | Mantener un tiempo aceptable ante múltiples usuarios concurrentes |
| Mantenibilidad | Mantener niveles aceptables de complejidad y deuda técnica |
| Portabilidad | Permitir configurar servicios mediante variables de entorno |
| Confiabilidad | Mantener consistencia del estado del cilindro ante movimientos válidos |

Los requisitos no funcionales medibles priorizados fueron establecidos en la Fase 3.

---

# 12. Conclusiones de la Fase 2

SIGC-GAS presenta actualmente fortalezas principalmente en los
atributos de Seguridad, Mantenibilidad, Usabilidad y Confiabilidad,
debido a los controles, estructura modular y pruebas existentes.

Los atributos de Rendimiento y Escalabilidad fueron evaluados
mediante JMeter y cumplieron los criterios definidos en los
escenarios medidos; Disponibilidad conserva RNF-DIS-01 sin medición formal.

La Portabilidad se encuentra parcialmente respaldada por el uso de
tecnologías multiplataforma y variables de entorno, pero todavía
requiere validación formal.

El resultado de esta fase se consolidó con los requisitos no
funcionales medibles priorizados y evaluados en la Fase 3.
