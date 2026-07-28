import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },

    cilindro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cilindro",
      required: true,
    },

    tipo: {
      type: String,
      required: true,
      enum: [
        "Salida",
        "Devolución",
        "Mantenimiento",
      ],
    },

    observacion: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },

    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Movimiento = mongoose.model(
  "Movimiento",
  movimientoSchema,
);

export default Movimiento;