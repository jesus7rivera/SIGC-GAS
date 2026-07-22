import { By, until } from "selenium-webdriver";
import { crearDriver } from "../base/driver.js";
import { iniciarSesion } from "../base/login.js";
import { tomarCaptura } from "../base/helpers.js";

async function operadorNoAccedeClientes() {

    const driver = await crearDriver();

    try {

        console.log("======================================================");
        console.log("CASO CP-003");
        console.log("Operador no puede acceder al módulo Clientes");
        console.log("======================================================");

        await iniciarSesion(
            driver,
            "operador@sigcgas.com",
            "operador123"
        );

        // Verifica que el menú Clientes NO exista

        const menuClientes = await driver.findElements(
            By.css('a[href="/clientes"]')
        );

        if (menuClientes.length > 0) {
            throw new Error("El menú Clientes aparece para Operador.");
        }

        console.log("✓ Menú Clientes oculto correctamente.");

        // Intento de acceso directo

        await driver.get("http://localhost:5173/clientes");

        await driver.sleep(1500);

        const urlActual = await driver.getCurrentUrl();

        if (urlActual.includes("/clientes")) {
            throw new Error("El Operador logró ingresar a Clientes.");
        }

        console.log("✓ Acceso directo bloqueado.");

        await tomarCaptura(
            driver,
            "caso_03_operador_sin_acceso"
        );

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

operadorNoAccedeClientes();