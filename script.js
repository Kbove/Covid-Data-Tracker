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
