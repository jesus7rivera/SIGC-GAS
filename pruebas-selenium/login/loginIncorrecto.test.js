import { By, until } from "selenium-webdriver";
import { crearDriver } from "../base/driver.js";
import { tomarCaptura } from "../base/helpers.js";

async function loginIncorrectoTest() {
  const driver = await crearDriver();

  try {
    console.log("======================================================");
    console.log("CASO CP-002: Login incorrecto");
    console.log("======================================================");

    await driver.get("http://localhost:5173/login");

    const inputCorreo = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      5000
    );

    const inputPassword = await driver.findElement(
      By.css("input[type='password']")
    );

    await inputCorreo.sendKeys("admin@sigcgas.com");
    await inputPassword.sendKeys("claveIncorrecta");

    const botonLogin = await driver.findElement(
      By.xpath("//button[contains(text(),'Iniciar Sesión')]")
    );

    await botonLogin.click();

    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(),'Correo o contraseña incorrectos')]")),
      8000
    );

    await tomarCaptura(driver, "caso_02_login_incorrecto");

    console.log("PASS - El sistema rechazó credenciales incorrectas");

  } catch (error) {
    console.log("FAIL - Error en login incorrecto");
    console.log(error.message);

    process.exitCode = 1;
  } finally {
    await driver.sleep(2000);
    await driver.quit();
  }
}

loginIncorrectoTest();