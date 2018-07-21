/* global $, bookmarkList, api, store, eventListeners */
'use strict';


const store = (function() {

  let bookmarks = [];


  const addBookmark = function(obj) {
    this.bookmarks.push(obj);
  };


  const deleteBookmark = function(id) {
    this.bookmarks = this.bookmarks.filter( index => index.id !== id );
  };


  //finds bookmark by id
  //reassigns its values to the new Data
  const updateBookmark = function(idString, newData) {
    const id = parseInt(idString);
    Object.assign(this.bookmarks.find( index => index.id === id ), newData);
  };



  return {
    minRating: 0,
    showAddForm: false,
    bookmarks, 
    addBookmark,
    updateBookmark,
    deleteBookmark
  };
}());