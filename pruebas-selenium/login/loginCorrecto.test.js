import { By, until } from "selenium-webdriver";
import { crearDriver } from "../base/driver.js";
import { iniciarSesion } from "../base/login.js";
import { tomarCaptura } from "../base/helpers.js";

async function loginCorrectoTest() {
  const driver = await crearDriver();

  try {
    console.log("CASO 1: Login correcto como Administrador");

    await iniciarSesion(driver);

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Dashboard')]")),
      8000
    );

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Administrador')]")),
      8000
    );

    await tomarCaptura(driver, "caso_01_login_correcto");

    console.log("PASS - Login correcto validado correctamente");

  } catch (error) {
    console.log("FAIL - Error en login correcto");
    console.log(error.message);
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
}

loginCorrectoTest();