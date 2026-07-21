import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true
    },
    nombre: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      default: "Activo"
    }
  },
  {
    timestamps: true
  }
);

const Cliente = mongoose.model("Cliente", clienteSchema);

export default Cliente;