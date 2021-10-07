function getCurrent() {
  var currentURL = 'https://covid19.mathdro.id/api/'
  fetch(currentURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.confirmed.value);
      var casesConfirmed = data.confirmed.value;
      $("#total-case-current").text(numberWithCommas(casesConfirmed))
    }
    )
}

function displayDate() {
  var now = moment().format("MM-DD-YYYY");
  console.log(now)
  $("#current-date").text(now);
}

let chartCanvas = document.getElementById('vaccChartCanvas').getContext('2d');
let chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Covid Vaccine Data History',
      font: {
        size: 35,
        family: 'Crimson Pro',
      }
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        text: 'Daily Vaccine Count',
        display: true,
        font: {
          size: 20,
          family: 'Crimson Pro',
        }
        // font:
        // color:
        // padding:
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        text: 'Total Vaccine Count',
        display: true,
        font: {
          size: 20,
          family: 'Crimson Pro',
        },
        // color:
        // padding:
      },
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
    }
  },
  tooltips: {
    enabled: true
  }
};

let dailyData = []
let totalData = []
let chartLabels = []
let userInputDays = 30
let vaccChart
let maxDays = 365

function fetchVaccData() {
  let countryName = countries[0]
  //handle special case for compatibility
  //vaccine api only work for usa, not us
  if (countryName.toLowerCase() === 'us') {
    countryName = 'usa';
  }
  //update maxDays to current day minus beginning date with data
  fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries/" + countryName + "?lastdays=" + maxDays + "&fullData=true")
    .then(response => response.json())
    .then(data => {
      // console.log(data)
      //clear data for new search
      dailyData = []
      totalData = []
      chartLabels = []
      //populate chart data
      data.timeline.forEach((timeline) => {
        chartLabels.push(timeline.date)
        dailyData.push(timeline.daily)
        totalData.push(timeline.total)
      })

      maxDays = Math.min(maxDays, chartLabels.length)
      $('#dateRange').attr("max", maxDays)
      renderChart()
    });

}

//function to render vaccine data using charjs
function renderChart() {
  if (vaccChart) {
    vaccChart.data.datasets[0].data = totalData.slice(maxDays - userInputDays, maxDays)
    vaccChart.data.datasets[1].data = dailyData.slice(maxDays - userInputDays, maxDays)
    vaccChart.data.labels = chartLabels.slice(maxDays - userInputDays, maxDays)
    vaccChart.update()
  } else {
    let charData = {
      datasets: [
        {
          type: 'line',
          label: 'Total Vacc',
          data: totalData.slice(maxDays - userInputDays, maxDays),
          yAxisID: 'y1',
          borderColor: 'rgb(249, 146, 39)',
        }, {
          type: 'bar',
          label: 'Daily Vacc',
          data: dailyData.slice(maxDays - userInputDays, maxDays),
          yAxisID: 'y',
          backgroundColor: 'rgb(43, 133, 190)',
          boederWidth: 1,
          hoverBorderColor: '#000',
        }
      ],
      labels: chartLabels.slice(maxDays - userInputDays, maxDays),
    };
    vaccChart = new Chart(chartCanvas, {
      data: charData,
      options: chartOptions
    });
  }
}

// mock api call to show data before search button
// should be replaced by search event triger
//getVaccApi(30);
$('#dateRange').change((e) => {
  userInputDays = e.target.value
  renderChart();
})

$("#dateRange").on("input", function (e) {
  $('#rangeVal').text(e.target.value);
});


let dataOfAllCountries = null;
let defaultCountries = ["US"];
let countries = [];

function render() {
  let innerHTML = "";
  // render countries
  const dataOfAllCountriesKeys = Object.keys(dataOfAllCountries);

  let countriesDatas = countries.map((countryText) => {
    //handle special case for compatibility
    //current api only work for us, not usa
    if (countryText === 'usa') {
      country = 'us'
    } else {
      country = countryText
    }
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
      <div class="card">
        <div class="title-container"
          <h5 class="card-title">${item.country}</h5>
        </div>
        <div class="card-body">
            <p class="card-text" id="population">Population: ${numberWithCommas(item.population)}</p>
            <p class="card-text" id="confirmed">Confirmed: ${numberWithCommas(item.confirmed)}</p>
            <p class="card-text" id="deaths">Deaths: ${numberWithCommas(item.deaths)}</p>
            <p class="card-text" id="mort">Mortality Rate: ${(item.deaths / item.confirmed).toFixed(2)}%</p>
        </div>
      </div>`;
  });
  document.getElementById("cards").innerHTML = innerHTML;
}
function setUp() {
  countries = defaultCountries;
  fetch(`https://covid-api.mmediagroup.fr/v1/cases`)
    .then((res) => res.json())
    .then((data) => {
      dataOfAllCountries = data;
      render();
    });
    getCurrent();
    displayDate();
    fetchVaccData()
}

function handleClickSearch(e) {
  e.preventDefault();
  const countryInput = document.getElementById("country-input");
  const country = countryInput.value;
  if (!country.trim()) countries = defaultCountries;
  else countries = [country.trim()];
  render();
  fetchVaccData();
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
//convert number 123456 to comma format 123,456
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

$('#searchForm').submit(handleClickSearch)

setUp();


