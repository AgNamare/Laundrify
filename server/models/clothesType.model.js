import mongoose from "mongoose";

const clothesTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const ClothesType = mongoose.model("ClothesType", clothesTypeSchema);

export default ClothesType
