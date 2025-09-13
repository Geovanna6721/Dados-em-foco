const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: true, // por padrão o usuário NÃO é admin
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
