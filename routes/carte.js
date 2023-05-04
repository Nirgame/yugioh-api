// Import de express
var express = require("express");

// Définition du router
var router = express.Router();

// Import du Contrôleur carte
var carte_controller = require("../controllers/carte");

// ajout
router.post("/", carte_controller.create);

// afficher tout
router.get("/", carte_controller.getAll);

// afficher un seul
router.get("/:id", carte_controller.getById);

// modifier
router.put("/:id", carte_controller.update);

// suppression
router.delete("/:id", carte_controller.delete);

// afficher celon utilisateur
router.get("/user/:id", carte_controller.getByUser);

// suppression celon utilisateur
router.get("/user/:id", carte_controller.deleteByUser);

// Export du router
module.exports = router;
