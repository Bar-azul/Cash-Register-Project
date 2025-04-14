let price = 3.26;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];


function renderCashDrawer() {
    container.innerHTML = "<p>Cash in Drawer:</p>";
    cid.forEach(([name, amount]) => {
        const p = document.createElement("p");
        p.innerText = `${name}: $${amount.toFixed(2)}`;
        container.appendChild(p);
    });
}
function round(num) {
  return Math.round(num * 100) / 100;
}


//const pricedraw = document.querySelector("#container");
// Display it in the HTML
document.addEventListener("DOMContentLoaded", () => {
    const priceElement = document.querySelector("#price");
    priceElement.innerText = `Total price: $${price}`;
    renderCashDrawer(); //

});

const input = document.querySelector("#cash");
const button = document.querySelector("#purchase-btn");
const res = document.querySelector("#change-due");
const changeback = document.querySelector("#change");
let total = cid.reduce((sum, curr) => sum + curr[1], 0);
const pricedraw = document.querySelector("#pricedraw");


function purchase() {
  res.innerText = "";
  let change = round(parseFloat(input.value) - price);
  const originalTotalInDrawer = round(cid.reduce((sum, curr) => sum + curr[1], 0));
  let changeGiven = 0;

  if (change < 0) {
    changeback.innerText = `Not enough money\nPlease enter $${(price - input.value).toFixed(2)} more.`;
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  changeback.innerText = `Change: $${change.toFixed(2)}`;
  if (change === 0) {
    res.innerText = "No change due - customer paid with exact cash";
    return;
  }

  const denominations = [
    { name: "ONE HUNDRED", val: 100 },
    { name: "TWENTY", val: 20 },
    { name: "TEN", val: 10 },
    { name: "FIVE", val: 5 },
    { name: "ONE", val: 1 },
    { name: "QUARTER", val: 0.25 },
    { name: "DIME", val: 0.10 },
    { name: "NICKEL", val: 0.05 },
    { name: "PENNY", val: 0.01 }
  ];

  let output = "";
  for (let i = 0; i < denominations.length; i++) {
    const { name, val } = denominations[i];
    const cidIndex = cid.findIndex(entry => entry[0] === name);
    let available = cid[cidIndex][1];
    let used = 0;

    while (change >= val && available >= val) {
      change = round(change - val);
      available = round(available - val);
      used = round(used + val);
    }

    if (used > 0) {
      output += `${name}: $${used.toFixed(2)}\n`;
      cid[cidIndex][1] = round(cid[cidIndex][1] - used);
      changeGiven = round(changeGiven + used);
    }
  }

  if (change > 0) {
    res.innerText = "Status: INSUFFICIENT_FUNDS";
  } else if (round(changeGiven) === round(originalTotalInDrawer)) {
    res.innerText = `Status: CLOSED\n${output.trim()}`;
  } else {
    res.innerText = `Status: OPEN\n${output.trim()}`;
  }

  input.value = "";
  renderCashDrawer();
}

button.onclick = purchase;


