import mongoose from "mongoose";

const cilindroSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true
    },
    tipo: {
      type: String,
      required: true
    },
    capacidad: {
      type: String,
      required: true
    },
    estado: {
      type: String,
      default: "Disponible"
    }
  },
  {
    timestamps: true
  }
);

const Cilindro = mongoose.model("Cilindro", cilindroSchema);

export default Cilindro;