$('.idea-card').on('focusout', function() {
  // get the full list from localStorage
  var storageList =localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  
  
  
  // read the html changes
  var titleText = $(this).find('h3').text();
  var bodyText = $(this).find('p').text();
  
  
  
  // get the id of the html element that was changed and make it an integer
  var cardId = parseInt($(this).attr('id'));
  
  
  // cycle through the cardArray to find the right card, update that card
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.title = titleText;
      object.idea = bodyText;
    }
  })
  
  
  // update localStorage  
  localStorage.setItem('cardlist', JSON.stringify(cardArray) )
});