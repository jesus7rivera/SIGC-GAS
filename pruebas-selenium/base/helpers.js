import fs from "fs";

export const tomarCaptura = async (driver, nombreArchivo) => {
  const imagen = await driver.takeScreenshot();

  if (!fs.existsSync("evidencias")) {
    fs.mkdirSync("evidencias");
  }

  fs.writeFileSync(
    `evidencias/${nombreArchivo}.png`,
    imagen,
    "base64"
  );
};