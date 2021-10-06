




function getCurrent() {
  var currentURL = 'https://covid19.mathdro.id/api/'
  fetch(currentURL)
     .then(function (response) {
       return response.json();
     })
     .then(function (data) {
       console.log(data.confirmed.value);
       var casesConfirmed = data.confirmed.value;
       $("#total-case-current").text(casesConfirmed) 
        }
     )
    }
getCurrent();
function displayDate(){
var now = moment().format("MM-DD-YYYY");
console.log(now)
$("#current-date").text(now);
}
displayDate();



function getVaccApi(countryName, lastDays) {
    // fetch request gets a list of all the repos for the node.js organization
    let vaccAPIUrl = 'https://disease.sh/v3/covid-19/vaccine/coverage/countries/'+ countryName +'?lastdays='+ lastDays +'&fullData=true';
  
    fetch(vaccAPIUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
     
        for (i = 0; i < data.timeline.length; i++) {
            console.log(data.timeline[i])
            let tableRow = $('<tr>')
            let date = $('<td>').text(data.timeline[i].date)
            let vaccDaily = $('<td>').text(data.timeline[i].daily)
            let vaccTotal = $('<td>').text(data.timeline[i].total)

            tableRow.append(date);
            tableRow.append(vaccDaily);
            tableRow.append(vaccTotal);
            $('#vaccTable').append(tableRow);
        }
      });
  }



  getVaccApi('USA', 7);

let dataOfAllCountries = null;
let defaultCountries = ["US"];
let countries = [];

document
  .getElementById("search-btn")
  .addEventListener("click", handleClickSearch);
  setUp();


  function setUp(country = "US") {
    countries = defaultCountries;
    fetch(`https://covid-api.mmediagroup.fr/v1/cases`)
      .then((res) => res.json())
      .then((data) => {
        dataOfAllCountries = data;
        render();
      });
  }

  function render(){
  let innerHTML = "";
  // render countries
  const dataOfAllCountriesKeys = Object.keys(dataOfAllCountries);

  let countriesDatas = countries.map((country) => {
    const countryKey = dataOfAllCountriesKeys.find((key) => {
      return key.toLowerCase() === country.toLowerCase();
    });
    if (countryKey) {
      return dataOfAllCountries[countryKey];
    }
    return null;
  });
  countriesDatas.filter((item) => {
    return item !== null;
  });
  countriesDatas = countriesDatas.map((item) => {
    return item.All;
  });
  countriesDatas.forEach((item) => {
    innerHTML += `
      <div class="card" style="width: 18rem">
        <div class="card-body">
          <h5 class="card-title">${item.country}</h5>
          <p class="card-text">Population: ${item.population}</p>
          <p class="card-text">Confirmed: ${item.confirmed}</p>
          <p class="card-text">Deaths: ${item.deaths}</p>
          <p class="card-text">Death Rate: ${(
            item.deaths / item.confirmed
          ).toFixed(2)}%</p>
        </div>
      </div>`;
  });
  document.getElementById("cards").innerHTML = innerHTML;

} 

function handleClickSearch() {
const countryInput = document.getElementById("country-input");
const country = countryInput.value;
if (!country.trim()) countries = defaultCountries;
else countries = [country.trim()];
render();
}
  

