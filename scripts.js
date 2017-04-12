
fromStorage();

$('.submit-btn').on('click', addCard);

$('.card-container').on('click', '.delete-btn', deleteCardElement);

$('.search-input').on('keyup', searchResult);

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
  this.quality = "None"
  // this.qualityArray = ['swill', 'plausible', 'genius']
  // this.quality = this.qualityArray[0];
  cardArray.push(this);
  // qualityCount = 0;
  stringifyArray();
}

/*=======================================
>>>>>>>>  on click do this  <<<<<<<<
========================================*/

$('.card-container').on("click", '#up-vote', function() {
	var id = $(this).closest('article').attr('id');
  console.log(id)
	var newObject = grabObject(id)
	var parshedQuality = grabObject(id).quality

	if (parshedQuality == 'None') {
		newObject.quality ='Low'
		$(this).siblings().last().text('Low')
		toStorage(id, newObject)

	} else if (parshedQuality == 'Low') {
		newObject.quality = 'Normal'
		$(this).siblings().last().text('Normal')
		toStorage(id, newObject)

	} else if (parshedQuality == 'Normal') {
		newObject.quality = 'High'
		$(this).siblings().last().text('High')
		toStorage(id, newObject)

	} else if (parshedQuality == 'High') {
		newObject.quality = 'Critical'
		$(this).siblings().last().text('Critical')
		toStorage(id, newObject)
	}
})

$('.card-container').on("click", '#down-vote', function() {
	var id = $(this).closest('article').attr('id');
  	console.log(id)
	var newObject = fromStorage(id)
	console.log(newObject)
	var parshedQuality = fromStorage('id').quality
  console.log(parshedQuality)

  if (parshedQuality == 'Critical') {
    newObject.quality ='High'
    $(this).siblings().last().text('High')
    toStorage(id, newObject)

  } else if (parshedQuality == 'High') {
    newObject.quality = 'Normal'
    $(this).siblings().last().text('Normal')
    toStorage(id, newObject)

  } else if (parshedQuality == 'Normal') {
    newObject.quality = 'Low'
    $(this).siblings().last().text('Low')
    toStorage(id, newObject)

  } else if (parshedQuality == 'Low') {
    newObject.quality = 'None'
    $(this).siblings().last().text('None')
    toStorage(id, newObject)
  }
})

function grabObject(id) {
	var parsedObject = JSON.parse(localStorage.getItem('id'))
	return parsedObject;
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
  loadCards(parsedCardList);
}

function loadCards(parsedCardList) {
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
          <button class="delete-btn card-btns" role='button'></button>
          <p class="card-idea" contenteditable="true">${card.idea}</p>
        </div>
        <button class="up-vote card-btns" id='up-vote' role='button'></button>
        <button class="down-vote card-btns" id='down-vote' role='button'></button>
        <h5>quality: <span class="quality">${card.quality}</h5></span>
      </article>`
  )})}

// Delete buttons

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





//
// $('.idea-card').on('focusout', function() {
//   var titleText = $(this).find('h3').text()
//   var bodyText = $(this).find('p').text()
//   var cardIdString = $(this).attr('id')
//   var cardId = parseInt(cardIdString)
//   var storageList =localStorage.getItem("cardlist");
//   var parsedCardList = JSON.parse(storageList);
//   $(parsedCardList)
//   cardArray.forEach(function(object, index) {
//     if(cardId == object.uniqueID) {
//       object.title = titleText;
//       object.idea = bodyText;
//     }
//   })
//   localStorage.setItem('cardlist', JSON.stringify(cardArray) )
// });

//
// $('.idea-card').on('focusout', function() {
//     var titleText = $(this).find('h3').text()
//     var bodyText = $(this).find('p').text()
//     var cardIdString = $(this).attr('id')
//     var cardId = parseInt(cardIdString)
//     cardArray.forEach(function(object, index) {
//       if(cardId == object.uniqueID) {
//         object.title = titleText;
//         object.idea = bodyText;
//       })
//     })
//     refreshStorage()
//   })
//
// function refreshStorage () {
//   var storageList =localStorage.getItem("cardlist");
//   var parsedCardList = JSON.parse(storageList);
//   localStorage.setItem('cardlist', JSON.stringify(cardArray) )
// }
