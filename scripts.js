var uniqueID;
var cardArray = [];

fromStorage();

$('.submit-btn').on('click', function(){
  addCard();
});

function addCard() {
  generateID();
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var card = new Card(title, idea, uniqueID);
}

function generateID() {
  var dateTime = new Date();
  var uniqueNum = dateTime.getTime();
  uniqueID = uniqueNum;
}

function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;
  this.quality = 'swill';
  cardArray.push(this);
  stringifyArray();
}

function stringifyArray() {
  cardArrayStringify = JSON.stringify(cardArray);
  toStorage(cardArrayStringify);
  console.log("cardArrayStringify", cardArrayStringify);
}

function toStorage(array) {
  var tempStore = localStorage.setItem( "cardlist",array);
  console.log(localStorage);
  fromStorage();
}

function fromStorage() {
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  if (localStorage.length > 0) {
  cardArray = parsedCardList;
  console.log("storageList", storageList)
  console.log("parsedCardList",parsedCardList);
  prependCards(parsedCardList);
}}


function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
      `<article class="idea-card" id=${card.uniqueID}>
      <h3>${card.title}</h3>
      <button class="delete-btn card-btns"></button>
      <p>${card.idea}
      </p>
      <button class="up-vote card-btns"></button>
      <button class="down-vote card-btns"></button>
      <h5>quality: ${card.quality}</h5>
      </article>`
  )})}
