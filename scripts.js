// Setup
fromStorage();
disableSave();

// Event Listeners
$('.title-input, .task-input').on('keyup', disableSave);

$('.submit-btn').on('click', addCard);

$('.filter-input').on('keyup', searchResult);

$('.show-completed-btn').on('click', showCompleted);

$('.filter-importance').on('click', filterImp);

$('.show-all-pending-btn').on('click', fromStorage);

$('.card-container').on('click', '.delete-btn', deleteCardElement)
                    .on('focusout', '.task-card', editText)
                    .on('keyup', '.task-card', blurOnEnter)
                    .on('click', '.completed-btn', markCompleted)
                    .on('click', '.up-vote', upImportance)
                    .on('click', '.down-vote', downImportance);

// Functions
function setLocal(array) {
  localStorage.setItem('cardlist', JSON.stringify(array));
}

function loadCards(cardList) {
  if (localStorage.length > 0) {
    cardArray = cardList;
    prependCards(cardList);
  }
}

function Card(title, task, uniqueID) {
  this.title = title;
  this.task = task;
  this.uniqueID = uniqueID;
  this.importance = 'Normal';
  this.completed = false;
  // BUG: Pull the following out of the constructor function
  cardArray.push(this);
  setLocal(cardArray);
  loadCards(cardArray);
}

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
  var task = $('.task-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, task, uniqueID);
  emptyInputs();
  disableSave();
}

function getLocal() {
  if (localStorage.getItem('cardlist') === null) {
    var cardArray = [];
    localStorage.setItem('cardlist',JSON.stringify(cardArray));
  }
  var storageList = JSON.parse(localStorage.getItem('cardlist'));
  return storageList;  
}

function fromStorage() {
  var storageList = getLocal();
  var pendingCardList = storageList.filter(function(card) {
    return !card.completed;
  });
  loadCards(pendingCardList);
}

function showCompleted() {
  var storageList = getLocal();
  var sortedByCompletedList = storageList.sort(function (a, b) {
    if (a.completed < b.completed) {return -1}
    if (a.completed > b.completed) {return  1}
    return 0;
  });
  loadCards(sortedByCompletedList);
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
    `<article class='task-card ${completedClass}' id=${card.uniqueID}>
      <div class='text'>
        <h3 class='card-title' contenteditable='true'>${card.title}</h3>
        <button class='delete-btn card-btns'></button>
        <p class='card-task' contenteditable='true'>${card.task}</p>
      </div>
      <div class='card-footer'>
        <button class='up-vote card-btns'></button>
        <button class='down-vote card-btns'></button>
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
  cardArray.forEach(function(task, index) {
    if (cardID === task.uniqueID) {
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
  var importance = $(this).find('span').text();
  cardArray.forEach(function(object, index) {
    if(cardId == object.uniqueID) {
      object.title = titleText;
      object.task = bodyText;
      object.completed = completedState;
      object.importance = importance;
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
  var impLevels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var existingImp = $(this).siblings('.imp-container').children()[0].innerText;
  var existingImpIndex = $.inArray(existingImp, impLevels);
  if (existingImpIndex < impLevels.length - 1) {
    var newImp = impLevels[existingImpIndex + 1];
  } else {
    var newImp = existingImp;
  }
  $(this).siblings('.imp-container').children().text(newImp);
  $(this).blur();
}

function downImportance() {
  var impLevels = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var existingImp = $(this).siblings('.imp-container').children()[0].innerText;
  var existingImpIndex = $.inArray(existingImp, impLevels);
  if (existingImpIndex > 0) {
    var newImp = impLevels[existingImpIndex - 1];
  } else {
    var newImp = existingImp;
  }
  $(this).siblings('.imp-container').children().text(newImp);
  $(this).blur();
}

function markCompleted() {
  $(this).parent().toggleClass('completed-active');
  $(this).blur();
}

function filterImp(e) {
  imp = ($(this).text());
  var storageList = getLocal();
  var impCardList = storageList.filter(function(card) {
    return (card.importance.toLowerCase() === imp);
  });
  loadCards(impCardList);
}