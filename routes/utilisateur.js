// Import de express
var express = require("express");

// Définition du router
var router = express.Router();

// Import du Contrôleur utilisateur
var utilisateur_controller = require("../controllers/utilisateur");

// Ajout
router.post("/", utilisateur_controller.create);

// afficher tout
router.get("/", utilisateur_controller.getAll);

// afficher un seul
router.get("/:id", utilisateur_controller.getById);

// modifier
router.put("/:id", utilisateur_controller.update);

// supprimer
router.delete("/:id", utilisateur_controller.delete);

// Export du router
module.exports = router;
