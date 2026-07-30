import assert from "node:assert/strict";

import {
  describe,
  test,
} from "node:test";

import {
  normalizarMensaje,
} from "./textNormalizer.js";

import {
  extraerCantidad,
  extraerCodigoCilindro,
  extraerDni,
  extraerEstadoCilindro,
  extraerEstadoCliente,
  extraerParametros,
} from "./entityExtractor.js";

const normalizar = (mensaje) =>
  normalizarMensaje(mensaje);

describe(
  "Extracción del código de cilindro",
  () => {
    test(
      "extrae y convierte el código a mayúsculas",
      () => {
        const resultado =
          extraerCodigoCilindro(
            normalizar(
              "Busca el cilindro cil-001",
            ),
          );

        assert.equal(
          resultado,
          "CIL-001",
        );
      },
    );

    test(
      "admite códigos alfanuméricos",
      () => {
        const resultado =
          extraerCodigoCilindro(
            normalizar(
              "Consulta el cilindro CIL-A25",
            ),
          );

        assert.equal(
          resultado,
          "CIL-A25",
        );
      },
    );

    test(
      "devuelve null cuando no existe un código",
      () => {
        assert.equal(
          extraerCodigoCilindro(
            normalizar(
              "Muéstrame el historial del cilindro",
            ),
          ),
          null,
        );
      },
    );
  },
);

describe(
  "Extracción de DNI",
  () => {
    test(
      "extrae un DNI de ocho dígitos",
      () => {
        assert.equal(
          extraerDni(
            normalizar(
              "Busca al cliente con DNI 12345678",
            ),
          ),
          "12345678",
        );
      },
    );

    test(
      "no acepta números de nueve dígitos",
      () => {
        assert.equal(
          extraerDni(
            normalizar(
              "Busca el DNI 123456789",
            ),
          ),
          null,
        );
      },
    );

    test(
      "devuelve null cuando no encuentra un DNI",
      () => {
        assert.equal(
          extraerDni(
            normalizar(
              "Busca al cliente Juan Pérez",
            ),
          ),
          null,
        );
      },
    );
  },
);

describe(
  "Extracción del estado de cilindro",
  () => {
    test(
      "reconoce el estado Disponible",
      () => {
        assert.equal(
          extraerEstadoCilindro(
            normalizar(
              "Cilindros disponibles",
            ),
          ),
          "Disponible",
        );
      },
    );

    test(
      "reconoce el estado Prestado",
      () => {
        assert.equal(
          extraerEstadoCilindro(
            normalizar(
              "Cilindros prestados",
            ),
          ),
          "Prestado",
        );
      },
    );

    test(
      "reconoce el estado Mantenimiento",
      () => {
        assert.equal(
          extraerEstadoCilindro(
            normalizar(
              "Cilindros en mantenimiento",
            ),
          ),
          "Mantenimiento",
        );
      },
    );

    test(
      "devuelve null cuando falta el estado",
      () => {
        assert.equal(
          extraerEstadoCilindro(
            normalizar(
              "Muéstrame los cilindros",
            ),
          ),
          null,
        );
      },
    );
  },
);

describe(
  "Extracción del estado de cliente",
  () => {
    test(
      "reconoce clientes activos",
      () => {
        assert.equal(
          extraerEstadoCliente(
            normalizar(
              "Cantidad de clientes activos",
            ),
          ),
          "Activo",
        );
      },
    );

    test(
      "reconoce clientes inactivos",
      () => {
        assert.equal(
          extraerEstadoCliente(
            normalizar(
              "Cantidad de clientes inactivos",
            ),
          ),
          "Inactivo",
        );
      },
    );

    test(
      "reconoce todos los clientes registrados",
      () => {
        assert.equal(
          extraerEstadoCliente(
            normalizar(
              "Total de clientes registrados",
            ),
          ),
          "Todos",
        );
      },
    );

    test(
      "devuelve null cuando falta el estado",
      () => {
        assert.equal(
          extraerEstadoCliente(
            normalizar(
              "Busca un cliente",
            ),
          ),
          null,
        );
      },
    );
  },
);

describe(
  "Extracción de cantidad",
  () => {
    test(
      "extrae una cantidad numérica",
      () => {
        assert.equal(
          extraerCantidad(
            normalizar(
              "Muéstrame los últimos 7 movimientos",
            ),
          ),
          7,
        );
      },
    );

    test(
      "reconoce cantidades escritas",
      () => {
        assert.equal(
          extraerCantidad(
            normalizar(
              "Dame los últimos cinco movimientos",
            ),
          ),
          5,
        );
      },
    );

    test(
      "utiliza cinco como valor predeterminado",
      () => {
        assert.equal(
          extraerCantidad(
            normalizar(
              "Muéstrame los movimientos recientes",
            ),
          ),
          5,
        );
      },
    );

    test(
      "limita la cantidad máxima a diez",
      () => {
        assert.equal(
          extraerCantidad(
            normalizar(
              "Muéstrame los últimos 25 movimientos",
            ),
          ),
          10,
        );
      },
    );

    test(
      "reemplaza cantidades inválidas por el valor predeterminado",
      () => {
        assert.equal(
          extraerCantidad(
            normalizar(
              "Muéstrame los últimos 0 movimientos",
            ),
          ),
          5,
        );
      },
    );
  },
);

describe(
  "Extracción de parámetros por intención",
  () => {
    test(
      "extrae el estado para contar cilindros",
      () => {
        const parametros =
          extraerParametros(
            "contar_cilindros_estado",
            normalizar(
              "¿Cuántos cilindros están disponibles?",
            ),
          );

        assert.deepEqual(
          parametros,
          {
            estado: "Disponible",
          },
        );
      },
    );

    test(
      "extrae el código para consultar un historial",
      () => {
        const parametros =
          extraerParametros(
            "consultar_historial_cilindro",
            normalizar(
              "Historial del cilindro CIL-001",
            ),
          );

        assert.deepEqual(
          parametros,
          {
            codigo: "CIL-001",
          },
        );
      },
    );

    test(
      "extrae el estado para contar clientes",
      () => {
        const parametros =
          extraerParametros(
            "contar_clientes_estado",
            normalizar(
              "¿Cuántos clientes inactivos existen?",
            ),
          );

        assert.deepEqual(
          parametros,
          {
            estado: "Inactivo",
          },
        );
      },
    );

    test(
      "extrae la cantidad de movimientos recientes",
      () => {
        const parametros =
          extraerParametros(
            "consultar_movimientos_recientes",
            normalizar(
              "Dame los últimos siete movimientos",
            ),
          );

        assert.deepEqual(
          parametros,
          {
            cantidad: 7,
          },
        );
      },
    );
  },
);