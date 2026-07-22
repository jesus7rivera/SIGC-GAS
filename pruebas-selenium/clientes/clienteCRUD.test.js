import { By, Key, until } from "selenium-webdriver";
import { crearDriver } from "../base/driver.js";
import { iniciarSesion } from "../base/login.js";
import { tomarCaptura } from "../base/helpers.js";

async function clienteCRUDTest() {
  const driver = await crearDriver();

  try {
    console.log("======================================================");
    console.log("CASO CP-004: CRUD Cliente");
    console.log("======================================================");

    await iniciarSesion(driver);

    await driver.get("http://localhost:5173/clientes");

    const dni = String(Date.now()).slice(-8);
    const nombreInicial = "Cliente Selenium";
    const nombreEditado = "Cliente Selenium Editado";
    const telefono = "987654321";

    await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Nuevo Cliente')]")),
      8000
    ).click();

    const inputs = await driver.findElements(By.css(".modal input"));

    await inputs[0].sendKeys(dni);
    await inputs[1].sendKeys(nombreInicial);
    await inputs[2].sendKeys(telefono);

    await driver.findElement(
      By.xpath("//button[contains(text(),'Guardar')]")
    ).click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${dni}')]`)),
      8000
    );

    console.log("✓ Cliente creado correctamente.");

    const buscador = await driver.findElement(
      By.css("input[placeholder='Buscar cliente por DNI o nombre...']")
    );

    await buscador.sendKeys(dni);

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${nombreInicial}')]`)),
      8000
    );

    console.log("✓ Cliente encontrado mediante búsqueda.");

    await driver.findElement(
      By.xpath("//button[contains(text(),'Editar')]")
    ).click();

    const inputsEditar = await driver.findElements(By.css(".modal input"));

    await inputsEditar[1].sendKeys(Key.CONTROL, "a");
    await inputsEditar[1].sendKeys(nombreEditado);

    await driver.findElement(
      By.xpath("//button[contains(text(),'Actualizar')]")
    ).click();

    await driver.wait(
      until.elementLocated(By.xpath(`//*[contains(text(),'${nombreEditado}')]`)),
      8000
    );

    console.log("✓ Cliente editado correctamente.");

    await driver.findElement(
      By.xpath("//button[contains(text(),'Eliminar')]")
    ).click();

    const alerta = await driver.switchTo().alert();
    await alerta.accept();

    await driver.sleep(1000);

    const pagina = await driver.getPageSource();

    if (pagina.includes(nombreEditado)) {
      throw new Error("El cliente no fue eliminado correctamente.");
    }

    console.log("✓ Cliente eliminado correctamente.");

    await tomarCaptura(driver, "caso_04_crud_cliente");

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

clienteCRUDTest();