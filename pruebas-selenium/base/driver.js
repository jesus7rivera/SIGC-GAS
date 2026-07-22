import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

export const crearDriver = async () => {
  const opciones = new chrome.Options();
  const esEntornoCI = process.env.CI === "true";

  if (esEntornoCI) {
    opciones.addArguments(
      "--headless=new",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--window-size=1440,900"
    );
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(opciones)
    .build();

  if (!esEntornoCI) {
    await driver.manage().window().maximize();
  }

  return driver;
};