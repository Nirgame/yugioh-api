// (Étape 1) Import du DRM mongoose
var mongoose = require("mongoose");
const utilisateur = require("./utilisateur");

// (Étape 2) Définition du schéma carte
// https://mongoosejs.com/docs/guide.html
// https://mongoosejs.com/docs/schematypes.html#schematype-options
const carteSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  cardName: { type: String, required: true },
  cardType: {
    type: String,
    required: true,
    enum: ["Magie", "Piège", "Monstre"],
  },
  cardDescription: { type: String, required: true },
  utilisateur: { type: Number, required: true, ref: "utilisateurs" },
});

// (Étape 3) Création d'une nouvelle propriété virtuelle "id" qui aura la valeur de la propriété "_id"
carteSchema.virtual("id").get(function () {
  return this._id;
});

// (Étape 3) Définition de l'object qui sera retourné lorsque la méthode toJSON est appelée
carteSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

// (Étape 4) Export du modèle carte
// Les modèles sont responsables de la création et de la lecture des documents à partir de la base de données MongoDB.
module.exports = mongoose.model("cartes", carteSchema);
