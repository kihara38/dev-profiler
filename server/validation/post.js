const validator = require("validator");
const { validate } = require("../models/User");
const isEmpty = require("./is-empty");

module.exports = function ValidatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  
  if(!validator.isLength(data.text,{min:10,max:300})){
    errors.text='post must be 10-300 characters';
  }
  
  if (validator.isEmpty(data.text)) {
    errors.text = 'text field is required';
  }
  

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
