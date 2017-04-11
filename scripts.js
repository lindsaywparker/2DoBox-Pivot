// var uniqueID;
// var cardArray = [];


fromStorage();

$('.submit-btn').on('click', function(){
  addCard();
});

function addCard() {
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
  $('.title-input').val('');
  $('.body-input').val('');
}

function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;
  this.qualityArray = ['swill', 'plausible', 'genius']
  this.quality = this.qualityArray[0];
  cardArray.push(this);
  qualityCount = 0;
  stringifyArray();
}

function stringifyArray() {
  cardArrayStringify = JSON.stringify(cardArray);
  toStorage(cardArrayStringify);
}

function toStorage(array) {
  var tempStore = localStorage.setItem('cardlist',array);
  fromStorage();
}

function fromStorage() {
  // This functions has two purposes:
  // 1: get the list from storage
  var storageList =localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  
  // 2: add cards to the page
  if (localStorage.length > 0) {
    cardArray = parsedCardList;
    prependCards(parsedCardList);
  }
}


function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
      `<article class='idea-card' id=${card.uniqueID}>
        <div class='text'>
          <h3 class='card-title' contenteditable='true'>${card.title}</h3>
          <button class='delete-btn card-btns'></button>
          <p class='card-idea' contenteditable='true'>${card.idea}</p>
        </div>
        <button class='up-vote card-btns'></button>
        <button class='down-vote card-btns'></button>
        <h5>quality: <span class='quality'>${card.quality}</h5></span>
      </article>`
  )})}

// Delete buttons

$('.card-container').on('click', '.delete-btn', function() {
  var uniqueCardIdtoParse = $(this).closest('article').attr('id');
  var uniqueCardId = parseInt(uniqueCardIdtoParse)
  $(this).closest('article').remove();
  deleteCardLocal(uniqueCardId);
})

function deleteCardLocal(uniqueCardId) {
  var cardID = uniqueCardId
  cardArray.forEach(function(idea, index) {
    if(cardID == idea.uniqueID) {
      cardArray.splice(index, 1)
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
}

$('.search-input').on('keyup', function() {
    var searchInput = $(this).val().toLowerCase();
    $('.text').each(function() {
      var cardText = $(this).text().toLowerCase();
      if (cardText.indexOf(searchInput) != -1) {
        $(this).parent().show();
      } else {
        $(this).parent().hide();
      }
    })

})


$('.idea-card').on('focusout', function() {
  // get the full list from localStorage
  
  
  // read the html changes

  
  // get the id of the html element that was changed and make it an integer
  
  
  // cycle through the cardArray to find the right card, update that card

  
  // update localStorage  
  
  
  
});

// BUG: editable content does not persist on first change
