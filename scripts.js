var uniqueID;
var cardArray = [];


fromStorage();

$('.submit-btn').on('click', function(){
  addCard();
});

function addCard() {
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
  $('.title-input').val("");
  $('.body-input').val("");
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
  var tempStore = localStorage.setItem( "cardlist",array);
  fromStorage();
}

function fromStorage() {
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  if (localStorage.length > 0) {
  cardArray = parsedCardList;
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
        <h5>quality: <span class="quality">${card.quality}</h5></span>
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

$('input').on('keyup', function(event){
  if (event.keyCode === 13) {
    $('.submit-btn').click();
  }
})

// Upvote WIP

// $('.card-container').on('click', '.up-vote', function() {
//   console.log('this', this);
//   var qualityText = $(this).siblings('h5').children('.quality').text();
//   console.log('qualitytext',qualityText);
//   var id = $(this).closest('.idea-card').attr('id');
//   var card = $(this).closest('.idea-card');  // Review with James
//   console.log('card', card); // Review with James
//   var quality = ['swill', 'plausible', 'genius']
//   for(var i = 0; i < quality.length; i++) {
//     if (qualityArray[i] == qualityText) {
//       qualityText = quality[i += 1];
//       $(this).siblings('h5').children('.quality').text(qualityText);
//     }
//   }
// })

$('.idea-card').on('focusout', function() {
  var titleText = $(this).find('h3').text()
  var cardIdString = $(this).attr('id')
  var cardId = parseInt(cardIdString)
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  $(parsedCardList)
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.title = titleText;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
});

$('.idea-card').on('focusout', function() {
  var bodyText = $(this).find('p').text()
  var cardIdString = $(this).attr('id')
  var cardId = parseInt(cardIdString)
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.idea = bodyText;

    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
})
