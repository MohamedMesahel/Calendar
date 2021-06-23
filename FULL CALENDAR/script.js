todoMain();

function todoMain() {
  const DEFAULT_OPTION = "Chose Category";
  let inputElem,
    inputElem2,
    dateInput,
    timeInput,
    addButton,
    sortButton,
    selectElem,
    todoList = [],
    calendar,
    shortlistBtn,
    changeBtn;

  //  localStorage.setItem("todoList", todoList);
  //  todoList = localStorage.getItem("todoList");
  //  console.loge(todoList);

  getElements();
  addListeners();
  initCalendar();
  load();
  renderRows(todoList);
  updateSelectoptions();

  function getElements() {
    inputElem = document.getElementsByTagName("input")[0];
    inputElem2 = document.getElementsByTagName("input")[1];
    dateInput = document.getElementById("dateInput");
    timeInput = document.getElementById("timeInput");
    addButton = document.getElementById("addBtn");
    sortButton = document.getElementById("sortBtn");
    selectElem = document.getElementById("categoryFilter");
    shortlistBtn = document.getElementById("shortlistBtn");
    changeBtn = document.getElementById("saveChangesBtn");
  }

  function addListeners() {
    addButton.addEventListener("click", addEntry, false);
    sortButton.addEventListener("click", sortEntery, false);
    selectElem.addEventListener("change", multipleFilter, false);
    shortlistBtn.addEventListener("change", multipleFilter, false);


    document.getElementById("todo-modal-close-btn").addEventListener("click",  closeEditModalBox, false);
    changeBtn.addEventListener("click", commitSave, false);
  }

  function addEntry(event) {
    let inputValue = inputElem.value;
    inputElem.value = "";

    let inputValue2 = inputElem2.value;
    inputElem2.value = "";

    let dateValue = dateInput.value;
    dateInput.value = "";

    let timeValue = timeInput.value;
    timeInput.value = "";

    let obj = {
      id: _uuid(),
      todo: inputValue,
      category: inputValue2,
      date: dateValue,
      time: timeValue,
      done: false,
    };
    renderRow(obj);

    todoList.push(obj);

    save();

    updateSelectoptions();
  }

  function updateSelectoptions() {
    let options = [];

    todoList.forEach((obj) => {
      options.push(obj.category);
    });

    let optionsSet = new Set(options);
    // empty the select options

    selectElem.innerHTML = "";

    let newOptionElem = document.createElement("option");
    newOptionElem.value = DEFAULT_OPTION;
    newOptionElem.innerText = DEFAULT_OPTION;
    selectElem.appendChild(newOptionElem);

    for (let option of optionsSet) {
      let newOptionElem = document.createElement("option");
      newOptionElem.value = option;
      newOptionElem.innerText = option;
      selectElem.appendChild(newOptionElem);
    }
  }
  function save() {
    let stringified = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringified);
  }

  function load() {
    let retrieved = localStorage.getItem("todoList");

    todoList = JSON.parse(retrieved);
    // console.log(typeof todoList)
    if (todoList == null) todoList = [];
  }
  function renderRows(arr) {
    arr.forEach((todoObj) => {
      renderRow(todoObj);
    });
  }
  function renderRow({
    todo: inputValue,
    category: inputValue2,
    date,
    time,
    id,
    done,
  }) {
    // add a new row

    let table = document.getElementById("todoTable");

    let trElem = document.createElement("tr");
    table.appendChild(trElem);

    // checkbox cell
    let checkboxElem = document.createElement("input");
    checkboxElem.type = "checkbox";
    checkboxElem.addEventListener("click", checkboxClickCallback, false);
    checkboxElem.dataset.id = id;

    let tdElem1 = document.createElement("td");
    tdElem1.appendChild(checkboxElem);
    trElem.appendChild(tdElem1);

    // date cell
    let dateElem = document.createElement("td");

    dateElem.innerText = formatDate(date);
    trElem.appendChild(dateElem);

    // time cell
    let timeElem = document.createElement("td");
    timeElem.innerText = time;
    trElem.appendChild(timeElem);

    // to-do cell
    let tdElem2 = document.createElement("td");
    tdElem2.innerText = inputValue;
    trElem.appendChild(tdElem2);

    // category cell
    let tdElem3 = document.createElement("td");
    tdElem3.innerText = inputValue2;
    tdElem3.className = "categoryCell";
    trElem.appendChild(tdElem3);

    // Edit cell
    let editSpan = document.createElement("span");
    editSpan.innerText = "edit";
    editSpan.className = "material-icons";
    editSpan.addEventListener("click", toEditItem, false);
    editSpan.dataset.id = id;
    let editTd = document.createElement("td");
    editTd.appendChild(editSpan);
    trElem.appendChild(editTd);

    // delete cell
    let spanElem = document.createElement("span");
    spanElem.innerText = "delete";
    spanElem.className = "material-icons";
    spanElem.addEventListener("click", deleteItem, false);
    spanElem.dataset.id = id;
    let tdElem4 = document.createElement("td");
    tdElem4.appendChild(spanElem);
    trElem.appendChild(tdElem4);

    // console.log(done);
    // Done button
    checkboxElem.type = "checkbox";
    checkboxElem.checked = done;
    if (done) {
      trElem.classList.add("strike");
    } else {
      trElem.classList.remove("strike");
    }
    addEvent({
      id: id,
      title: inputValue,
      start: date,
    });

    // For edit on cell feature
    // dateElem.dataset.editable = true;
    // timeElem.dataset.editable = true;
    // tdElem2.dataset.editable = true;
    // tdElem3.dataset.editable = true;

    // dateElem.dataset.type = "date";
    // dateElem.dataset.value = date;
    // timeElem.dataset.type = "time";
    // tdElem2.dataset.type = "todo";
    // tdElem3.dataset.type = "category";

    // dateElem.dataset.id = id;
    // timeElem.dataset.id = id;
    // tdElem2.dataset.id = id;
    // tdElem3.dataset.id = id;
    // tdElem2.addEventListener("dblclick", allowEdit, false);

    function deleteItem() {
      trElem.remove();
      updateSelectoptions();
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id) todoList.splice(i, 1);
      }
      save();
      // remove from Calendar
      calendar.getEventById(this.dataset.id).remove();
    }
    // console.log(inputValue);

    function checkboxClickCallback() {
      trElem.classList.toggle("strike");
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id == this.dataset.id)
          todoList[i]["done"] = this.checked;
      }
      save();
    }
    function toEditItem(event) {
      showEditModalBox();
     let id = event.target.dataset.id;
      let result = todoList.find(todoObj => todoObj.id == id);
      let {todo, category, date, time} = result;
      document.getElementById("todo-edit-todo").value = todo;
      document.getElementById("todo-edit-category").value = category;
      document.getElementById("todo-edit-date").value = date;
      document.getElementById("todo-edit-time").value = time;

      changeBtn.dataset.id = id;

    }
    
  }

  function _uuid() {
    var d = Date.now();
    if (
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    ) {
      d += performance.now(); //use high-precision timer if available
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  function sortEntery() {
    // console.log("sortEntry runnig");
    todoList.sort((a, b) => {
      let aDate = Date.parse(a.date);
      let bDate = Date.parse(b.date);

      return aDate - bDate;
    });

    save();

    clearTable();

    renderRows(todoList);
  }

  function initCalendar() {
    var calendarEl = document.getElementById("calendar");

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      initialDate: "2021-06-07",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      events: [],
    });

    calendar.render();
  }

  function addEvent(event) {
    calendar.addEvent(event);
  }

  function clearTable() {
    // Empty the Table and keep the first Row
    let trElems = document.getElementsByTagName("tr");
    for (let i = trElems.length - 1; i > 0; i--) {
      trElems[i].remove();
    }

    calendar.getEvents().forEach((event) => event.remove());
  }

  function multipleFilter() {
    clearTable();

    // short list btn checked

    let selection = selectElem.value;

    if (selection == DEFAULT_OPTION) {
      if (shortlistBtn.checked) {
        let filteredIncompleteArray = todoList.filter(
          (obj) => obj.done == false
        );
        renderRows(filteredIncompleteArray);

        let filteredDoneArray = todoList.filter((obj) => obj.done == true);
        renderRows(filteredDoneArray);
      } else {
        renderRows(todoList);
      }
    } else {
      let filteredCategoryArray = todoList.filter(
        (obj) => obj.category == selection
      );

      if (shortlistBtn.checked) {
        let filteredIncompleteArray = filteredCategoryArray.filter(
          (obj) => obj.done == false
        );
        renderRows(filteredIncompleteArray);

        let filteredDoneArray = filteredCategoryArray.filter(
          (obj) => obj.done == true
        );
        renderRows(filteredDoneArray);
      } else {
        renderRows(filteredDoneArray);
      }
    }
  }

  function onTableClicked(event) {
    if (event.target.matches("td") && event.target.dataset.editable == "true") {
      let tempInputElem;
      switch (event.target.dataset.type) {
        case "date":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "date";

          tempInputElem.value = event.target.dataset.value;
          break;
        case "time":
          tempInputElem = document.createElement("input");
          tempInputElem.type = "time";
          tempInputElem.value = event.target.innerText;
          break;
        case "todo":
        case "category":
          tempInputElem = document.createElement("input");
          tempInputElem.value = event.target.innerText;

          break;
        default:
      }
      event.target.innerText = "";
      event.target.appendChild(tempInputElem);

      tempInputElem.addEventListener("change", onChange, false);

    }


    function onChange(event) {
      let changedValue = event.target.value;
      let id = event.target.parentNode.dataset.id;
      let type = event.target.parentNode.dataset.type;

      // remove from Calendar
      calendar.getEventById(id).remove();

      todoList.forEach((todoObj) => {
        if (todoObj.id == id) {
          // todoObj.todo = changedValue;
          todoObj[type] = changedValue;
          
          
          addEvent({
            id: id,
            title: changedValue,
            start: todoObj.date,
          });
        }
      });

      save();


      if(type == "date"){
        event.target.parentNode.innerText = formatDate(changedValue);
      } else{
       event.target.parentNode.innerText = changedValue;
      }
      

    }
  }

  function formatDate(date) {
    let dateObj = new Date(date);
    let formattedDate = dateObj.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return formattedDate;
  }

  function showEditModalBox(event) {
    document.getElementById("todo-overlay").classList.add("slideIntoView");
  }

  function closeEditModalBox(event) {
    document.getElementById("todo-overlay").classList.remove("slideIntoView");

  }
  function commitSave(event) {
    closeEditModalBox();

    let id = event.target.dataset.id;
  }
}

//Local Events Function
var eventsBox = document.getElementById('eventsbox');
var fetchButton = document.getElementById('fetch-button');

function getApi() {
fetch('https://api.predicthq.com/v1/places/?q=Seattle', {
  method: 'GET', // or 'PUT'
  headers:{
    'Authorization':  'Bearer cc34uj9tf8II6ub8JPOu1ZkTBs_b-0fhLjYK9wO5',
  },
}) .then(function (response) {
return response.json();
}) .then(function (data) {
  console.log(data.results)
// for (var i = 0; i < data.results.length; i++) {
// var events = document.createElement('h3');
// var cityName = document.createElement('p');
// events.textContent = data.results[0].name;
// cityName.textContent = data.results[0].region;
// eventsBox.append(events);
// eventsBox.append(cityName);
    // }
 
fetch('https://api.predicthq.com/v1/events/?place.scope=5809844&active.gte=2021-06-21&active.lte=2022-06-21&category=community,concerts,festivals&sort=rank', {
  method: 'GET', // or 'PUT'
  headers: {
    'Authorization':  'Bearer cc34uj9tf8II6ub8JPOu1ZkTBs_b-0fhLjYK9wO5',
  },
}) .then(function (response) {
return response.json();
}) .then(function (data) {
  console.log(data.results)
  for (var i = 0; i < data.results.length; i++){
var eventsList = document.createElement('h3');
var description = document.createElement('p');
var start = document.createElement('p');
eventsList.textContent = data.results[i].title;
description.textContent = data.results[i].description;
start.textContent = data.results[i].start;
eventsBox.append(eventsList);
eventsBox.append(description);
eventsBox.append(start);
    }
});
});
};
fetchButton.addEventListener('click', getApi);