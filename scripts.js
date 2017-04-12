// setup
fromStorage();
disableSave();

// event listeners
$('.title-input, .task-input').on('keyup', disableSave);

$('.submit-btn').on('click', addCard);

$('.filter-input').on('keyup', searchResult);

$('.show-completed-btn').on('click', showCompleted);

$('.card-container').on('click', '.delete-btn', deleteCardElement)
                    .on('focusout', '.idea-card', editText)
                    .on('keyup', '.idea-card', blurOnEnter)
                    .on('click', '.completed-btn', markCompleted);

// functions
function addCard() {
  var title = $('.title-input').val();
  var idea = $('.task-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
  $('.title-input').val('');
  $('.task-input').val('');
  disableSave();
}

function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;

  this.quality = "None"

  this.completed = false;

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
  var tempStore = localStorage.setItem('cardlist',array);
  fromStorage();
}

function fromStorage() {
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  var pendingCardList = parsedCardList.filter(function(card) {
    return !card.completed;
  });
  loadCards(pendingCardList);
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
    if (card.completed === true) {
      var completedClass = 'completed-active';
    }
  cardContainer.prepend(

    `<article class='idea-card ${completedClass}' id=${card.uniqueID}>
      <div class='text'>
        <h3 class='card-title' contenteditable='true'>${card.title}</h3>
        <button class='delete-btn card-btns'></button>
        <p class='card-idea' contenteditable='true'>${card.idea}</p>
      </div>
      <div class='card-footer'>
        <button class='up-vote card-btns' id='up-vote'></button>
        <button class='down-vote card-btns' id='down-vote'></button>
        <h5>quality: <span class='quality'>${card.quality}</h5></span>
      </div>
      <button class='completed-btn'>completed task</button>
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
  var completedState = $(this).hasClass('completed-active');
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.title = titleText;
      object.idea = bodyText;
      object.completed = completedState;
    }
  });
  refreshStorage();
}

function refreshStorage () {
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  localStorage.setItem('cardlist', JSON.stringify(cardArray) )
}

function blurOnEnter(e) {
  var key = e.which;
  if (key === 13) {
    e.target.blur();
  }
}

function disableSave () {
  var emptyTitle = ($('.title-input').val() === '');
  var emptyBody = ($('.task-input').val() === '');
  $('.submit-btn').prop('disabled', emptyTitle || emptyBody);
}

function markCompleted() {
  $(this).parent().toggleClass('completed-active');
  editText();
  $(this).blur();
}

function showCompleted() {
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  var sortedByCompletedList = parsedCardList.sort(function (a, b) {
    if (a.completed < b.completed) {return -1}
    if (a.completed > b.completed) {return  1}
    return 0;
  });
  loadCards(sortedByCompletedList);
}
