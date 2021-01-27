// BUDGET MODEL
const budgetModel = (() => {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // all data
  const data = {
    allItems: {
      income: [],
      expense: [],
    },
    totals: {
      income: 0,
      expense: 0,
    },
    budget: 0,
    percentageUsed: -1,
  };

  const calculateTotal = (type) => {
    let sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItem(type, desc, val) {
      let newItem;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      if (type === "expense") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "income") {
        newItem = new Income(ID, desc, val);
      }

      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem(type, id) {
      let ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget() {
      calculateTotal("income");
      calculateTotal("expense");

      data.budget = data.totals.income - data.totals.expense;

      if (data.totals.income > 0) {
        data.percentageUsed = Math.round(
          (data.totals.expense / data.totals.income) * 100
        );
      } else {
        data.percentageUsed = -1;
      }
    },

    calculatePercentages() {
      data.allItems.expense.forEach(function (cur) {
        cur.calcPercentage(data.totals.income);
      });
    },

    getPercentages() {
      let allPerc = data.allItems.expense.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentageUsed,
      };
    },

    // local storage
    storeData() {
      localStorage.setItem("data", JSON.stringify(data));
    },

    getStoredData() {
      localData = JSON.parse(localStorage.getItem("data"));
      return localData;
    },

    updateData(StoredData) {
      data.totals = StoredData.totals;
      data.budget = StoredData.budget;
      data.percentage = StoredData.percentage;
    },
  };
})();

// BUDGET VIEW
const budgetView = (() => {
  // required element classes
  const DOMStrings = {
    inputType: "#checkbox",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".submit-button",
    budgetLabel: ".main-counter",
    incomeLabel: ".income-counter",
    expensesLabel: ".expenses-counter",
    percentageLabel: ".expenses-percentage",
    container: ".list-container",
    expensesPercLabel: ".percentage-value-item",
    dateLabel: ".date-summary",
  };
  // format numbers from inputs
  const formatNumber = (number, type) => {
    let numSplit, int, dec;
    num = Math.abs(number);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];

    return (type === "expense" ? "-" : "+") + " " + int + "." + dec;
  };

  return {
    // get values of inputs
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).checked
          ? "expense"
          : "income",
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },
    // add element to list-container
    addListItem(obj, type) {
      let html, element;

      if (type === "income") {
        element = DOMStrings.container;
        html = `
          <div class="list-container__item" id="income-${obj.id}">
            <div class="item__details">
              <div class="name">${obj.description}</div>
            </div>
            <div class="item__value">
              <div class="value__number income-style">
                <span>${formatNumber(obj.value, type)}</span>
              </div>
            </div>
            <span class="delete-button">
              <i class="fas fa-times"></i>
            </span>
          </div>
        `;
      } else if (type === "expense") {
        element = DOMStrings.container;
        html = `
          <div class="list-container__item" id="expense-${obj.id}">
            <div class="item__details">
              <div class="name">${obj.description}</div>
            </div>
            <div class="item__value expense-style">
              <div class="value__number">
                <span>${formatNumber(obj.value, type)}</span>
              </div>
              <div class="value__percentage">
                <span class="percentage-value-item">- 1%</span>
              </div>
            </div>
            <span class="delete-button">
              <i class="fas fa-times"></i>
            </span>
          </div>
        `;
      }
      document.querySelector(element).insertAdjacentHTML("afterbegin", html);
    },
    // delete element from list-container
    deleteListItem(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    // clear all fields after adding element
    clearFields() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fields.forEach((current, index, array) => (current.value = ""));

      fieldsArr[0].focus();
    },
    // show current month and year in header
    displayMonth() {
      let now, year, month, months;
      now = new Date();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent =
        months[month] + " " + year;
    },
    // display budgets counters
    displayBudget(obj) {
      let type;
      obj.budget > 0 ? (type = "income") : (type = "expense");
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(
        obj.totalIncome,
        "income"
      );
      document.querySelector(
        DOMStrings.expensesLabel
      ).textContent = formatNumber(obj.totalExpense, "expense");

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },
    // toggle styles for inputs 
    changedTypeToggle() {
      let fields = document.querySelectorAll(
        DOMStrings.inputType +
          "," +
          DOMStrings.inputDescription +
          "," +
          DOMStrings.inputValue
      );
      Array.prototype.forEach.call(fields, function (current) {
        current.classList.toggle("red");
        current.classList.toggle("red-border");
      });
      document.querySelector(DOMStrings.inputBtn).classList.toggle("red");
    },
    // display percentages
    displayPercentages(percentages) {
      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      Array.prototype.forEach.call(fields, function (current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },
    // return required classnames to controller
    getDOMStrings() {
      return DOMStrings;
    },
  };
})();

// BUDGET CONTROLLER
const budgetController = ((bModel, bView) => {
  // all event listeners
  const setupEventListeners = () => {
    const DOM = bView.getDOMStrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", (event) => {
      if (event.code === "Enter") {
        ctrlAddItem();
        event.preventDefault();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", bView.changedTypeToggle);
  };
  // update database from localStorage
  const loadData = () => {
    let storedData, newIncItem, newExpItem;

    storedData = bModel.getStoredData();

    if (storedData) {
      bModel.updateData(storedData);

      storedData.allItems.income.forEach(function (cur) {
        newIncItem = bModel.addItem("income", cur.description, cur.value);
        bView.addListItem(newIncItem, "income");
      });

      storedData.allItems.expense.forEach(function (cur) {
        newExpItem = bModel.addItem("expense", cur.description, cur.value);
        bView.addListItem(newExpItem, "expense");
      });

      budget = bModel.getBudget();
      bView.displayBudget(budget);

      updatePercentages();
    }
  };
  // update main counter
  const updateBudget = () => {
    bModel.calculateBudget();
    let budget = bModel.getBudget();
    bView.displayBudget(budget);
  };
  // update perc under all expenses item
  const updatePercentages = () => {
    bModel.calculatePercentages();
    let percentages = bModel.getPercentages();
    bView.displayPercentages(percentages);
  };
  // add Item
  const ctrlAddItem = () => {
    let input, newItem;
    input = bView.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      newItem = bModel.addItem(input.type, input.description, input.value);
      bView.addListItem(newItem, input.type);
      bView.clearFields();
      updateBudget();
      updatePercentages();
      bModel.storeData();
    }
  };
  // delete Item
  const ctrlDeleteItem = (event) => {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      bModel.deleteItem(type, ID);
      bView.deleteListItem(itemID);
      updateBudget();
      updatePercentages();
      bModel.storeData();
    }
  };

  return {
    // public function, setup event listeners and start app
    init() {
      console.log("good luck / app started");
      bView.displayMonth();
      bView.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1,
      });
      setupEventListeners();
      loadData();
    },
  };
})(budgetModel, budgetView);

budgetController.init();
