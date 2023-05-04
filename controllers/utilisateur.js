// Import du modèle utilisateur
var Utilisateur = require("../models/utilisateur");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const utilisateurValidationRules = () => {
  return [
    body("name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Name must be specified."),

    body("origine")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Origine must be specified."),

    body("userUrl")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Url must be specified."),
  ];
};

const paramIdValidationRule = () => {
  return [
    param("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

const bodyIdValidationRule = () => {
  return [
    body("id")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Id must be specified.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ];
};

// Méthode de vérification de la conformité de la requête
const checkValidity = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    errors: extractedErrors,
  });
};

// Create
exports.create = [
  bodyIdValidationRule(),
  utilisateurValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de utilisateur à ajouter
    var utilisateur = new Utilisateur({
      _id: req.body.id,
      name: req.body.name,
      origine: req.body.origine,
      userUrl: req.body.userUrl,
    });

    // Ajout de utilisateur dans la bdd
    utilisateur.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("User created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Utilisateur.find(function (err, result) {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(result);
  });
};

exports.getById = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Utilisateur.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
  },
];

// Update
exports.update = [
  paramIdValidationRule(),
  utilisateurValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de utilisateur à modifier
    var utilisateur = new Utilisateur({
      _id: req.body.id,
      name: req.body.name,
      origine: req.body.origine,
      userUrl: req.body.userUrl,
    });

    Utilisateur.findByIdAndUpdate(
      req.params.id,
      utilisateur,
      function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if (!result) {
          res
            .status(404)
            .json("User with id " + req.params.id + " is not found !");
        }
        return res.status(201).json("User updated successfully !");
      }
    );
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Utilisateur.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("User with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("User deleted successfully !");
    });
  },
];
