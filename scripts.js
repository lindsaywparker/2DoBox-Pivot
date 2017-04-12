// setup
fromStorage();
disableSave();


// event listeners
$('.submit-btn').on('click', addCard);

$('.card-container').on('click', '.delete-btn', deleteCardElement);

$('.search-input').on('keyup', searchResult);

$('.idea-card').on('focusout', editText);

$('.title-input, .body-input').on('keyup', disableSave);


// functions
function addCard() {
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
  $('.title-input').val('');
  $('.body-input').val('');
  disableSave();
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
  var storageList =localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  loadCards(parsedCardList);
}

function loadCards(parsedCardList) {
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
  )}
)}

function deleteCardElement() {
  var uniqueCardIdtoParse = $(this).closest('article').attr('id');
  var uniqueCardId = parseInt(uniqueCardIdtoParse)
  $(this).closest('article').remove();
  deleteCardLocal(uniqueCardId);
}

function deleteCardLocal(uniqueCardId) {
  var cardID = uniqueCardId
  cardArray.forEach(function(idea, index) {
    if(cardID == idea.uniqueID) {
      cardArray.splice(index, 1)
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
}

function searchResult() {
  var searchInput = $(this).val().toLowerCase();
  $('.text').each(function() {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(searchInput) != -1) {
      $(this).parent().show();
    } else {
      $(this).parent().hide();
    }
  })
}

function editText() {
  var titleText = $(this).find('h3').text();
  var bodyText = $(this).find('p').text();
  var cardId = parseInt($(this).attr('id'));
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.title = titleText;
      object.idea = bodyText;
    }
  });
  refreshStorage();
}

function refreshStorage () {
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  localStorage.setItem('cardlist', JSON.stringify(cardArray) )
}

function disableSave () {
  var emptyTitle = ($('.title-input').val() === '');
  var emptyBody = ($('.body-input').val() === '');
  $('.submit-btn').prop('disabled', emptyTitle || emptyBody);
}