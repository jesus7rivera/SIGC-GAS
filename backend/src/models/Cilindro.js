import mongoose from "mongoose";

const cilindroSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: /^CIL-[A-Z0-9-]{1,20}$/,
    },

    tipo: {
      type: String,
      required: true,
      enum: [
        "Doméstico",
        "Industrial",
        "Comercial",
      ],
    },

    capacidad: {
      type: String,
      required: true,
      enum: [
        "10 Kg",
        "15 Kg",
        "45 Kg",
      ],
    },

    estado: {
      type: String,
      required: true,
      enum: [
        "Disponible",
        "Prestado",
        "Mantenimiento",
      ],
      default: "Disponible",
    },
  },
  {
    timestamps: true,
  },
);

const Cilindro = mongoose.model(
  "Cilindro",
  cilindroSchema,
);

export default Cilindro;