import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    correo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 150,
      match: /^[^\s@]+@[^.\s@]+(?:\.[^.\s@]+)+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 72,
    },

    rol: {
      type: String,
      required: true,
      enum: [
        "Administrador",
        "Operador",
      ],
      default: "Operador",
    },

    estado: {
      type: Boolean,
      default: true,
    },

    intentosFallidos: {
      type: Number,
      default: 0,
       min: 0,
    },

    bloqueadoHasta: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Usuario = mongoose.model(
  "Usuario",
  usuarioSchema,
);

export default Usuario;