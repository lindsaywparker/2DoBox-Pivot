var uniqueID;
var cardArray = [];
var qualityArray = ['swill', 'plausible', 'genius'];

fromStorage();

$('.submit-btn').on('click', function(){
  addCard();
});

function addCard() {
  // generateID();
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
}

function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;
  this.quality = qualityArray[0];
  cardArray.push(this);
  qualityCount = 0;
  stringifyArray();
}

function stringifyArray() {
  cardArrayStringify = JSON.stringify(cardArray);
  toStorage(cardArrayStringify);
  // console.log("cardArrayStringify", cardArrayStringify);
}



function toStorage(array) {
  var tempStore = localStorage.setItem( "cardlist",array);
  // console.log(localStorage);
  fromStorage();
}

function fromStorage() {
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  if (localStorage.length > 0) {
  cardArray = parsedCardList;
  // console.log("storageList", storageList)
  // console.log("parsedCardList",parsedCardList);
  prependCards(parsedCardList);
}}


function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
      `<article class="idea-card" id=${card.uniqueID}>
        <div class="text">
          <h3 class="card-title" contenteditable="true">${card.title}</h3>
          <button class="delete-btn card-btns"></button>
          <p class="card-idea" contenteditable="true">${card.idea}</p>
        </div>
        <button class="up-vote card-btns"></button>
        <button class="down-vote card-btns"></button>
        <h5>quality: ${card.quality}</h5>
      </article>`
  )})}

// Delet buttons

$('.card-container').on('click', '.delete-btn', function() {
  // console.log($(this).closest('article').attr('id'));
  var uniqueCardIdtoParse = $(this).closest('article').attr('id');
  var uniqueCardId = parseInt(uniqueCardIdtoParse)
  $(this).closest('article').remove();
  console.log("uniqueCardId-before", uniqueCardId)
  deleteCardLocal(uniqueCardId);
  // remove(this);
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


// upvote downvote

//upvote

// var guitarPlayingBeatles = beatles.filter(function (beatle) {
//   return beatle.instruments.indexOf('guitar') !== -1;
// });

var qualityCount = 0

$('.card-container').on('click', '.up-vote', function() {
  var id = $(this).closest('.idea-card').attr('id');
  var card =$(this).closest('.idea-card');  // Review with James
  console.log('card', card); // Review with James
  console.log(id,'cardupvote');
  if (qualityCount < 2) {
    qualityCount++;
    qualityArray[qualityCount];
    console.log(qualityArray[qualityCount]);
    console.log($(this).siblings('h5'));
    var qualityRating = $(this).siblings('h5').text('quality: ' + qualityArray[qualityCount]);
  }


  console.log(id);
})

//downvote

$('card-container').on('click', 'down-vote', function() {

})
