import {
  By,
  until,
} from "selenium-webdriver";

import {
  crearDriver,
} from "../base/driver.js";

import {
  iniciarSesion,
} from "../base/login.js";

import {
  tomarCaptura,
} from "../base/helpers.js";

const URL_USUARIOS =
  "http://localhost:5173/usuarios";

const CORREO_GESTION =
  "gestion.selenium@sigcgas.test";

const PASSWORD_NUEVA =
  "GestionNueva123";

const obtenerFilaUsuario = async (
  driver,
) => {
  return driver.wait(
    until.elementLocated(
      By.xpath(
        `//tr[
          td[
            contains(
              normalize-space(),
              '${CORREO_GESTION}'
            )
          ]
        ]`,
      ),
    ),
    8000,
  );
};

const obtenerEstadoFila = async (
  driver,
) => {
  const fila =
    await obtenerFilaUsuario(
      driver,
    );

  const celdas =
    await fila.findElements(
      By.css("td"),
    );

  return {
    fila,
    acceso:
      await celdas[4].getText(),
    intentos:
      await celdas[5].getText(),
  };
};

async function gestionUsuariosTest() {
  const driver =
    await crearDriver();

  try {
    console.log(
      "======================================================",
    );
    console.log(
      "CASO CP-009: Gestión segura de usuarios",
    );
    console.log(
      "======================================================",
    );

    await iniciarSesion(
      driver,
      "admin@sigcgas.com",
      "admin123",
    );

    await driver.get(
      URL_USUARIOS,
    );

    const estadoInicial =
      await obtenerEstadoFila(
        driver,
      );

    if (
      estadoInicial.acceso
      !== "Bloqueado"
    ) {
      throw new Error(
        "El usuario de gestión "
          + "debería iniciar Bloqueado.",
      );
    }

    if (
      estadoInicial.intentos
      !== "5"
    ) {
      throw new Error(
        "El usuario bloqueado debería "
          + "tener 5 intentos fallidos.",
      );
    }

    console.log(
      "✓ Usuario de prueba aparece Bloqueado con 5 intentos.",
    );

    const botonDesbloquear =
      await estadoInicial.fila
        .findElement(
          By.xpath(
            ".//button[contains(., 'Desbloquear')]",
          ),
        );

    await botonDesbloquear.click();

    const modalConfirmacion =
      await driver.wait(
        until.elementLocated(
          By.xpath(
            "//h2[contains(., 'Confirmar desbloqueo')]",
          ),
        ),
        5000,
      );

    if (!modalConfirmacion) {
      throw new Error(
        "No apareció el modal "
          + "de confirmación.",
      );
    }

    const botonConfirmar =
      await driver.findElement(
        By.xpath(
          "//div[contains(@class,'modal-overlay')]"
            + "//button[contains(., 'Desbloquear')]",
        ),
      );

    await botonConfirmar.click();

    await driver.wait(
      async () => {
        const estado =
          await obtenerEstadoFila(
            driver,
          );

        return (
          estado.acceso
            === "Activo"
          && estado.intentos
            === "0"
        );
      },
      8000,
    );

    console.log(
      "✓ Administrador desbloqueó la cuenta.",
    );

    await tomarCaptura(
      driver,
      "caso_09_gestion_usuarios",
    );

    const estadoDesbloqueado =
      await obtenerEstadoFila(
        driver,
      );

    const botonRestablecer =
      await estadoDesbloqueado.fila
        .findElement(
          By.xpath(
            ".//button[contains(., 'Restablecer')]",
          ),
        );

    await botonRestablecer.click();

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//h2[contains(., 'Restablecer contraseña')]",
        ),
      ),
      5000,
    );

    const inputsPassword =
      await driver.findElements(
        By.css(
          ".modal-overlay "
            + "input[type='password']",
        ),
      );

    if (
      inputsPassword.length
      !== 2
    ) {
      throw new Error(
        "El modal debería mostrar "
          + "dos campos de contraseña.",
      );
    }

    await inputsPassword[0]
      .sendKeys(
        PASSWORD_NUEVA,
      );

    await inputsPassword[1]
      .sendKeys(
        PASSWORD_NUEVA,
      );

    const botonGuardar =
      await driver.findElement(
        By.css(
          ".modal-overlay "
            + "button[type='submit']",
        ),
      );

    await botonGuardar.click();

    await driver.wait(
      async () => {
        const modales =
          await driver.findElements(
            By.css(
              ".modal-overlay",
            ),
          );

        return (
          modales.length === 0
        );
      },
      8000,
    );

    console.log(
      "✓ Contraseña restablecida desde la interfaz.",
    );

    const botonCerrarSesion =
      await driver.findElement(
        By.css(
          ".logout-button",
        ),
      );

    await botonCerrarSesion.click();

    await driver.wait(
      until.urlContains(
        "/login",
      ),
      5000,
    );

    await iniciarSesion(
      driver,
      CORREO_GESTION,
      PASSWORD_NUEVA,
    );

    console.log(
      "✓ Usuario inició sesión con la nueva contraseña.",
    );

    const menuUsuarios =
      await driver.findElements(
        By.css(
          'a[href="/usuarios"]',
        ),
      );

    if (
      menuUsuarios.length > 0
    ) {
      throw new Error(
        "El menú Usuarios aparece "
          + "para un Operador.",
      );
    }

    console.log(
      "✓ Menú Usuarios oculto para Operador.",
    );

    await driver.get(
      URL_USUARIOS,
    );

    await driver.sleep(
      1500,
    );

    const urlActual =
      await driver.getCurrentUrl();

    if (
      urlActual.includes(
        "/usuarios",
      )
    ) {
      throw new Error(
        "El Operador logró acceder "
          + "directamente a Usuarios.",
      );
    }

    console.log(
      "✓ Acceso directo a Usuarios bloqueado.",
    );

    console.log("");
    console.log(
      "RESULTADO: PASS",
    );
  } catch (error) {
    console.log("");
    console.log(
      "RESULTADO: FAIL",
    );
    console.log(
      error.message,
    );

    process.exitCode = 1;
  } finally {
    await driver.sleep(
      2000,
    );

    await driver.quit();
  }
}

gestionUsuariosTest();