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

const seleccionarPorTexto = async (
  selectElement,
  texto,
) => {
  const opciones = await selectElement.findElements(
    By.css("option"),
  );

  for (const opcion of opciones) {
    const contenido = await opcion.getText();

    if (contenido.includes(texto)) {
      await opcion.click();
      return;
    }
  }

  throw new Error(
    `No se encontró la opción: ${texto}`,
  );
};

const verificarOpcionDisponible = async (
  selectElement,
  textoEsperado,
) => {
  const opciones = await selectElement.findElements(
    By.css("option"),
  );

  const textos = [];

  for (const opcion of opciones) {
    textos.push(
      (await opcion.getText()).trim(),
    );
  }

  if (!textos.includes(textoEsperado)) {
    throw new Error(
      `No apareció la opción ${textoEsperado}. ` +
        `Opciones encontradas: ${textos.join(", ")}`,
    );
  }
};

const verificarUnicoMovimientoPermitido = async (
  selectElement,
  textoEsperado,
) => {
  const opciones = await selectElement.findElements(
    By.css("option"),
  );

  const opcionesValidas = [];

  for (const opcion of opciones) {
    const valor =
      await opcion.getAttribute("value");

    if (valor?.trim()) {
      opcionesValidas.push(valor.trim());
    }
  }

  if (
    opcionesValidas.length !== 1 ||
    opcionesValidas[0] !== textoEsperado
  ) {
    throw new Error(
      "Las opciones del cilindro en mantenimiento " +
        `no son correctas: ${opcionesValidas.join(", ")}`,
    );
  }
};

const registrarMovimiento = async (
  driver,
  codigo,
  tipo,
  observacion,
  verificarOpcionUnica = false,
) => {
  await driver.get(
    "http://localhost:5173/movimientos",
  );

  await driver.wait(
    until.elementLocated(
      By.xpath(
        "//button[contains(text(),'Nuevo Movimiento')]",
      ),
    ),
    8000,
  ).click();

  const tituloModal = await driver.wait(
    until.elementLocated(
      By.xpath(
        "//h2[contains(text(),'Registrar Movimiento')]",
      ),
    ),
    8000,
  );

  const selectCliente =
    await driver.findElement(
      By.id("movimiento-cliente"),
    );

  const selectCilindro =
    await driver.findElement(
      By.id("movimiento-cilindro"),
    );

  const selectTipo =
    await driver.findElement(
      By.id("movimiento-tipo"),
    );

  await seleccionarPorTexto(
    selectCliente,
    "Cliente Selenium",
  );

  await seleccionarPorTexto(
    selectCilindro,
    codigo,
  );

  await driver.wait(
    async () => {
      const deshabilitado =
        await selectTipo.getAttribute(
          "disabled",
        );

      return deshabilitado === null;
    },
    5000,
  );

  await verificarOpcionDisponible(
    selectTipo,
    tipo,
  );

  if (verificarOpcionUnica) {
    await verificarUnicoMovimientoPermitido(
      selectTipo,
      tipo,
    );
  }

  await seleccionarPorTexto(
    selectTipo,
    tipo,
  );

  await driver.findElement(
    By.id("movimiento-observacion"),
  ).sendKeys(observacion);

  await driver.findElement(
    By.xpath(
      "//button[contains(text(),'Guardar')]",
    ),
  ).click();

  await driver.wait(
    until.stalenessOf(tituloModal),
    8000,
  );
};

const verificarEstadoCilindro = async (
  driver,
  codigo,
  estadoEsperado,
) => {
  await driver.get(
    "http://localhost:5173/cilindros",
  );

  const buscador = await driver.wait(
    until.elementLocated(
      By.css(
        "input[placeholder*='Buscar cilindro']",
      ),
    ),
    8000,
  );

  await buscador.clear();
  await buscador.sendKeys(codigo);

  await driver.wait(
    until.elementLocated(
      By.xpath(
        `//tr[.//*[contains(text(),'${codigo}')]]` +
          `//span[contains(text(),'${estadoEsperado}')]`,
      ),
    ),
    8000,
  );
};

const cicloMantenimientoTest = async () => {
  const driver = await crearDriver();

  try {
    console.log(
      "======================================================",
    );
    console.log(
      "CASO CP-007: Ciclo de mantenimiento del cilindro",
    );
    console.log(
      "======================================================",
    );

    await iniciarSesion(driver);

    const codigo = `CIL-MANT-${Date.now()}`;

    await driver.get(
      "http://localhost:5173/cilindros",
    );

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(text(),'Nuevo Cilindro')]",
        ),
      ),
      8000,
    ).click();

    await driver.wait(
      until.elementLocated(
        By.css(
          "input[placeholder='Ejemplo: CIL-003']",
        ),
      ),
      8000,
    ).sendKeys(codigo);

    await driver.findElement(
      By.xpath(
        "//button[contains(text(),'Guardar')]",
      ),
    ).click();

    await driver.wait(
      until.elementLocated(
        By.xpath(
          `//*[contains(text(),'${codigo}')]`,
        ),
      ),
      8000,
    );

    console.log(
      "✓ Cilindro disponible creado para prueba.",
    );

    await registrarMovimiento(
      driver,
      codigo,
      "Mantenimiento",
      "Ingreso a mantenimiento mediante Selenium",
    );

    await verificarEstadoCilindro(
      driver,
      codigo,
      "Mantenimiento",
    );

    console.log(
      "✓ El cilindro cambió de Disponible a Mantenimiento.",
    );

    await registrarMovimiento(
      driver,
      codigo,
      "Fin de mantenimiento",
      "Mantenimiento finalizado mediante Selenium",
      true,
    );

    console.log(
      "✓ El formulario mostró únicamente Fin de mantenimiento.",
    );

    await verificarEstadoCilindro(
      driver,
      codigo,
      "Disponible",
    );

    console.log(
      "✓ El cilindro cambió de Mantenimiento a Disponible.",
    );

    await tomarCaptura(
      driver,
      "caso_07_ciclo_mantenimiento",
    );

    console.log("");
    console.log("RESULTADO: PASS");
  } catch (error) {
    console.log("");
    console.log("RESULTADO: FAIL");
    console.log(error.message);

    process.exitCode = 1;
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
};

cicloMantenimientoTest();