let $start = document.querySelector("#start");
let $game = document.querySelector("#game");
let $time = document.querySelector("#time");
let $game_time = document.querySelector("#game-time");
let $time_header = document.querySelector("#time-header");
let $result_header = document.querySelector("#result-header");
let $result = document.querySelector("#result");
let $login = document.querySelector("#login");
let $appPage = document.querySelector(".app");
let $loginPage = document.querySelector(".login");
let $nameUser = document.querySelector("#nameUser");
let $list = document.querySelector(".list");

let score = 0;
let user = {};
let list = [];
let chek = false;

$start.addEventListener("click", start);

function start() {
  if (Object.keys(user).length > 0) {
    // user != {} user.name == undefined
    chek = true;  // если данный юзер не пустой   
  }
  list = getData("listUsers");
  score = 0;
  $start.classList.add("hide");
  $game.style.backgroundColor = "white";
  createBox();
  timer();
  setTime();
  $game_time.setAttribute("disabled", "true");
  toggle($time_header, $result_header);
}

function createBox() {
  $game.innerHTML = "";
  let box = document.createElement("div");
  let boxColor = `rgb(${getRandom(0, 254)}, ${getRandom(0, 254)}, ${getRandom(
    0,
    254
  )})`;
  let boxSize = getRandom(30, 100);
  let top = getRandom(0, 300 - boxSize);
  let left = getRandom(0, 300 - boxSize);
  box.style.backgroundColor = boxColor;
  box.style.width = box.style.height = boxSize + "px";
  box.style.cursor = "pointer";
  box.style.top = top + "px";
  box.style.left = left + "px";
  box.style.position = "absolute";
  box.setAttribute("data-box", "true");
  $game.insertAdjacentElement("afterbegin", box);
}

$game.addEventListener("click", clickedBox);
function clickedBox(event) {
  if (event.target.dataset.box) {
    createBox();
    score++;
  }
}

function timer() {
  let interval = setInterval(function () {
    $time.textContent = ($time.textContent - 0.1).toFixed(1);
    if ($time.textContent <= 0.0) {
      clearInterval(interval);
      end();
    }
  }, 100);
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function end() {
  $start.classList.remove("hide");
  $game.style.backgroundColor = "#ccc";
  $game.innerHTML = "";
  $game_time.removeAttribute("disabled");
  $result.textContent = score;
  toggle($result_header, $time_header);
  checkUser();
}

function checkUser() {
  if (chek == true) {
    list = getData("listUsers");
    if (list[list.length - 1].score < score) {
      list.pop();
      login();
      showUsers();
    }
  } else {
    login();
    showUsers();
  }
}

$game_time.addEventListener("change", setTime);

function setTime() {
  $time.textContent = $game_time.value;
  toggle($time_header, $result_header);
}

function toggle(first, second) {
  first.classList.remove("hide");
  second.classList.add("hide");
}

$login.addEventListener("click", function () {
  toggle($appPage, $loginPage);
  showUsers();
});

function login() {
  user.name = $nameUser.value;
  user.score = score;
  list.push(user);
  sendData(list);
}

function showUsers() {
  $list.innerHTML = "";
  list = getData("listUsers");
  sortByScore(list, "score")  //  сортировка по (массив и свойство)
  let listForHtml = list.slice(0, 10); // переменная для отображения рейтинга топ 10
  listForHtml.forEach(function (elem) {
    $list.insertAdjacentHTML(
      "beforeend",
      `<li class="user">
      ${elem.name} ----- ${elem.score}
    </li>`
    );
  });
}

function sendData(data) {
  localStorage.setItem("listUsers", JSON.stringify(data));
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setLocal() {
  sendData([]);
}

function sortByScore(arr, prop) {
  let resultSort = arr.sort(function (a, b) {
    if (a[prop] > b[prop]) return -1;
  });
  return resultSort;
}