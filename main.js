let arr = [145, 292, 290];
let select = document.getElementById("select");
var nameCurrency = [];

arr.forEach(function(id) {
  let option = document.createElement("option");
  fetch(`http://www.nbrb.by/API/exrates/currencies/${id}`)
    .then(response => response.json())
    .then(date => {
      select.appendChild(option);
      option.innerText = date.Cur_Abbreviation;
      option.setAttribute("data-curr-id", id);
      nameCurrency.push(date.Cur_Name_EngMulti);
      getCurrency(nameCurrency);
    });
});

document.getElementById("button").disabled = true;
document.getElementById("input").addEventListener("change", event => {
  const value = event.target.value;
  if (value === "") {
    document.getElementById("button").disabled = true;
  } else {
    document.getElementById("button").disabled = false;
  }
});

function getCurrency(nameCurrency) {
  document.getElementById("button").onclick = function() {
    let index = select.options.selectedIndex;
    const selectedOption = Array.from(select.options).find(
      option => option.innerText === select.value
    );
    fetch(
      `http://www.nbrb.by/API/ExRates/Rates/${selectedOption.getAttribute(
        "data-curr-id"
      )}`
    )
      .then(response => response.json())
      .then(item => {
        let rate = item.Cur_OfficialRate;
        const date = item.Date;
        getSum(rate, nameCurrency[index], date);
      });
  };
}

let text = document.createElement("h4");
document.body.appendChild(text);
function getSum(rate, nameCurrency, date) {
  let result = (document.getElementById("input").value / rate).toFixed(2);
  const da = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(date));
  text.innerText = `You can buy ${result} ${nameCurrency} for ${
    document.getElementById("input").value
  } BYN -- ${da}`;
}
