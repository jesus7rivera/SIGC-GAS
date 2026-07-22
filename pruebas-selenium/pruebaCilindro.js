import { Builder, By, until } from "selenium-webdriver";

async function pruebaISO25010() {
  let driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    console.log("Iniciando prueba ISO 25010...");

    await driver.get("http://localhost:5173/cilindros");
    await driver.manage().window().maximize();

    const botonNuevo = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Cilindro')]")),
      5000
    );

    await botonNuevo.click();

    const campoCodigo = await driver.wait(
      until.elementLocated(By.css("input[placeholder='Ejemplo: CIL-003']")),
      5000
    );

    const codigoPrueba = "CIL-" + Date.now();

    await campoCodigo.sendKeys(codigoPrueba);

    const botonGuardar = await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    );

    await botonGuardar.click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${codigoPrueba}')]`)),
      8000
    );

    console.log("PASS - ISO 25010 Corrección Funcional");
    console.log(`Cilindro registrado correctamente: ${codigoPrueba}`);

  } catch (error) {
    console.log("FAIL - El cilindro no fue registrado correctamente");
    console.log(error.message);

    process.exitCode = 1;
  } finally {
    await driver.sleep(3000);
    await driver.quit();
  }
}

pruebaISO25010();