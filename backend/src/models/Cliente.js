import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{8}$/,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    telefono: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{9}$/,
    },

    estado: {
      type: String,
      enum: [
        "Activo",
        "Inactivo",
      ],
      default: "Activo",
    },
  },
  {
    timestamps: true,
  },
);

const Cliente = mongoose.model(
  "Cliente",
  clienteSchema,
);

export default Cliente;