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
                    .on('click', '.completed-btn', markCompleted)
                    .on('click', '#up-vote', upImportance)
                    .on("click", '#down-vote', downImportance);

// functions
function emptyInputs() {
  $('.title-input').val('');
  $('.task-input').val('');
}

function disableSave () {
  var emptyTitle = ($('.title-input').val() === '');
  var emptyBody = ($('.task-input').val() === '');
  $('.submit-btn').prop('disabled', emptyTitle || emptyBody);
}

function addCard() {
  var title = $('.title-input').val();
  var idea = $('.task-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, idea, uniqueID);
  emptyInputs();
  disableSave();
}

function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;
  this.importance = 'Normal';
  this.completed = false;
  cardArray.push(this);
  stringifyArray();
}

function setLocal(array) {
  localStorage.setItem('cardlist', JSON.stringify(array))  
}

function stringifyArray() {
  cardArrayStringify = JSON.stringify(cardArray);
  toStorage(cardArrayStringify);
}

function toStorage(array) {
  var tempStore = localStorage.setItem('cardlist', array);
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

function clearCardDeck() {
  var cardContainer = $('.card-container');
  cardContainer.html('');
}

function prependCards(array) {
  clearCardDeck();
  array.forEach(function(card) {
    if (card.completed) {
      var completedClass = 'completed-active';
    }
  $('.card-container').prepend(
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
  var uniqueCardId = $(this).closest('article').attr('id');
  $(this).closest('article').remove();
  deleteCardLocal(uniqueCardId);
}

function deleteCardLocal(uniqueCardId) {
  var cardID = parseInt(uniqueCardId);
  cardArray.forEach(function(idea, index) {
    if (cardID === idea.uniqueID) {
      cardArray.splice(index, 1);
    }
    setLocal(cardArray);
  });
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
  });
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
  setLocal(cardArray);
}

function blurOnEnter(e) {
  var key = e.which;
  if (key === 13) {
    e.target.blur();
  }
}

function upImportance() {
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
}

function downImportance() {
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
}

function markCompleted() {
  $(this).parent().toggleClass('completed-active');
  $(this).blur();
  editText();
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
