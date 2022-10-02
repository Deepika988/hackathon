var price_changer, price_change_int = 0, clicked = false;
var today = new Date();
//------------Disable past dates in calender------------
function date_setting() {
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();
      if (dd < 10) {
            dd = '0' + dd
      }
      if (mm < 10) {
            mm = '0' + mm
      }
      today = yyyy + '-' + mm + '-' + dd;
}
date_setting();
document.getElementById("datefield").setAttribute("min", today);
document.getElementById("datefield-2").setAttribute("min", today);

//---------------Assigning Variables----------------//
var back_arrow = document.getElementById("back_arrow");
var return_journey = document.getElementById("round-trip-1");
var one_trip_journey = document.getElementById("one-trip-1");
var round_trip_box = document.getElementById("round-trip-box");
var round_trip_return = document.getElementById("datefield-return2");
var round_trip_return_box = document.getElementById("datefield_div");
document.getElementById("datefield-return").setAttribute("min", today);
round_trip_return.setAttribute("min", today);
const asia_box = document.getElementById("air_asia");
const india_box = document.getElementById("air_india");
const first_box = document.getElementById("go_first");
const indigo_box = document.getElementById("indigo");
const spiceject_box = document.getElementById("spicejet");

//--------------Empty array for Filters------------//
let airlines_array = [];
let stops_array = [];
round_trip_return_box.style.display = "none";
let airlines_data = document.querySelectorAll(".airlines_data");
let stops_data = document.querySelectorAll(".stops");

//-----------------Function to display return date---------//
function display() {
      round_trip_box.style.display = return_journey.checked ? "flex" : "none";
      round_trip_return_box.style.display = return_journey.checked ? "flex" : "none";
}
return_journey.addEventListener("click", function () {
      display();

});
one_trip_journey.addEventListener("click", function () {
      display();
});

let search = document.getElementById("search-btn");
let body_content = document.getElementById("body-content");
let flight_results = document.getElementById("flight-search-results");
var from_text = "", to_text, date_text, persons_text, from_text_lower, to_text_lower, return_date_text;


//---------------------------Event Listener to Search Flights------------------------//
search.addEventListener("click", function () {
      from_text = document.getElementById('from-1').value;
      from_text_lower = from_text.toLowerCase();
      to_text = document.getElementById('to-1').value;
      to_text_lower = to_text.toLowerCase();
      date_text = document.getElementById("datefield").value;
      // Date_type=Date.parse(date_text);
      // dt = new Date(Date_type);
      // day_num=dt.getDay();
      persons_text = document.getElementById("num-1").value;
      console.log(from_text);

      //---------------condition to check empty fields----------------------------//
      if (from_text != "" && to_text != "" && date_text != "" && persons_text != 0) {
            if (from_text_lower == to_text_lower) {
                  alert("please give different source and destination");
            }
            else {

                  //-----------------Condition to check round trip-----------------//
                  if (round_trip_return_box.style.display != "none") {
                        return_date_text = document.getElementById("datefield-return").value;
                        if (return_date_text != "") {
                              if (date_text > return_date_text) {
                                    alert("Please Enter Date greater than departure date");
                              }
                              else {

                                    //----------------condition to check numbe rof passengers---------//
                                    if (persons_text > 10 || persons_text <= 0) {
                                          alert("Please Enter number of passengers only 1-10");
                                    }
                                    else {
                                          document.getElementById("datefield-return2").value = return_date_text;
                                          document.getElementById('from-2').value = from_text_lower;
                                          document.getElementById('to-2').value = to_text_lower;
                                          document.getElementById('datefield-2').value = date_text;
                                          document.getElementById('num-2').value = persons_text;
                                          body_content.style.display = "none";
                                          back_arrow.style.display = "block";
                                          flight_results.style.display = "flex";
                                          jsonFetching();
                                    }
                              }
                        }
                        else {
                              alert("Fill all the fields");
                        }
                  }
                  else {
                        if (persons_text > 10 || persons_text <= 0) {
                              alert("Please Enter number of passengers only 1-10");
                        }
                        else {
                              document.getElementById('from-2').value = from_text_lower;
                              document.getElementById('to-2').value = to_text_lower;
                              document.getElementById('datefield-2').value = date_text;
                              document.getElementById('num-2').value = persons_text;
                              body_content.style.display = "none";
                              back_arrow.style.display = "block";
                              flight_results.style.display = "flex";
                              jsonFetching();
                        }
                  }

            }
      }
      else {
            alert("Fill all the fields");
      }

});

//----------JSON data fetching function-----------------//
function jsonFetching() {
      let http = new XMLHttpRequest();
      http.open('get', 'airportdata.json', true);
      http.send();
      http.onload = function () {
            if (this.readyState == 4 && this.status == 200) {
                  let aeroplanes = JSON.parse(this.responseText);
                  aeroplanes.sort(GetPriceSortOrder("price"));
                  let locations = aeroplanes[(aeroplanes.length) - 1].locations;

                  locations.map(element => {
                        return element.toLowerCase();
                  });
                  
                  //-----price range slider variable asisgnment-----------//
                  var slider = document.getElementById("range");
                  var output = document.getElementById("price_value");
                  output.innerHTML = slider.value;
                  let result = "";
                  display_flights();

                  //-------------------Filters for number of stops----------------//
                  for (let i = 0; i < stops_data.length; i++) {
                        let action = 0;
                        stops_data[i].addEventListener("click", function () {
                              if (action % 2 == 0) {
                                    document.querySelector(".flights-information").style.display = "none";
                                    stops_array.push(stops_data[i].value);
                                    action = action + 1;
                                    result = "";
                                    display_flights();
                                    document.querySelector(".flights-information").style.display = "flex";
                              }
                              else {
                                    stops_array.splice(stops_array.indexOf(stops_data[i].value), 1);
                                    action = action + 1;
                                    result = "";
                                    display_flights();

                              }
                        })
                  }

                  //---------------------------Price slider Filter--------------//
                  slider.addEventListener("click", function (event) {
                        price_changer = event.target.value;
                        output.innerHTML = price_changer;
                        price_change_int = parseInt(price_changer);
                        clicked = true;
                        display_flights();
                  });

                  //--------------Airlines Filters------------------------//
                  for (let i = 0; i < airlines_data.length; i++) {
                        let action = 0;
                        airlines_data[i].addEventListener("click", function () {
                              if (action % 2 == 0) {
                                    document.querySelector(".flights-information").style.display = "none";
                                    airlines_array.push(airlines_data[i].value);
                                    action = action + 1;
                                    result = "";
                                    display_flights();
                                    document.querySelector(".flights-information").style.display = "flex";
                                    console.log(airlines_array);
                              }
                              else {
                                    console.log(airlines_array.indexOf(airlines_data[i].value));
                                    airlines_array.splice(airlines_array.indexOf(airlines_data[i].value), 1);
                                    action = action + 1;
                                    result = "";
                                    display_flights();
                                    console.log(airlines_array);
                              }
                        });
                  }

                  //--------------------- Displaying Flight Results----------------------//
                  function display_flights() {
                        let flightdata = "";
                        for (let i = 0; i < (aeroplanes.length) - 1; i++) {
                         
                              item = aeroplanes[i];
                             
                              if (airlines_array.length == 0 && stops_array.length == 0) {
                                    result += card_data(flightdata, item);

                              }
                              else if (airlines_array.includes(item.name) || stops_array.includes(item.stops)) {
                                    result += card_data(flightdata, item);
                              }

                              document.querySelector(".flights-information").innerHTML = result;
                              console.log(clicked);
                              if (clicked) {
                                    console.log("click");

                                    if (item.price <= price_change_int) {
                                          result = "";
                                          result += card_data(flightdata, item);
                                    }
                                    document.querySelector(".flights-information").innerHTML = result;
                              }


                        }

                  }


                 //------------------Each flight data----------------------------------//
                  function card_data(flightdata, item) {
                        for (let i = 0; i < (item.source.length); i++) {


                              if (item.source[i] == from_text_lower && item.destination[i] == to_text_lower) {
                                    flightdata = flightDetails(flightdata, item, i);
                              }
                              if (round_trip_return_box.style.display != "none") {
                                    if (item.destination[i] == from_text_lower && item.source[i] == to_text_lower) {
                                          flightdata = flightDetails(flightdata, item, i);
                                    }
                              }
                        }
                        return flightdata;
                  }
              }
      }
}

//--------------- Flight Card Details-------------------------//
function flightDetails(flightdata, item, i) {
      flightdata += `<div class="one-flight-info">
      <div class="flight-data">
      <img src="${item.image}" alt="flight-img" class="flight-data-img">
      </div>
      <div class="flight-data">
      
      <p class="flight-brand flight-brand-name">${item.name}</p>
      <p class="flight-brand">${item.id}</p>
      </div>
      <div class="arrival-details flight-data">
      <p>${item.arrival_time[i]}</p>
      <p >${item.source[i].charAt(0).toUpperCase() + item.source[i].slice(1)}</p>
      </div>
      <div class="flight-data">
      <p class="number_stops">${item.stops}</p>
      <hr>
      <p>${item.duration} hrs</p>
      </div>
      <div class="departure-details flight-data">
            <p>${item.departure_time[i]}</p>
            <p>${item.destination[i].charAt(0).toUpperCase() + item.destination[i].slice(1)}</p>
      </div>
      <p class="flight-data number_stops">₹ ${item.price}</p>
      <div class="flight-data">
      <button class="flight-data-button uppercase-conver" id="flight-data-button">Book Now</button>
</div>
      </div>`
      return flightdata;
}

//------------------Sorting by price----------------------------//
function GetPriceSortOrder(property) {
      return function (a, b) {
            if (a[property] < b[property]) {
                  return -1;
            } else if (a[property] > b[property]) {
                  return 1;
            }
            return 0;
      }

}

//-----------------------Searching Flights--------------------------//
function searching() {
      var input, flight_searching, filter, a, txtValue;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      flight_searching = document.querySelectorAll(".one-flight-info");
      for (let i = 0; i < flight_searching.length; i++) {
            a = flight_searching[i].getElementsByClassName("flight-brand")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                  flight_searching[i].style.display = "flex";
            } else {
                  flight_searching[i].style.display = "none";
            }
      }
}

back_arrow.addEventListener("click", function () {
      body_content.style.display = "flex";
      document.getElementById("flight-search-results").style.display = "none";
      back_arrow.style.display = "none";
});



