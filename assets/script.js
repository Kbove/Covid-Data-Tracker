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
let defaultCountries = ["US", "France", "Australia"];
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

  function render() {
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
  });}
