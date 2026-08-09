import {
  By,
  until,
} from "selenium-webdriver";

import {
  crearDriver,
} from "../base/driver.js";

import {
  tomarCaptura,
} from "../base/helpers.js";

const URL_LOGIN =
  "http://localhost:5173/login";

const CORREO =
  "bloqueo.selenium@sigcgas.test";

const PASSWORD_CORRECTO =
  "bloqueo123";

const PASSWORD_INCORRECTO =
  "claveIncorrecta";

const completarLogin = async (
  driver,
  password,
) => {
  const inputCorreo = await driver.wait(
    until.elementLocated(
      By.css("input[type='email']"),
    ),
    8000,
  );

  const inputPassword =
    await driver.findElement(
      By.css("input[type='password']"),
    );

  await inputCorreo.clear();
  await inputPassword.clear();

  await inputCorreo.sendKeys(
    CORREO,
  );

  await inputPassword.sendKeys(
    password,
  );

  const botonLogin =
    await driver.findElement(
      By.css("button[type='submit']"),
    );

  await botonLogin.click();
};

const esperarMensaje = async (
  driver,
  texto,
) => {
  await driver.wait(
    until.elementLocated(
      By.xpath(
        `//*[contains(text(),'${texto}')]`,
      ),
    ),
    8000,
  );
};

async function bloqueoLoginTest() {
  const driver = await crearDriver();

  try {
    console.log(
      "======================================================",
    );

    console.log(
      "CASO CP-008: Bloqueo temporal de cuenta",
    );

    console.log(
      "======================================================",
    );

    await driver.get(
      URL_LOGIN,
    );

    for (
      let intento = 1;
      intento <= 4;
      intento += 1
    ) {
      await completarLogin(
        driver,
        PASSWORD_INCORRECTO,
      );

      await esperarMensaje(
        driver,
        "Correo o contraseña incorrectos.",
      );

      console.log(
        `✓ Intento incorrecto ${intento} rechazado.`,
      );

      await driver.navigate().refresh();
    }

    await completarLogin(
      driver,
      PASSWORD_INCORRECTO,
    );

    await esperarMensaje(
      driver,
      "Cuenta bloqueada temporalmente",
    );

    console.log(
      "✓ Quinto intento activó "
        + "el bloqueo temporal.",
    );

    await tomarCaptura(
      driver,
      "caso_08_bloqueo_login",
    );

    await driver.navigate().refresh();

    await completarLogin(
      driver,
      PASSWORD_CORRECTO,
    );

    await esperarMensaje(
      driver,
      "Cuenta bloqueada temporalmente",
    );

    console.log(
      "✓ La contraseña correcta fue "
        + "rechazada durante el bloqueo.",
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
    await driver.sleep(2000);
    await driver.quit();
  }
}

bloqueoLoginTest();