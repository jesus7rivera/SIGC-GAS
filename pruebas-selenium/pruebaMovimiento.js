import { Builder, By, until } from "selenium-webdriver";

async function pruebaMovimientoISO25010() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    console.log("Iniciando prueba ISO 25010 - Movimiento...");

    await driver.get("http://localhost:5173/cilindros");
    await driver.manage().window().maximize();

    const codigoPrueba = "CIL-" + Date.now();

    const botonNuevoCilindro = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Cilindro')]")),
      5000
    );

    await botonNuevoCilindro.click();

    const campoCodigo = await driver.wait(
      until.elementLocated(By.css("input[placeholder='Ejemplo: CIL-003']")),
      5000
    );

    await campoCodigo.sendKeys(codigoPrueba);

    const botonGuardarCilindro = await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    );

    await botonGuardarCilindro.click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${codigoPrueba}')]`)),
      8000
    );

    console.log(`Cilindro creado: ${codigoPrueba}`);

    await driver.get("http://localhost:5173/movimientos");

    const botonNuevoMovimiento = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Movimiento')]")),
      5000
    );

    await botonNuevoMovimiento.click();

    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Registrar Movimiento')]")),
      5000
    );

    const selects = await driver.findElements(By.css("select"));

    await selects[0].sendKeys("Juan");
    await selects[1].sendKeys(codigoPrueba);
    await selects[2].sendKeys("Salida");

    const inputObservacion = await driver.findElement(
      By.css("input[placeholder='Ejemplo: Entrega a cliente']")
    );

    await inputObservacion.sendKeys("Prueba Selenium ISO 25010");

    const botonGuardarMovimiento = await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    );

    await botonGuardarMovimiento.click();

    await driver.sleep(2000);

    await driver.get("http://localhost:5173/cilindros");

    await driver.wait(
      until.elementLocated(By.xpath(`//td[contains(text(),'${codigoPrueba}')]`)),
      8000
    );

    const pagina = await driver.getPageSource();

    if (pagina.includes(codigoPrueba) && pagina.includes("Prestado")) {
      console.log("PASS - ISO 25010 Corrección Funcional");
      console.log("El movimiento Salida actualizó el cilindro a Prestado.");
    } else {
      console.log("FAIL - El estado del cilindro no cambió correctamente.");

      process.exitCode = 1;
    }

  } catch (error) {
    console.log("FAIL - Error durante la prueba de movimiento");
    console.log(error.message);

    process.exitCode = 1;
  } finally {
    await driver.sleep(3000);
    await driver.quit();
  }
}

pruebaMovimientoISO25010();