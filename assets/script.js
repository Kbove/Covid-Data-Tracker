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