// Import du modèle student
var Carte = require("../models/carte");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const carteValidationRules = () => {
  return [
    body("cardName")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Card name must be specified."),

    body("cardType")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Card type must be specified.")
      .isAlphanumeric()
      .withMessage("Card type has non-alphanumeric characters."),

    body("cardDescription")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Card description must be specified."),

    body("cardUrl")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Card url must be specified."),

    body("utilisateur", "Invalid user")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Card user must be specified."),
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
  carteValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de carte à ajouter
    var carte = new Carte({
      _id: req.body.id,
      cardName: req.body.cardName,
      cardType: req.body.cardType,
      cardDescription: req.body.cardDescription,
      cardUrl: req.body.cardUrl,
      utilisateur: req.body.utilisateur,
    });

    // Ajout de carte dans la bdd
    carte.save(function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(201).json("Card created successfully !");
    });
  },
];

// Read
exports.getAll = (req, res, next) => {
  Carte.find()
    .populate("utilisateur")
    .exec(function (err, result) {
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
    Carte.findById(req.params.id)
      .populate("utilisateur")
      .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
      });
  },
];

exports.getByUser = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Carte.find({ utilisateur: req.params.id })
      .populate("utilisateur")
      .exec(function (err, result) {
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
  carteValidationRules(),
  checkValidity,
  (req, res, next) => {
    // Création de la nouvelle instance de carte à modifier
    var carte = new Carte({
      _id: req.body.id,
      cardName: req.body.cardName,
      cardType: req.body.cardType,
      cardDescription: req.body.cardDescription,
      cardUrl: req.body.cardUrl,
      utilisateur: req.body.utilisateur,
    });

    Carte.findByIdAndUpdate(req.params.id, carte, function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Card with id " + req.params.id + " is not found !");
      }
      return res.status(201).json("Card updated successfully !");
    });
  },
];

// Delete
exports.delete = [
  paramIdValidationRule(),
  checkValidity,
  (req, res, next) => {
    Carte.findByIdAndRemove(req.params.id).exec(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      if (!result) {
        res
          .status(404)
          .json("Card with id " + req.params.id + " is not found !");
      }
      return res.status(200).json("Card deleted successfully !");
    });
  },
];
