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
    data.allItems[type].forEach(function(cur) {
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
      ids = data.allItems[type].map(function(current) {
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
      data.allItems.expense.forEach(function(cur) {
        cur.calcPercentage(data.totals.income);
      });
    },

    getPercentages() {
      let allPerc = data.allItems.expense.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget() {
      return {
        budget: data.budget,
        totalIncome: data.totals.income,
        totalExpense: data.totals.expense,
        percentage: data.percentageUsed
      };
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
    getInput() {
      return {
        type: document.querySelector(DOMStrings.inputType).checked
          ? "expense"
          : "income",
        description: document.querySelector(DOMStrings.inputDescription).value,
        value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

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

    deleteListItem(selectorID) {
      let el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields() {
      let fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);

      fields.forEach((current, index, array) => (current.value = ""));

      fieldsArr[0].focus();
    },

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

    displayPercentages(percentages) {
      let fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      Array.prototype.forEach.call(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },
    // return required classnames to controller
    getDOMStrings() {
      return DOMStrings;
    }
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
    console.log(percentages, "lolol");
    bView.displayPercentages(percentages);
  };

  // add Item
  const ctrlAddItem = () => {
    let input, newItem;

    // 1. get the field input data
    input = bView.getInput();

    //check if there is data on fields
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = bModel.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      bView.addListItem(newItem, input.type);

      // 4. Clear the fields
      bView.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update the percentages
      updatePercentages();

      // 7. save to local storage
    }
  };

  const ctrlDeleteItem = function(event) {
    let itemID, splitID, type, ID;
    console.log(event);
    itemID = event.target.parentNode.id;
    console.log(itemID);
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. Delete the item from data structure
      bModel.deleteItem(type, ID);

      // 2. Delete the item from UI
      bView.deleteListItem(itemID);

      // 3. Update and show new budget
      updateBudget();

      // 4. Calculate and update the percentages
      updatePercentages();

      // 5. save to local storage
    }
  }


  return {
    // public finction, setup event listeners and start app
    init() {
      console.log("app started");
      bView.displayMonth();
      bView.displayBudget({
        budget: 0,
        totalIncome: 0,
        totalExpense: 0,
        percentage: -1,
      });
      setupEventListeners();
    },
  };
})(budgetModel, budgetView);

budgetController.init();



