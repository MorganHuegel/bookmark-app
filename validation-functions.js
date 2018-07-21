'use strict';

const validateTitle = function(bookmarkObj){
  if(!bookmarkObj.title){
    const err = new Error('Bookmark must have a title');
    err.status = 400;
    console.log('ERR IN VALDIATE TITLE: ', err);
    return err;
  }

  if(typeof bookmarkObj.title !== 'string'){
    const err = new Error('Title field must be a string');
    err.status = 400;
    return err;
  }

};


const validateUrl = function(bookmarkObj){
  let err;
  if(!bookmarkObj.url){
    err = new Error('Bookmark must have a valid url');
    err.status = 400;
    return err;
  } else if (typeof bookmarkObj.url !== 'string'){
    err = new Error('URL must be a string');
    err.status = 400;
    return err;
  } else if (!bookmarkObj.url.toLowerCase().startsWith('http')){
    err = new Error('URL must start with `http://` or `https://`');
    err.status = 400;
    return err;
  } else if (bookmarkObj.url.length < 5){
    err = new Error('URL must be at least 5 characters in length');
    err.status = 400;
    return err;
  }
};


const validateRating = function(bookmarkObj){
  if(bookmarkObj.rating && typeof bookmarkObj.rating !== 'number'){
    const err = new Error('Rating must be a number');
    err.status = 400;
    return err;
  } else if (bookmarkObj.rating > 5 || bookmarkObj.rating < 0){
    const err = new Error('Rating must be between 1 and 5');
    err.status = 400;
    return err;
  }
};


const validateDescription = function(bookmarkObj){
  if(bookmarkObj.desc){
    if(typeof bookmarkObj.desc !== 'string'){
      const err = new Error('Description must be a string');
      err.status = 400;
      return err;
    }
    bookmarkObj.description = bookmarkObj.desc;
    delete bookmarkObj.desc;
  }
};


const validatePostRequest = function(bookmarkObj){
  const errArray = [
    validateTitle(bookmarkObj),
    validateUrl(bookmarkObj),
    validateDescription(bookmarkObj),
    validateRating(bookmarkObj),
  ];

  return errArray.find(err => {
    if(err){
      return err;
    }
  });
};


const validatePatchRequest = function(bookmarkObj){
  let err;
  if(bookmarkObj.title){
    err = validateTitle(bookmarkObj);
  }
  if(bookmarkObj.url){
    err = validateUrl(bookmarkObj);
  }
  if(bookmarkObj.desc){
    err = validateDescription(bookmarkObj);
  }
  if(bookmarkObj.rating){
    err = validateRating(bookmarkObj);
  }

  if(err){
    return err;
  }
};




module.exports = {
  validatePatchRequest,
  validatePostRequest,
};