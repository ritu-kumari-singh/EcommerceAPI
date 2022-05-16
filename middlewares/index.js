const ObjectId = require("mongoose").Types.ObjectId;
/**
middleware to format the result to be displayed to the user and incase of empty result display error message
 */
module.exports.formatResult = (req, res, next) => {
  let statusCode = 200;
  let statusBody = {};

  if (res.locals.result) {
    res.locals.result.data = res.locals.result.data || {};
    statusBody = res.locals.result;
  } else {
    statusCode = 204;
  }
  return res.status(statusCode).send(statusBody);
};

/**
 middleware to handle incoming request as per the request method
 */
module.exports.parameterPrepare = (req, res, next) => {
  if (req.method == "POST") {
    let url = req._parsedUrl.pathname.split("/", -1);
    if (url[3] != undefined && url[3] === "update_quantity") {
      res.locals.params = {
        id: url[2],
        quantity: req.query.number,
      };
    } else {
      res.locals.params = req.body;
    }
  } else if (req.method === "DELETE") {
    res.locals.params = { id: req._parsedUrl.pathname.split("/", -1)[2] };
  }
  next();
};

//validate the request parameters
module.exports.requestCheck = function (req, res, next) {
  console.log("Performing Parameter Check");
  let valid_value = true;
  let params = {};
  if (res.locals && res.locals.params) {
    Object.keys(res.locals.params).every((key) => {
      let value = res.locals.params[key];
      if (typeof value === "string" || value instanceof String) {
        value = value.trim();
      }
      try {
        switch (key) {
          // the id should be a valid mongoose object id
          case "id":
            valid_value =
              ObjectId.isValid(value) && String(new ObjectId(value)) === value;
            break;
          //name should be a non empty string
          case "name":
            valid_value =
              value &&
              (typeof value === "string" || value instanceof String) &&
              value.length > 0;
            break;
          //quantity should be non empty number
          case "quantity":
            valid_value = value && !isNaN(value);
            break;
        }
      } catch (e) {
        console.log(e);
        valid_value = false;
        return res.status(417).send({
          error: "invalid_request",
          error_description: `Parameter value is not correctly formatted`,
        });
      }
      if (!valid_value) {
        return false;
      }
      params[key] = value;
      return true;
    });
  }
  //if all parameters are valid send request to next middleware else display error message
  if (valid_value) {
    res.locals.valid_params = params;
    res.locals.validated = true;
    return next();
  } else {
    return res.status(417).send({
      error: "invalid_request",
      error_description: `Parameter value is not correctly formatted`,
    });
  }
};
