/* global $, bookmarkList, api, store, eventListeners */

'use strict';



api.getBookmarks ( response => {
  response.forEach(obj => store.addBookmark(obj));
  store.bookmarks.forEach( object => {
    object.detailView = false;
    object.editTitle = false;
    object.editUrl = false;
    object.editRating = false;
    object.editDesc = false;
  });
  bookmarkList.render();
});

$(eventListeners.main);


// store.bookmarks = dummyData;
// bookmarkList.render();


//api.addBookmark(dummyData[1]);
//api.deleteBookmark('cjiopfl6s000n0kug349pk34c', () => console.log('item deleted'));

//api.getBookmarks(() => console.log('got the package')));
// store.bookmarks = dummyData;
// store.updateBookmark('55556666', {title: 'Thinkful Homepage'});
// api.updateBookmark('cjioq1eqo000s0kugpzja8rh3', {title: 'Something Else', desc:"Something Else"});
// console.log(store.bookmarks);

// store.bookmarks = dummyData;
// bookmarkList.render();