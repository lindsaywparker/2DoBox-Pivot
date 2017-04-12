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

  this.importance = "Normal"

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
  var existingImp = $(this).siblings('.imp-container').children()[0].innerText

	if (existingImp == 'None') {
      $(this).siblings('.imp-container').children().text('Low')

	} else if (existingImp == 'Low') {
      $(this).siblings('.imp-container').children().text('Normal')

	} else if (existingImp == 'Normal') {
      $(this).siblings('.imp-container').children().text('High')

	} else if (existingImp == 'High') {
      $(this).siblings('.imp-container').children().text('Critical')
	}
})

$('.card-container').on("click", '#down-vote', function() {
	var id = $(this).closest('article').attr('id');
  var existingImp = $(this).siblings('.imp-container').children()[0].innerText

  if (existingImp == 'Critical') {
    $(this).siblings('.imp-container').children().text('High')

  } else if (existingImp == 'High') {
    $(this).siblings('.imp-container').children().text('Normal')

  } else if (existingImp == 'Normal') {
    $(this).siblings('.imp-container').children().text('Low')

  } else if (existingImp == 'Low') {
    $(this).siblings('.imp-container').children().text('None')
  }

})

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
        <h5 class='imp-container'>importance:
          <span class='importance'>${card.importance}</span>
        </h5>
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
