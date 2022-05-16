const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const middleware = require("../middlewares");

//middlewares to check and validate the incoming request
router.use(middleware.parameterPrepare);
router.use(middleware.requestCheck);

router.get("/products", productController.list);
router.post("/products/create", productController.create);
router.post("/products/:id/update_quantity", productController.update);
router.delete("/products/:id", productController.delete);
//middleware to format the result
router.use(middleware.formatResult);

module.exports = router;
