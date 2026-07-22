import { By, until } from "selenium-webdriver";
import { crearDriver } from "../base/driver.js";
import { iniciarSesion } from "../base/login.js";
import { tomarCaptura } from "../base/helpers.js";

async function seleccionarPorTexto(driver, selectElement, texto) {
  const opciones = await selectElement.findElements(By.css("option"));

  for (const opcion of opciones) {
    const contenido = await opcion.getText();

    if (contenido.includes(texto)) {
      await opcion.click();
      return;
    }
  }

  throw new Error(`No se encontró la opción: ${texto}`);
}

async function seleccionarPrimeraOpcionValida(selectElement) {
  const opciones = await selectElement.findElements(By.css("option"));

  for (const opcion of opciones) {
    const valor = await opcion.getAttribute("value");

    if (valor && valor.trim() !== "") {
      await opcion.click();
      return;
    }
  }

  throw new Error("No existe ningún cliente disponible para seleccionar.");
}
async function movimientoEstadoTest() {
  const driver = await crearDriver();

  try {
    console.log("======================================================");
    console.log("CASO CP-006: Movimiento cambia estado del cilindro");
    console.log("======================================================");

    await iniciarSesion(driver);

    const codigo = "CIL-" + Date.now();

    await driver.get("http://localhost:5173/cilindros");

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Cilindro')]")),
      8000
    ).click();

    await driver.wait(
      until.elementLocated(By.css("input[placeholder='Ejemplo: CIL-003']")),
      8000
    ).sendKeys(codigo);

    await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    ).click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${codigo}')]`)),
      8000
    );

    console.log("✓ Cilindro creado para prueba.");

    await driver.get("http://localhost:5173/movimientos");

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Movimiento')]")),
      8000
    ).click();

    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Registrar Movimiento')]")),
      8000
    );

    let selects = await driver.findElements(By.css(".modal select"));

    await seleccionarPorTexto(
      driver,
      selects[0],
      "Cliente Selenium"
    );
    await seleccionarPorTexto(driver, selects[1], codigo);
    await seleccionarPorTexto(driver, selects[2], "Salida");

    await driver.findElement(
      By.css("input[placeholder='Ejemplo: Entrega a cliente']")
    ).sendKeys("Salida automatizada Selenium");

    await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    ).click();

    await driver.sleep(1500);

    await driver.get("http://localhost:5173/cilindros");

    await driver.findElement(
      By.css("input[placeholder='Buscar cilindro por código...']")
    ).sendKeys(codigo);

    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(),'Prestado')]")),
      8000
    );

    console.log("✓ Movimiento Salida cambió estado a Prestado.");

    await driver.get("http://localhost:5173/movimientos");

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Movimiento')]")),
      8000
    ).click();

    await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(),'Registrar Movimiento')]")),
      8000
    );

    selects = await driver.findElements(By.css(".modal select"));

    await seleccionarPorTexto(
      driver,
      selects[0],
      "Cliente Selenium"
    );
    await seleccionarPorTexto(driver, selects[1], codigo);
    await seleccionarPorTexto(driver, selects[2], "Devolución");

    await driver.findElement(
      By.css("input[placeholder='Ejemplo: Entrega a cliente']")
    ).sendKeys("Devolución automatizada Selenium");

    await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    ).click();

    await driver.sleep(1500);

    await driver.get("http://localhost:5173/cilindros");

    await driver.findElement(
      By.css("input[placeholder='Buscar cilindro por código...']")
    ).sendKeys(codigo);

    await driver.wait(
      until.elementLocated(By.xpath("//span[contains(text(),'Disponible')]")),
      8000
    );

    console.log("✓ Movimiento Devolución cambió estado a Disponible.");

    await tomarCaptura(driver, "caso_06_movimiento_estado");

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
}

movimientoEstadoTest();