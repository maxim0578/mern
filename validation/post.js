const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};      
    data.text = !isEmpty(data.text)? data.text :'';

    if(Validator.isEmpty(data.text)){
        errors.text = 'text field is Required';
    }

    if(!Validator.isLength(data.text, {min:10,max:30})){
        errors.text = 'post must be between 10 and 30 Chars';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}