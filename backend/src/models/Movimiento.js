import mongoose from "mongoose";

const movimientoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true
    },
    cilindro: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cilindro",
      required: true
    },
    tipo: {
      type: String,
      required: true
    },
    observacion: {
      type: String,
      default: ""
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Movimiento = mongoose.model("Movimiento", movimientoSchema);

export default Movimiento;