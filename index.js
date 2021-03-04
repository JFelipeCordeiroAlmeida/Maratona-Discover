const Modal = () => {
  document.querySelector('.modal-overlay').classList.toggle("active");
};

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) ||
    [];
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),
  add(transaction){
    Transaction.all.push(transaction);
    App.Reload();
  },

  remove(index){
    Transaction.all.spliece(index, 1);
    App.Reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach(transaction => {
      if( transaction.amount >= 0 ) {
        income += transaction.amount;
      };
    });


    return income;
  },

  expense() {
    let expense = 0;
    Transaction.all.forEach(transaction => {
      if( transaction.amount < 0 ) {
        expense += transaction.amount;
      };
    });


    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expense();
  }
};

const AddRowTable = {
  transactionsContainer : document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = AddRowTable.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    AddRowTable.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction (transaction, index) {
    const CSSclass = transaction.amount >= 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);
    const HTML = `
    <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
        <img onclick=Trasaction.remove(${index}) src="./assets/minus.svg" alt="Remover Transação">
    </td>`
    console.log(HTML)
    return HTML;
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expense());
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransations() {
    AddRowTable.transactionsContainer.innerHTML = "";
  }
}

const Utils = {
  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

  formatAmount(value){
    value = Number(value) * 100;

    return Math.round(value)
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "")
    value = Number(value) / 100;
    value = value.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validadeField(){
    const { description, amount, date } = Form.getValues();
    if(description.trim() === ""){
      throw new Error("Por favor, preencha o campo Descrição")
    }
    if (amount.trim() === "") {
      throw new Error("Por favor, preencha o campo Valor")
    }
    if (date.trim() === ""){
      throw new Error("Por favor, preencha o campo Data")
    }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return{ description, amount, date }
  },

  ClearFields () {
    Form.description.value = '';
    Form.amount.value = '';
    Form.date.value = '';
  },

  submit(event) {
    event.preventDefault()

    try {
      Form.validadeField();
      const transaction = Form.formatValues();
      Transaction.add(transaction);
      Form.ClearFields ();
      Modal()
    } catch (error) {
        alert(error.message)
    };

  },


}

const App = {
  init() {
    Transaction.all.forEach(AddRowTable.addTransaction);

    AddRowTable.updateBalance();

    Storage.set(Transaction.all);
  },
  Reload() {
    AddRowTable.clearTransations();
    App.init();
  }
}

App.init();
