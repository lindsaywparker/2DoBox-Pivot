function generateID() {
  var dateTime = new Date();
  var uniqueNum = dateTime.getTime();
  uniqueID = uniqueNum;
}


function Card(title, idea, uniqueID) {
  this.title = title;
  this.idea = idea;
  this.uniqueID = uniqueID;
}


var uniqueID;

function addCard() {
  generateID();
  var title = $('.title-input').val();
  var idea = $('.body-input').val();
  var card = new Card(title, idea, uniqueID)
  console.log(card);
}


$('.submit-btn').on('click', function(){
  addCard();
})
