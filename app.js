// BUDGET MODEL
const budgetModel = (() => {});
// BUDGET VIEW
const budgetView = (() => {
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
    dateLabel: ".date-summary"
  };

  return {
    getDOMStrings: function() {
      return DOMStrings;
    },
  };
})();
// BUDGET CONTROLLER
const budgetController = ((bModel, bView) => {

  const setupEventListeners = () => {
    const DOM = bView.getDOMStrings();
    // Заменить функцию
    document.querySelector(DOM.inputBtn).addEventListener("click", () => console.log('help'));
    document.addEventListener("keypress", (event) => {
      if (event.code === "Enter") {
        console.log(true);
        event.preventDefault();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", () => console.log("hah"));
    document
      .querySelector(DOM.inputType)
      .addEventListener("change", () => console.log("hahahah"));
  }

  return {
    init() {
      console.log("app started");
      setupEventListeners();
    },
    
  };
})(budgetModel, budgetView);

budgetController.init();
