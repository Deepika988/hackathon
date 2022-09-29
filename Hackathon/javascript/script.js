// date setting
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1;
var yyyy = today.getFullYear();
today = yyyy+'-'+mm+'-'+dd;;
document.getElementById("datefield").setAttribute("min",today);
//event listener to search flights
let search=document.getElementById("search-btn");
let body_content=document.getElementById("body-content");
let flight_results=document.getElementById("flight-search-results");
search.addEventListener("click",function(){
      body_content.style.display="none";
      flight_results.style.display="flex";
});
