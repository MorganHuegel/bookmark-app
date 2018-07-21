/* global $, bookmarkList, api, store, eventListeners */

'use strict';

const eventListeners = (function(){

  const handleRevealAddForm = function() {
    $('.js-alter-list').on('click', '.toggle-add-state', () => {
      store.showAddForm = true;
      bookmarkList.render();
    });
  };


  const handleHideAddForm = function() {
    $('.js-add-bookmark-form').on('click', 'button[type=reset]', () => {
      store.showAddForm = false;
      bookmarkList.render();
    });
  };


  const handleToggleExpandView = function() {
    $('ul').on('click', '.toggle-expand-view', event => {
      const expandedBool = bookmarkList.getDetailBoolFromElement(event.currentTarget);
      if(expandedBool === false){
        const currentId = bookmarkList.getIdFromElement(event.currentTarget);
        store.updateBookmark(`${currentId}`, {detailView: true});
        bookmarkList.render();
      } else {
        const currentId = bookmarkList.getIdFromElement(event.currentTarget);
        store.updateBookmark(`${currentId}`, {detailView: false});
        bookmarkList.render();
      }
    });
  };


  const handleBadTitle = function() {
    $('.js-add-bookmark-form').on('blur', '.js-add-title', () => {
      if ($('.js-add-title').val() === '') {
        const errMessage = 'HEADS-UP: Title must be at least 1 character long.';
        bookmarkList.displayErrorToaster(errMessage);
      }
    });
  };


  const handleBadUrl = function() {
    $('.js-add-bookmark-form').on('blur', '.js-add-url', () => {
      if ($('.js-add-url').val() === '') {
        const errMessage = 'HEADS-UP: Bookmark must contain a valid URL.';
        bookmarkList.displayErrorToaster(errMessage);
      } else if ($('.js-add-url').val().startsWith('http') === false) {
        const errMessage = 'HEADS-UP: URL must begin with http:// or https://';
        bookmarkList.displayErrorToaster(errMessage);
      }
    });
  };


  const handleNewBookmarkSumbit = function(){
    $('.js-add-bookmark-form').submit(event => {
      event.preventDefault();
      const newTitle = $('.js-add-title').val();
      const newUrl = $('.js-add-url').val();
      let newDesc = $('.js-add-desc').val();
      if(!newDesc) {
        newDesc = 'n/a';
      }
      const newRating = parseInt($('.js-add-rating').val());
      const newObject = {
        title: newTitle,
        url: newUrl,
        desc: newDesc,
        rating: newRating
      };
      api.addBookmark(newObject, response => {
        response.detailView = false;
        response.editTitle = false;
        response.editRating = false;
        response.editDesc = false;
        response.editUrl = false;
        store.addBookmark(response);
        store.showAddForm = false;
        bookmarkList.resetForm();
        bookmarkList.render();
      }, error => {
        bookmarkList.displayErrorToaster(error.responseJSON.message);
      });
    });
  };


  const handleBookmarkDelete = function(){
    $('ul').on('click', '.js-delete-bookmark', event => {
      const id = bookmarkList.getIdFromElement(event.currentTarget);
      api.deleteBookmark(id, () => {
        store.deleteBookmark(id);
        bookmarkList.render();
      });
    });
  };


  const handleFilterByRating = function(){
    $('#filter-rating').change( () => {
      const pulledValue = $('#filter-rating').val();
      store.minRating = parseInt(pulledValue);
      bookmarkList.render();
    });
  };

  const handleEditBookmarkTitle = function() {
    $('ul').on('click', '.edit-button.title', event => {
      event.preventDefault();
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      let targetBookmark = store.bookmarks.find(obj => obj.id === targetId);
      console.log(targetBookmark);
      Object.assign(targetBookmark, {editTitle: !targetBookmark.editTitle});
      console.log(targetBookmark);
      bookmarkList.render();
    });
    $('ul').on('click', '.submit-new.title', event => {
      event.preventDefault();
      const newTitle = $('.input-new.title').val();
      if (newTitle === '') {
        bookmarkList.displayErrorToaster('Title must be at least 1 character in length.');
      } else {
        $('.input-new.title').val('');
        const targetId = bookmarkList.getIdFromElement(event.currentTarget);
        api.updateBookmark(targetId, {title: newTitle}, () => {
          store.updateBookmark(targetId, {title: newTitle, editTitle: false});
          bookmarkList.render();
        }, error => {
          bookmarkList.displayErrorToaster(error.responseJSON.message);
        });
      }
    });
  };


  const handleEditBookmarkRating = function() {
    $('ul').on('click', '.edit-button.rating', event => {
      event.preventDefault();
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      let targetBookmark = store.bookmarks.find(obj => obj.id === targetId);
      Object.assign(targetBookmark, {editRating: !targetBookmark.editRating});
      bookmarkList.render();
    });  
    $('ul').on('click', '.submit-new.rating', event => {
      event.preventDefault();
      const newRating = parseInt($('.js-edit-rating').val());
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      api.updateBookmark(targetId, {rating: newRating}, () => {
        store.updateBookmark(targetId, {rating: newRating, editRating: false});
        bookmarkList.render();
      }, error => bookmarkList.displayErrorToaster(error.responseJSON.message));
    });
  };


  const handleEditBookmarkUrl = function() {
    $('ul').on('click', '.edit-button.url', event => {
      event.preventDefault();
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      let targetBookmark = store.bookmarks.find(obj => obj.id === targetId);
      Object.assign(targetBookmark, {editUrl: !targetBookmark.editUrl});
      bookmarkList.render();
    });
    $('ul').on('click', '.submit-new.url', event => {
      event.preventDefault();
      const newUrl = $('.input-new.url').val();
      if (newUrl === '') {
        bookmarkList.displayErrorToaster('Url must be at least 1 character in length.');
      } else if (!newUrl.toLowerCase().startsWith('http')) {
        bookmarkList.displayErrorToaster('A valid Url must begin with `http`.');
      } else {
        $('.input-new.url').val('');
        const targetId = bookmarkList.getIdFromElement(event.currentTarget);
        api.updateBookmark(targetId, {url: newUrl}, () => {
          store.updateBookmark(targetId, {url: newUrl, editUrl: false});
          bookmarkList.render();
        }, error => {
          bookmarkList.displayErrorToaster(error.responseJSON.message);
        });
      }
    });
  };


  const handleEditBookmarkDesc = function() {
    $('ul').on('click', '.edit-button.desc', event => {
      event.preventDefault();
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      let targetBookmark = store.bookmarks.find(obj => obj.id === targetId);
      Object.assign(targetBookmark, {editDesc: !targetBookmark.editDesc});
      bookmarkList.render();
    });
    $('ul').on('click', '.submit-new.desc', event => {
      event.preventDefault();
      let newDesc = $('.input-new.desc').val();
      if (newDesc === '') {
        newDesc = 'n/a';
      }
      $('.input-new.desc').val('');
      const targetId = bookmarkList.getIdFromElement(event.currentTarget);
      api.updateBookmark(targetId, {desc: newDesc}, ()=>{
        store.updateBookmark(targetId, {desc: newDesc, editDesc: false});
        bookmarkList.render();
      }, error => bookmarkList.displayErrorToaster(error.responseJSON.message));
    });
  };


  const main = function() {
    handleToggleExpandView();
    handleRevealAddForm();
    handleHideAddForm();
    handleNewBookmarkSumbit();
    handleBookmarkDelete();
    handleFilterByRating();
    handleBadTitle();
    handleBadUrl();
    handleEditBookmarkTitle();
    handleEditBookmarkRating();
    handleEditBookmarkUrl();
    handleEditBookmarkDesc();
  };



  return {
    main
  };
}());

