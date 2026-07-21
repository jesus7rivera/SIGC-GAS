import { Builder } from "selenium-webdriver";

export const crearDriver = async () => {
  const driver = await new Builder()
    .forBrowser("chrome")
    .build();

  await driver.manage().window().maximize();

  return driver;
};