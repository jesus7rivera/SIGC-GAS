import mongoose from "mongoose";

const responderErrorValidacion = (res, errores) => {
  return res.status(400).json({
    mensaje: "Datos de entrada inválidos",
    errores,
  });
};

const obtenerTextoLimpio = (valor) => {
  return typeof valor === "string"
    ? valor.trim()
    : "";
};

const obtenerCamposNoPermitidos = (
  cuerpo,
  camposPermitidos,
) => {
  return Object.keys(cuerpo).filter(
    (campo) => !camposPermitidos.includes(campo),
  );
};

export const validarCliente = (req, res, next) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responderErrorValidacion(res, [
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    ]);
  }

  const camposPermitidos = [
    "dni",
    "nombre",
    "telefono",
    "estado",
  ];

  const camposNoPermitidos =
    obtenerCamposNoPermitidos(
      cuerpo,
      camposPermitidos,
    );

  const errores = [];

  if (camposNoPermitidos.length > 0) {
    errores.push(
      `Campos no permitidos: ${camposNoPermitidos.join(", ")}`,
    );
  }

  const dni = obtenerTextoLimpio(cuerpo.dni);
  const nombre = obtenerTextoLimpio(cuerpo.nombre);
  const telefono = obtenerTextoLimpio(
    cuerpo.telefono,
  );

  const estado = obtenerTextoLimpio(
    cuerpo.estado || "Activo",
  );

  if (!/^\d{8}$/.test(dni)) {
    errores.push(
      "El DNI debe contener exactamente 8 dígitos.",
    );
  }

  if (
    nombre.length < 3 ||
    nombre.length > 100
  ) {
    errores.push(
      "El nombre debe tener entre 3 y 100 caracteres.",
    );
  }

  if (!/^\d{9}$/.test(telefono)) {
    errores.push(
      "El teléfono debe contener exactamente 9 dígitos.",
    );
  }

  const estadosPermitidos = [
    "Activo",
    "Inactivo",
  ];

  if (!estadosPermitidos.includes(estado)) {
    errores.push(
      "El estado debe ser Activo o Inactivo.",
    );
  }

  if (errores.length > 0) {
    return responderErrorValidacion(
      res,
      errores,
    );
  }

  req.body = {
    dni,
    nombre,
    telefono,
    estado,
  };

  next();
};

export const validarCilindro = (
  req,
  res,
  next,
) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responderErrorValidacion(res, [
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    ]);
  }

  const camposPermitidos = [
    "codigo",
    "tipo",
    "capacidad",
    "estado",
  ];

  const camposNoPermitidos =
    obtenerCamposNoPermitidos(
      cuerpo,
      camposPermitidos,
    );

  const errores = [];

  if (camposNoPermitidos.length > 0) {
    errores.push(
      `Campos no permitidos: ${camposNoPermitidos.join(", ")}`,
    );
  }

  const codigo = obtenerTextoLimpio(
    cuerpo.codigo,
  ).toUpperCase();

  const tipo = obtenerTextoLimpio(
    cuerpo.tipo,
  );

  const capacidad = obtenerTextoLimpio(
    cuerpo.capacidad,
  );

  const estado = obtenerTextoLimpio(
    cuerpo.estado || "Disponible",
  );

  if (!/^CIL-[A-Z0-9-]{1,20}$/.test(codigo)) {
    errores.push(
      "El código debe comenzar con CIL- y contener solo letras, números o guiones.",
    );
  }

  const tiposPermitidos = [
    "Doméstico",
    "Industrial",
    "Comercial",
  ];

  if (!tiposPermitidos.includes(tipo)) {
    errores.push(
      "El tipo debe ser Doméstico, Industrial o Comercial.",
    );
  }

  const capacidadesPermitidas = [
    "10 Kg",
    "15 Kg",
    "45 Kg",
  ];

  if (
    !capacidadesPermitidas.includes(
      capacidad,
    )
  ) {
    errores.push(
      "La capacidad debe ser 10 Kg, 15 Kg o 45 Kg.",
    );
  }

  const estadosPermitidos = [
    "Disponible",
    "Prestado",
    "Mantenimiento",
  ];

  if (!estadosPermitidos.includes(estado)) {
    errores.push(
      "El estado debe ser Disponible, Prestado o Mantenimiento.",
    );
  }

  if (errores.length > 0) {
    return responderErrorValidacion(
      res,
      errores,
    );
  }

  req.body = {
    codigo,
    tipo,
    capacidad,
    estado,
  };

  next();
};

export const validarMovimiento = (
  req,
  res,
  next,
) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responderErrorValidacion(res, [
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    ]);
  }

  const camposPermitidos = [
    "cliente",
    "cilindro",
    "tipo",
    "observacion",
  ];

  const camposNoPermitidos =
    obtenerCamposNoPermitidos(
      cuerpo,
      camposPermitidos,
    );

  const errores = [];

  if (camposNoPermitidos.length > 0) {
    errores.push(
      `Campos no permitidos: ${camposNoPermitidos.join(", ")}`,
    );
  }

  const cliente = obtenerTextoLimpio(
    cuerpo.cliente,
  );

  const cilindro = obtenerTextoLimpio(
    cuerpo.cilindro,
  );

  const tipo = obtenerTextoLimpio(
    cuerpo.tipo,
  );

  const observacion = obtenerTextoLimpio(
    cuerpo.observacion,
  );

  if (!mongoose.isValidObjectId(cliente)) {
    errores.push(
      "El identificador del cliente no es válido.",
    );
  }

  if (!mongoose.isValidObjectId(cilindro)) {
    errores.push(
      "El identificador del cilindro no es válido.",
    );
  }

  const tiposPermitidos = [
    "Salida",
    "Devolución",
    "Mantenimiento",
    "Fin de mantenimiento",
  ];

  if (!tiposPermitidos.includes(tipo)) {
    errores.push(
      "El tipo debe ser Salida, Devolución," + "Mantenimiento o Fin de mantenimiento.",
    );
  }

  if (observacion.length > 250) {
    errores.push(
      "La observación no puede superar los 250 caracteres.",
    );
  }

  if (errores.length > 0) {
    return responderErrorValidacion(
      res,
      errores,
    );
  }

  req.body = {
    cliente,
    cilindro,
    tipo,
    observacion,
  };

  next();
};

export const validarUsuario = (
  req,
  res,
  next,
) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responderErrorValidacion(res, [
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    ]);
  }

  const camposPermitidos = [
    "nombre",
    "correo",
    "password",
    "rol",
  ];

  const camposNoPermitidos =
    obtenerCamposNoPermitidos(
      cuerpo,
      camposPermitidos,
    );

  const errores = [];

  if (camposNoPermitidos.length > 0) {
    errores.push(
      `Campos no permitidos: ${camposNoPermitidos.join(", ")}`,
    );
  }

  const nombre = obtenerTextoLimpio(
    cuerpo.nombre,
  );

  const correo = obtenerTextoLimpio(
    cuerpo.correo,
  ).toLowerCase();

  const password =
    typeof cuerpo.password === "string"
      ? cuerpo.password
      : "";

  const rol = obtenerTextoLimpio(
    cuerpo.rol,
  );

  if (
    nombre.length < 3 ||
    nombre.length > 100
  ) {
    errores.push(
      "El nombre debe tener entre 3 y 100 caracteres.",
    );
  }

  const formatoCorreo =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    correo.length > 150 ||
    !formatoCorreo.test(correo)
  ) {
    errores.push(
      "El correo electrónico no tiene un formato válido.",
    );
  }

  if (
    password.length < 8 ||
    password.length > 72
  ) {
    errores.push(
      "La contraseña debe tener entre 8 y 72 caracteres.",
    );
  }

  const rolesPermitidos = [
    "Administrador",
    "Operador",
  ];

  if (!rolesPermitidos.includes(rol)) {
    errores.push(
      "El rol debe ser Administrador u Operador.",
    );
  }

  if (errores.length > 0) {
    return responderErrorValidacion(
      res,
      errores,
    );
  }

  req.body = {
    nombre,
    correo,
    password,
    rol,
  };

  next();
};

export const validarLogin = (
  req,
  res,
  next,
) => {
  const cuerpo = req.body;

  if (
    !cuerpo ||
    typeof cuerpo !== "object" ||
    Array.isArray(cuerpo)
  ) {
    return responderErrorValidacion(res, [
      "El cuerpo de la solicitud debe ser un objeto JSON.",
    ]);
  }

  const camposPermitidos = [
    "correo",
    "password",
  ];

  const camposNoPermitidos =
    obtenerCamposNoPermitidos(
      cuerpo,
      camposPermitidos,
    );

  const errores = [];

  if (camposNoPermitidos.length > 0) {
    errores.push(
      `Campos no permitidos: ${camposNoPermitidos.join(", ")}`,
    );
  }

  const correo = obtenerTextoLimpio(
    cuerpo.correo,
  ).toLowerCase();

  const password =
    typeof cuerpo.password === "string"
      ? cuerpo.password
      : "";

  const formatoCorreo =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    correo.length > 150 ||
    !formatoCorreo.test(correo)
  ) {
    errores.push(
      "El correo electrónico no tiene un formato válido.",
    );
  }

  if (
    password.length === 0 ||
    password.length > 72
  ) {
    errores.push(
      "La contraseña es obligatoria y no puede superar los 72 caracteres.",
    );
  }

  if (errores.length > 0) {
    return responderErrorValidacion(
      res,
      errores,
    );
  }

  req.body = {
    correo,
    password,
  };

  next();
};

export const validarParametroObjectId = (
  nombreParametro,
) => {
  return (req, res, next) => {
    const valorParametro =
      req.params[nombreParametro];

    if (
      !mongoose.isValidObjectId(
        valorParametro,
      )
    ) {
      return responderErrorValidacion(res, [
        `El parámetro ${nombreParametro} no contiene un identificador válido.`,
      ]);
    }

    next();
  };
};