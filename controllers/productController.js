const products = require("../models/products");

module.exports.create = function (req, res, next) {
  console.log("Creating new product");
  //check if the product already exists in table. If yes display error message. If not create the product
  products.findOne(
    { name: res.locals.valid_params.name },
    function (err, product) {
      if (err) {
        console.log("error acccessing database");
        return;
      }
      if (!product) {
        products.create(
          {
            name: res.locals.valid_params.name,
            quantity: res.locals.valid_params.quantity,
          },
          function (err, newProduct) {
            if (err) {
              console.log("Error creating new product");
              return;
            }
            res.locals.result = {
              data: {
                product: {
                  name: newProduct.name,
                  quantity: newProduct.quantity,
                },
              },
            };
            next();
          }
        );
      } else {
        res.locals.result = {
          data: {
            message:
              "Product already exists. Try updating the quantity instead of creating new product.",
          },
        };
        next();
      }
    }
  );
};
//  fetch the list of products and display to the user
module.exports.list = function (req, res, next) {
  console.log("Fetching product list");
  var list = [];
  products.find({}, function (err, products) {
    if (err) {
      console.log("Error fetching products list");
      return;
    }
    for (let product of products) {
      list.push({
        id: product["_id"].toString(),
        name: product.name,
        quantity: product.quantity,
      });
    }
    res.locals.result = {
      data: {
        product: list,
      },
    };
    next();
  });
};
//update quantity of product based on id given by user. If id is incorrect display error message
module.exports.update = function (req, res, next) {
  console.log("Updating product quantity");
  products.findByIdAndUpdate(
    res.locals.valid_params.id,
    { quantity: res.locals.valid_params.quantity },
    function (err, updatedProduct) {
      if (err) {
        console.log("Error accessing database");
        return;
      }
      if (updatedProduct) {
        res.locals.result = {
          data: {
            product: {
              id: updatedProduct["_id"].toString(),
              name: updatedProduct.name,
              quantity: updatedProduct.quantity,
            },
            message: "Updated Successfully",
          },
        };
        next();
      } else {
        res.locals.result = {
          data: {
            message: "Product id Incorrect",
          },
        };
        next();
      }
    }
  );
};
//delete product based on id. Display error message if id is not found or incorrect
module.exports.delete = function (req, res, next) {
  console.log("Performing delete action");
  let id = res.locals.valid_params.id;
  products.findByIdAndDelete(id, function (err, deletedProduct) {
    if (err) {
      console.log("Error accessing database");
      return;
    }
    if (deletedProduct) {
      res.locals.result = {
        data: {
          message: "Product deleted successfully",
        },
      };
      next();
    } else {
      res.locals.result = {
        data: {
          message: "Product id incorrect",
        },
      };
      next();
    }
  });
};
