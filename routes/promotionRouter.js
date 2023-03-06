const express = require("express");
const Promotion = require("../models/promotion");
const authenticate = require("../authenticate");

const promotionRouter = express.Router();

promotionRouter
  .route("/")
  .get((req, res, next) => {
    Promotion.find()
      .then((Promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Promotions);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
      .then((Promotion) => {
        console.log("Promotion Created", Promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Promotion);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Promotions");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

promotionRouter
  .route("/:promotionId")
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((Promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Promotion);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /Promotions/${req.params.promotionId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((Promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Promotion);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = promotionRouter;
