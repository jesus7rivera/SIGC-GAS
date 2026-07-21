import { By, until } from "selenium-webdriver";

export const iniciarSesion = async (
  driver,
  correo = "admin@sigcgas.com",
  password = "admin123"
) => {
  await driver.get("http://localhost:5173/login");

  const inputCorreo = await driver.wait(
    until.elementLocated(By.css("input[type='email']")),
    5000
  );

  const inputPassword = await driver.findElement(
    By.css("input[type='password']")
  );

  await inputCorreo.sendKeys(correo);
  await inputPassword.sendKeys(password);

  const botonLogin = await driver.findElement(
    By.xpath("//button[contains(text(),'Iniciar Sesión')]")
  );

  await botonLogin.click();

  await driver.wait(
    until.urlIs("http://localhost:5173/"),
    8000
  );
};