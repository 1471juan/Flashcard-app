//About
//This is a simple flashcard app
//email: jmanuel.pgp@gmail.com
//--------------------------------------------

//After deleteing cards there is an error if you change the reviewing mode.
//Clear the deck again.
//change options logic to return button logic

//DECK STRUCTURE
//name
//cards -> front, back, easiness
var deck_1 = {
  name: 'German-Spanish',
  cards: [
    ['Guten Morgen!', 'Good morning!', 0.2],
    ['Warum ist der Himmel blau?', 'Why is the sky blue?', 0.2],
    ['Der Hund bellt.', 'The dog barks.', 0.2],
    ['Ist das der rote Apfel?', 'Is that the red apple?', 0.2],
    ['Irland ist ein schönes Land', 'Ireland is a nice country', 0.2]
  ]
}

var deck_2 = {
  name: 'English-Spanish',
  cards: [
    ['The cars are new.', 'Los coches son nuevos.', 0.2],
    ['How are you?', '¿Cómo estás?', 0.3],
    ['Welcome to our house.', 'Bienvenido a nuestra casa.', 0],
    ['When are you going to go?', 'Cuando vas a ir?', 0.1]
  ]
}

var deck_3 = {
  name: 'Korean-English',
  cards: [
    ['버리다.', 'throw away', 0.2],
    ['당연하지', 'Obviously', 0.2],
    ['뒤집다', 'turn over[around], turn upside down', 0.2],
    ['인격', 'personality.', 0.2],
    ['꼴찌', 'the last', 0.2],
    ['설문조사', 'survey, encuesta', 0.2],
    ['툴툴거리다', 'complan, grumble', 0.2],
    [
      '자타공인 노잼도시 대전에 거주중입니다',
      "I'm living in Daejeon, a boring city.",
      0.2
    ],
    ['혼란', 'confusion, chaos, mess', 0.2],
    ['곰곰이 생각하다', 'think carefully, deeply, profoundly, seriously', 0.2],
    ['살금살금', 'secretly, quietly.', 0.2],
    ['모집', 'recruitment.', 0.2],
    ['요청', 'request, demand.', 0.2]
  ]
}

// rray of decks
var decks = []

var decks_tmp = []

function deck_recollect () {
  decks = []

  decks.push(deck_1)
  decks.push(deck_2)
  decks.push(deck_3)
  //add other decks
  for (var i = 0; i < decks_tmp.length; i++) {
    decks.push(decks_tmp[i])
  }
}
//variables
var app_state = 'app_deck_list'
var card_current = 0
var initial_deck_length
var deck_length
var deck_selected_id
var deck_selected_add_card_id
var defualt_easiness = 0.2
var cards_done = []
var review_mode_current = 'default'

//function to move the element to the end
function moveElementToEnd (array, toMove) {
  let i = 0
  let j = array.length - 1
  while (i < j) {
    while (i < j && array[j] == toMove) j--
    if (array[i] == toMove) swapElement(array, i, j)
    i++
  }
  return array
}
//swaps an array element from another
function swapElement (array, from, to) {
  var tmp = array[from]
  array[from] = array[to]
  array[to] = tmp
}
//Gets a random number from 0 to a max
function get_random_number (max) {
  return Math.floor(Math.random() * max)
}
//filters the numbers on a string
function string_filter_number (a) {
  var b = a.match(/\d/g)

  b = b.join('')

  return b
}
//updates the deck_lenght variable
function update_deck_length (deck) {
  deck_length = 0
  for (var i in deck.cards) {
    if (deck.cards[i] != undefined) {
      deck_length++
    }
  }
}
//Deletes the cards from the deck that have an easiness <= 0
function deck_clear (deck) {
  for (var i = 0; i < deck_length; i++) {
    //If card has easiness of 0...
    if (deck.cards[i][2] <= 0) {
      //Add card to the done array
      cards_done.push(deck.cards[i])
      //delete de card from the app_deck array
      delete deck.cards[i]
      //get the lenght of the deck again
      update_deck_length(deck)
    }
  }

  //move all undefineds to the end of the array
  deck.cards = moveElementToEnd(deck.cards, undefined)
  //update length
  update_deck_length(deck)
  //cut the elements of the undefined part of the array deck_length
  deck.cards.splice(deck_length, deck.cards.length)
  update_deck_length(deck)
}
//Reorders the cards based on the easiness
function deck_sort (deck) {
  update_deck_length(deck)
  for (var i = 0; i < deck_length; i++) {
    var previous_card_ease
    if (i >= 1) {
      previous_card_ease = deck.cards[i - 1][2]
    } else {
      previous_card_ease = 0
    }

    var current_card_ease = deck.cards[i][2]

    if (current_card_ease > previous_card_ease) {
      if (i >= 1) {
        //swap elements
        swapElement(deck.cards, i, i - 1)
        //sort the deck again
        deck_sort(deck)
      }
    }
  }

  deck_clear(deck)
  return deck
}
//update cards_infromation
function update_cards_info (deck) {
  var header_remaining_cards = document.getElementById('cards_remaining')
  header_remaining_cards.innerHTML =
    deck.cards.length + ' / ' + initial_deck_length
}
//Reviewing state
function app_start (app_deck) {
  //.card_container
  var header_deck_name = document.getElementById('deck_name')
  var header_remaining_cards = document.getElementById('cards_remaining')
  var button_show = document.getElementById('button_show')
  var button_next = document.getElementById('button_next')
  var button_fail = document.getElementById('button_fail')
  var button_success = document.getElementById('button_success')
  var button_finish = document.getElementById('button_finish')

  var option_review_mode = document.getElementById('option_review_mode')

  var card_front = document.getElementById('card_front')
  var card_back = document.getElementById('card_back')

  button_finish.style.display = 'none'

  //get the number of cards in the deck to review
  update_deck_length(app_deck)

  //Finnish the deck
  if (deck_length <= 0) {
    button_finish.style.display = 'flex'
    header_deck_name.innerHTML = app_deck.name + ' finnished!'
    header_remaining_cards.innerHTML = ''
    card_front.innerHTML = 'No more cards to review. Click return.'
    card_back.innerHTML = ''
    button_show.style.display = 'none'
  }

  if (review_mode_current == 'default') {
    deck_clear(app_deck)
    initial_deck_length = app_deck.cards.length
  }

  update_cards_info(app_deck)

  //set deck name
  header_deck_name.innerHTML = app_deck.name

  //set review mode
  review_mode_current =
    option_review_mode[option_review_mode.selectedIndex].value

  //sort deck
  switch (review_mode_current) {
    case 'default':
      deck_sort(app_deck)
      break
    case 'ordered':
      break
    case 'random':
      for (let i = 0; i < app_deck.cards.length; i++) {
        var element_a = get_random_number(app_deck.cards.length)
        var element_b = get_random_number(app_deck.cards.length)
        swapElement(app_deck.cards, element_a, element_b)
      }
      break
  }

  if (deck_length > 0) card_front.innerHTML = app_deck.cards[card_current][0]

  //show button logic
  button_show.onclick = function () {
    card_back.innerHTML = app_deck.cards[card_current][1]
    button_show.style.display = 'none'
    button_next.style.display = 'initial'
    button_fail.style.display = 'initial'
    button_success.style.display = 'initial'
    button_finish.style.display = 'none'
  }
  //next button logic
  button_next.onclick = function () {
    button_show.style.display = 'initial'
    button_next.style.display = 'none'
    button_fail.style.display = 'none'
    button_success.style.display = 'none'
    button_finish.style.display = 'none'

    card_current++

    if (card_current >= deck_length) {
      card_current = 0
    }

    card_front.innerHTML = app_deck.cards[card_current][0]
    card_back.innerHTML = ''
  }
  //fail button logic
  button_fail.onclick = function () {
    button_show.style.display = 'initial'
    button_next.style.display = 'none'
    button_fail.style.display = 'none'
    button_success.style.display = 'none'
    button_finish.style.display = 'none'

    if (review_mode_current == 'default') {
      //Add information about this card
      app_deck.cards[card_current][2] = app_deck.cards[card_current][2] + 0.1
      //Sort the deck again based on new information
      deck_sort(app_deck)
    }

    //Go to the next card
    card_current++

    if (card_current >= deck_length) {
      card_current = 0
    }

    card_front.innerHTML = app_deck.cards[card_current][0]
    card_back.innerHTML = ''
  }
  //success button logic
  button_success.onclick = function () {
    button_show.style.display = 'initial'
    button_next.style.display = 'none'
    button_fail.style.display = 'none'
    button_success.style.display = 'none'
    button_finish.style.display = 'none'

    if (review_mode_current == 'default') {
      //Add information about this card
      app_deck.cards[card_current][2] = app_deck.cards[card_current][2] - 0.1;

      //If the card has certain number of the index, delete it form the deck
      if (app_deck.cards[card_current][2] <= 0) {
        //delete the card from the app_deck array
        deck_clear(app_deck)
        //get the lenght of the deck again
        update_deck_length(app_deck)
      }

      //Finnish the deck
      if (deck_length <= 0) {
        button_finish.style.display = 'flex'
        header_deck_name.innerHTML = app_deck.name + ' finnished!'
        card_front.innerHTML = 'No more cards to review.'
        card_back.innerHTML = ''
        button_show.style.display = 'none'
      }

      //update cards info
      update_cards_info(app_deck)
    }

    if (deck_length > 0) {
      //Go to the next card
      card_current++

      if (card_current >= deck_length) {
        card_current = 0

        if (review_mode_current == 'default') {
          //Sort the deck again based on new information
          deck_sort(app_deck)
        }
      }

      card_front.innerHTML = app_deck.cards[card_current][0]
      card_back.innerHTML = ''
    }
  }
  //finish button logic
  button_finish.onclick = function () {
    app_state = 'app_deck_list'
    app_clear()
    app_states()
  }
}
//creates a list of decks
function deck_selection () {
  for (let i = 0; i < decks.length; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    var h3 = document.createElement('h3')
    var more = document.createElement('a')
    var more_text = document.createElement('h3')

    var deck_list_attribute = 'deck_list_item_' + i
    li.setAttribute('id', deck_list_attribute)
    li.setAttribute('class', 'deck_list_element')

    a.setAttribute('href', '#')

    a.setAttribute('id', i)
    a.setAttribute('class', 'deck_link')
    a.setAttribute('onClick', 'deck_select(this.id);')

    var deck_name_attribute = 'deck_name_item_' + i
    h3.setAttribute('id', deck_name_attribute)

    more.setAttribute('href', '#')
    var deck_link_more_id_atribute = 'deck_link_more_' + i
    more.setAttribute('id', deck_link_more_id_atribute)
    more.setAttribute('class', 'deck_link_more')
    more.setAttribute('onClick', 'deck_option_select(this.id)')

    more_text.setAttribute('class', 'deck_link_more_text')
    more_text.innerHTML = 'add'

    li.appendChild(a)
    a.appendChild(h3)

    li.appendChild(more)
    more.appendChild(more_text)

    var ul = document.getElementById('deck_list')

    ul.appendChild(li)
  }
  //Get deck names for the list
  for (let i = 0; i < decks.length; i++) {
    var deck_name_attribute = 'deck_name_item_' + i
    var deck_list_item = document.getElementById(deck_name_attribute)
    deck_list_item.innerHTML = decks[i].name
  }
}
//selects 'more' based on its id
function deck_option_select (id) {
  deck_selected_add_card_id = string_filter_number(id)

  app_state = 'deck_add_card'

  app_states()
}
//selects deck based on list id
function deck_select (id) {
  app_state = 'app_deck_review'
  deck_selected_id = id
  app_states()
}
//adds new card to a specific deck
function deck_add_new_card (deck, card) {
  deck.cards.push(card)
}

function app_states () {
  var c_cont = document.getElementById('card_container')
  var d_cont = document.getElementById('deck_container')
  var option_review_mode = document.getElementById('option_review_mode')
  var deck_add_newCard = document.getElementById('deck_add_card')
  var add_deck_container = document.getElementById('app_deck_add')
  var customize_container = document.getElementById('customize_container')
  change_style()
  switch (app_state) {
    case 'app_deck_list':
      var button_options_return = document.getElementById('button_return')
      c_cont.style.display = 'none'
      d_cont.style.display = 'flex'
      button_options_return.style.display = 'none'
      option_review_mode.style.display = 'initial'
      deck_add_newCard.style.display = 'none'
      add_deck_container.style.display = 'none'
      customize_container.style.display = 'none'
      deck_recollect()
      deck_selection()
      options_add_deck()

      break

    case 'app_deck_review':
      c_cont.style.display = 'flex'
      d_cont.style.display = 'none'
      option_review_mode.style.display = 'none'
      deck_add_newCard.style.display = 'none'
      add_deck_container.style.display = 'none'
      customize_container.style.display = 'none'
      app_start(decks[deck_selected_id])

      options_return()
      break

    case 'deck_add_card':
      var button_submit_card = document.getElementById('submit_add_card')
      c_cont.style.display = 'none'
      d_cont.style.display = 'none'
      option_review_mode.style.display = 'none'
      deck_add_newCard.style.display = 'flex'
      add_deck_container.style.display = 'none'
      customize_container.style.display = 'none'

      button_submit_card.onclick = function () {
        //get new card information
        let new_card_front = document.getElementById(
          'deck_add_card_front'
        ).value
        let new_card_back = document.getElementById('deck_add_card_back').value
        //create new card with that information
        var new_card = [new_card_front, new_card_back, defualt_easiness]
        //add new card to the deck
        deck_add_new_card(decks[deck_selected_add_card_id], new_card)
        //reset input fields
        document.getElementById('deck_add_card_front').value = ''
        document.getElementById('deck_add_card_back').value = ''
      }

      options_return()
      break

    case 'app_add_deck':
      var button_submit_deck = document.getElementById('submit_add_deck')
      c_cont.style.display = 'none'
      d_cont.style.display = 'none'
      option_review_mode.style.display = 'none'
      deck_add_newCard.style.display = 'none'
      add_deck_container.style.display = 'flex'
      customize_container.style.display = 'none'
      button_submit_deck.onclick = function () {
        //get new card information
        let new_deck_name = document.getElementById(
          'input_app_deck_add_name'
        ).value

        //create new card with that information
        var new_deck = {
          name: new_deck_name,
          cards: []
        }
        //add new deck to the decks array
        decks_tmp.push(new_deck)
        //reset input fields
        document.getElementById('input_app_deck_add_name').value = ''
        //come back to the main menu
        app_state = 'app_deck_list'
        app_clear()
        app_states()
      }

      options_return()
      break

    case 'app_customize':
      c_cont.style.display = 'none'
      d_cont.style.display = 'none'
      option_review_mode.style.display = 'none'
      deck_add_newCard.style.display = 'none'
      add_deck_container.style.display = 'none'
      customize_container.style.display = 'flex'

      //apply the setting when pressing the apply button
      var button_customize_apply = document.getElementById('customize_apply')
      button_customize_apply.onclick = function () {
        change_style()
      }

      options_return()
      break
  }
}

function change_style () {
  var select_palette = document.getElementById('option_customize_container')

  switch (select_palette[select_palette.selectedIndex].value) {
    case 'default':
      document.documentElement.style.setProperty('--color-main-bg', '#9DA993')
      document.documentElement.style.setProperty('--color-main-txt', '#E3E8E9')
      document.documentElement.style.setProperty(
        '--color-main-special',
        '#E4B4B4'
      )

      break
    case 'pastel':
      document.documentElement.style.setProperty('--color-main-bg', '#FBE7C6')
      document.documentElement.style.setProperty('--color-main-txt', '#FFAEBC') //#FFAEBC
      document.documentElement.style.setProperty(
        '--color-main-special',
        '#A0E7E5'
      )
      break
    case 'splash':
      document.documentElement.style.setProperty('--color-main-bg', '#05445E')
      document.documentElement.style.setProperty('--color-main-txt', '#189AB4') //#D4F1F4
      document.documentElement.style.setProperty(
        '--color-main-special',
        '#75E6DA'
      )
      break
    case 'light':
      document.documentElement.style.setProperty('--color-main-bg', '#FFFFFF')
      document.documentElement.style.setProperty('--color-main-txt', '#000000')
      document.documentElement.style.setProperty(
        '--color-main-special',
        '#757575'
      )
      break
    case 'dark':
      document.documentElement.style.setProperty('--color-main-bg', '#000000')
      document.documentElement.style.setProperty('--color-main-txt', '#FFFFFF')
      document.documentElement.style.setProperty(
        '--color-main-special',
        '#757575'
      )
      break
  }
}

function options_return () {
  var button_options_return = document.getElementById('button_return')

  button_options_return.style.display = 'flex'

  button_options_return.onclick = function () {
    app_state = 'app_deck_list'
    app_clear()
    app_states()
  }

  //
  var button_add_deck = document.getElementById('button_add_deck')
  var button_customize = document.getElementById('button_customize')
  button_add_deck.style.display = 'none'
  button_customize.style.display = 'none'
}

function options_add_deck () {
  var button_add_deck = document.getElementById('button_add_deck')

  button_add_deck.style.display = 'flex'

  button_add_deck.onclick = function () {
    app_state = 'app_add_deck'

    app_states()
  }

  var button_customize = document.getElementById('button_customize')

  button_customize.style.display = 'flex'

  button_customize.onclick = function () {
    app_state = 'app_customize'

    app_states()
  }
}

function app_clear () {
  //reset front card
  card_current = 0
  //resets back card
  card_back.innerHTML = ''
  //reset buttons
  button_show.style.display = 'initial'
  button_next.style.display = 'none'

  //the parent
  var ul = document.getElementById('deck_list')

  //kill each child
  for (var i = 0; i < decks.length; i++) {
    if (typeof ul != 'undefined' && ul != null) {
      ul.removeChild(document.getElementById('deck_list_item_' + i))
    }
  }
}

app_states()
