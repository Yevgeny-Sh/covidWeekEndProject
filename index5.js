let body = document.querySelector("body");
let container = document.querySelector(".container");
let bottom = document.querySelector(".bottom");

let logic = {
  continentClicked: `Europe`,
  stateClicked: `deaths`,
};

createTopButtons();

//start functions

function createTopButtons() {
  asiaBtn = document.createElement("button");
  asiaBtn.innerText = "Asia";
  asiaBtn.addEventListener("click", () => {
    logic.continentClicked = "Asia";
    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  europeBtn = document.createElement("button");
  europeBtn.innerText = "Europe";
  europeBtn.addEventListener("click", () => {
    logic.continentClicked = "Europe";
    //destroyChart(myChart);
    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  americasBtn = document.createElement("button");
  americasBtn.innerText = "Americas";
  americasBtn.addEventListener("click", () => {
    logic.continentClicked = "Americas";

    getCovidData(logic.continentClicked, logic.stateClicked);
  });

  africabtn = document.createElement("button");
  africabtn.innerText = "Africa";
  africabtn.addEventListener("click", () => {
    logic.continentClicked = "Africa";
    getCovidData(logic.continentClicked, logic.stateClicked);
  });

  confirmedbtn = document.createElement("button");
  confirmedbtn.innerText = "confirmed";
  confirmedbtn.addEventListener("click", () => {
    logic.stateClicked = "confirmed";

    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  deathsbtn = document.createElement("button");
  deathsbtn.innerText = "deaths";
  deathsbtn.addEventListener("click", () => {
    logic.stateClicked = "deaths";

    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  criticalbtn = document.createElement("button");
  criticalbtn.innerText = "critical";
  criticalbtn.addEventListener("click", () => {
    logic.stateClicked = "critical";

    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  recoveredbtn = document.createElement("button");
  recoveredbtn.innerText = "recovered";
  recoveredbtn.addEventListener("click", () => {
    logic.stateClicked = "recovered";

    getCovidData(logic.continentClicked, logic.stateClicked);
  });
  body.append(asiaBtn, europeBtn, americasBtn, africabtn);
  body.append(confirmedbtn, deathsbtn, criticalbtn, recoveredbtn);
}

function errorMessege(err) {
  const errorContainer = document.querySelector(".error");
  errorContainer.innerHTML = err;
}
//
async function getCovidData(continent, state) {
  try {
    const fetchResponsePromise = await fetch(
      ` https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries`
    );
    const data = await fetchResponsePromise.json();

    let worldArray = addData(data);
    let countriesInContinent = await getCountriesData(continent);
    //worldArray; -250 countries covid data
    //countriesInContinent - 50 countries in a continent

    destroyChart();

    showChart(countriesInContinent, worldArray, state);

    drawCountriesButtons(countriesInContinent, worldArray);
  } catch (err) {
    errorMessege(err);
  }
}
function addData(object) {
  let arr = [];
  arr.push(...object.data);
  let dataArray = [];
  arr.forEach((element) => {
    let x = new Object();
    x.name = element.name;
    x.deaths = element.latest_data.deaths;
    x.confirmed = element.latest_data.confirmed;
    x.recovered = element.latest_data.recovered;
    x.critical = element.latest_data.critical;

    dataArray.push(x);
  });
  return dataArray;
}

async function getCountriesData(continent) {
  try {
    const fetchResponsePromise = await fetch(
      ` https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${continent}`
    );
    const countriesData = await fetchResponsePromise.json();
    let allCountriesInContinant = [];
    countriesData.forEach((element) => {
      allCountriesInContinant.push(element.name.common);
    });
    return allCountriesInContinant;
  } catch (err) {
    errorMessege(err);
  }
}

function stateInContinant(countries, worldArray, state) {
  const stateArray = [];
  countries.forEach((element) => {
    for (let i = 0; i < worldArray.length; i++) {
      if (element === worldArray[i].name) {
        //console.log(element, worldArray[i].name, worldArray[i][state]);
        stateArray.push(worldArray[i][state]);
      }
    }
  });
  return stateArray;
}
function nameInContinant(countries, worldArray) {
  const nameArray = [];
  countries.forEach((element) => {
    for (let i = 0; i < worldArray.length; i++) {
      if (element === worldArray[i].name) {
        nameArray.push(worldArray[i].name);
      }
    }
  });
  return nameArray;
}
// function destroyChart() {
//   const chrt = document.getElementById("myChart");
//   chrt.destroy();
// }

function showChart(countries, worldArray, state) {
  let cntrs = nameInContinant(countries, worldArray);
  let data = stateInContinant(countries, worldArray, state);
  let label = `# of  ${state}`;
  const ctx = document.getElementById("myChart").getContext("2d");
  let myChart;
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: cntrs,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          ticks: {
            display: true,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  return myChart;
}

function drawCountriesButtons(countries, worldArray) {
  countries.forEach((element) => {
    for (let i = 0; i < worldArray.length; i++) {
      if (element === worldArray[i].name) {
        let btn = document.createElement("button");
        btn.innerText = worldArray[i].name;
        //event handler
        btn.addEventListener("click", (e) => {
          let name = event.target.innerText;
          let div = document.createElement("div");
          // console.log(name); //seems he knows world array//
          worldArray.forEach((element) => {
            if (element.name === name) {
              let text = `covid state in ${element.name} is
              confirmed= ${element.confirmed}
              deaths=${element.deaths}
              recoverd = ${element.recovered}
              critical=${element.critical}`;
              console.log(text);
              div.innerText = text;
              div.style.backgroundColor = "yellow";
              container.appendChild(div);
            }
          });
        });
        container.appendChild(btn);
      }
    }
  });
}

// function renderInCase() {
//   if (logic.continentClicked === `Asia` && logic.stateClicked === `confirmed`) {
//     getCovidData("Asia", "confirmed");
//   } else if (1) {
//   }
// }

function destroyChart(myChart) {
  if (myChart !== undefined) {
    myChart.destroy();
  }
}
