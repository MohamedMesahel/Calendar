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

    dateElem.dataset.type = "date";
    dateElem.dataset.value = date;
    timeElem.dataset.type = "time";
    tdElem2.dataset.type = "todo";
    tdElem3.dataset.type = "category";

    dateElem.dataset.id = id;
    timeElem.dataset.id = id;
    tdElem2.dataset.id = id;
    tdElem3.dataset.id = id;
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

      googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
      // US Holidays
      events: 'en.usa#holiday@group.v.calendar.google.com',
      eventClick: function(arg) {
        // opens events in a popup window
        window.open(arg.event.url, 'google-calendar-event', 'width=700,height=600');

        arg.jsEvent.preventDefault() // don't navigate in main tab
      },
      loading: function(bool) {
        document.getElementById('loading').style.display =
          bool ? 'block' : 'none';
      },
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
  // function commitSave(event) {
  //   closeEditModalBox();

  //   let id = event.target.dataset.id;
  console.log("Hello", todoList)
  // }
  function commitSave(event) {
    closeEditModalBox();
    
    let id = event.target.dataset.id;
    let todo = document.getElementById("todo-edit-todo").value;
    let category = document.getElementById("todo-edit-category").value;
    let date = document.getElementById("todo-edit-date").value;
    let time = document.getElementById("todo-edit-time").value;
    
    // remove from Calendar
    calendar.getEventById(id).remove();

    for( let i = 0; i < todoList.length; i++){
      if(todoList[i].id == id){
 
       todoList[i] = {
         id : id,
         todo : todo,
         category : category,
         date : date,
         time : time,
        };
 
        addEvent({
         id: id,
         title : todoList[i].todo,
         start : todoList[i].date,
       });
       console.log(todoList[i], "app is running")
      }
    }
    save();


    // update the Table
    let tdNodeList = todoTable.querrySelectorAll("td")
    for(let i = 0; i < tdNodeList.length; i++){
      if(tdNodeList[i].dataset.id == id){
      let type = tdNodeList[i].dataset.type;
      switch(type){
        case "date":
          tdNodeList[i].innerText = formatDate(date);
          break;
        case "time":
          tdNodeList[i].innerText = time;
          break;
        case "todo" :
          tdNodeList[i].innerText = todo;
          break;
        case "category" :
          tdNodeList[i].innerText = category;
          break;

        }
     
      }
    }
   

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

/* This is the forecast function that is displayed on the HTML - JASON MA
*/
// This defines the city outside, as global variables - JASON MA 
var buttonWaiting = document.getElementById("searchCity");
var searchEl = $("#searchTerm").val();

// Step 1, wait for button click - JASON MA
buttonWaiting.addEventListener('click', search);
var cityLocation = "";

  function search() {
 // Step 2, target the value of the input - JASON MA
   cityLocation = $("#searchTerm").val();
    getFuture();
 }

 // Step 3, render the target - JASON MA
 function getFuture() {
  console.log("getFuture function has initiated");
   
  var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?q= " + cityLocation + "&appid=cbe8fc6d3eba09369c7445d7ce20d535&units=imperial";
  fetch(requestUrl)
   .then(function (response) {
     return response.json();
   })
   .then(function (data) {
  // Moment converts the time from data.list
     $("#day-one-time").text(moment(data.list[0].dt_txt).format("MMM D, YYYY"));
     $("#day-two-time").text(moment(data.list[8].dt_txt).format("MMM D, YYYY"));
     $("#day-three-time").text(moment(data.list[16].dt_txt).format("MMM D, YYYY"));
     $("#day-four-time").text(moment(data.list[24].dt_txt).format("MMM D, YYYY"));
     $("#day-five-time").text(moment(data.list[32].dt_txt).format("MMM D, YYYY"));
     console.log(data.list[0].dt_txt);
     $("#day-one-temperature").text("Temperature " +data.list[0].main.temp);
     $("#day-two-temperature").text("Temperature " +data.list[8].main.temp);
     $("#day-three-temperature").text("Temperature " +data.list[16].main.temp);
     $("#day-four-temperature").text("Temperature " +data.list[24].main.temp);
     $("#day-five-temperature").text("Temperature "+ data.list[32].main.temp);
     //Finds Humidity in next 5 days
     $("#day-one-precipitation").text("Precipitation % " +data.list[0].pop);
     $("#day-two-precipitation").text("Precipitation % " +data.list[8].pop);
     $("#day-three-precipitation").text("Precipitation % " +data.list[16].pop);
     $("#day-four-precipitation").text("Precipitation % " +data.list[24].pop);
     $("#day-five-precipitation").text("Precipitation % "+ data.list[32].pop);
    // Finds Wind Forecast
     $("#day-one-wind").text("Wind " +data.list[0].wind.speed);
     $("#day-two-wind").text("Wind " +data.list[8].wind.speed);
     $("#day-three-wind").text("Wind " +data.list[16].wind.speed);
     $("#day-four-wind").text("Wind " +data.list[24].wind.speed);
     $("#day-five-wind").text("Wind "+ data.list[32].wind.speed);
     // Finds Weather
   
     $("#day-one-weather").text("weather " +data.list[0].weather.description);
     $("#day-two-weather").text("weather " +data.list[8].weather.description);
     $("#day-three-weather").text("weather " +data.list[16].weather.description);
     $("#day-four-weather").text("weather " +data.list[24].weather.description);
     $("#day-five-weather").text("weather "+ data.list[32].weather.description);
   });
   
  
}




search();