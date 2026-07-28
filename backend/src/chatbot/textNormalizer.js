export const normalizarMensaje = (mensaje) => {
  if (typeof mensaje !== "string") {
    return "";
  }

  return mensaje
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};