const
    totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.querySelector('#form'),
    operationHeader = document.querySelector('.operation__header'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount'),
    balance = document.querySelector('.balance'),
    info = document.querySelector('.info');

let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];

const operationHeaderCheck = () => {
    if (dbOperation.length == 0) {
        operationHeader.style.cssText = 'display:none;';
        balance.style.cssText = 'display:none;';
        info.style.cssText = '';
    }
    else {
        operationHeader.style.cssText = '';
        balance.style.cssText = '';
        info.style.cssText = 'display:none;';
    }
};

const generateId = () => `id${Math.round(Math.random() * 1e8).toString(16)}`

const renderOperation = (operation) => {
    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    listItem.innerHTML = `
        ${operation.time}
        <br>${operation.description}
        <span class="history__money">${operation.amount} ₽</span>
        <button class="history__delete" data-id="${operation.id}">x</button>
    `;
    historyList.append(listItem);
};

const updateBalance = () => {
    const resultIncome = dbOperation
        .filter((item) => item.amount > 0)
        .reduce((result, item) => result + item.amount, 0);
    const resultExpenses = dbOperation
        .filter((item) => item.amount < 0)
        .reduce((result, item) => result + item.amount, 0);
    totalMoneyIncome.textContent = resultIncome + ' ₽';
    totalMoneyExpenses.textContent = resultExpenses + ' ₽';
    totalBalance.textContent = (resultIncome + resultExpenses) + ' ₽';
};

const addOperation = (event) => {
    event.preventDefault();
    const
        operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;
        operationName.style.borderColor = '';
        operationAmount.style.borderColor = '';
        if(operationNameValue && operationAmountValue){

            const operation = {
                id: generateId(),
                description: operationNameValue,
                amount: +operationAmountValue,
                time: new Date().toLocaleString()
            };

            dbOperation.push(operation);
            init();

        } else {
            if (!operationNameValue) operationName.style.borderColor = 'red';
            if (!operationAmountValue) operationAmount.style.borderColor = 'red';
        }
        operationName.value = '';
        operationAmount.value = '';
};

const deleteOperation = (event) => {
    const target = event.target
    if (event.target.classList.contains('history__delete')) {
        dbOperation = dbOperation
            .filter(operation => operation.id !== target.dataset.id);
        init();
    }
};

const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperation)
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
    operationHeaderCheck();
};

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation);

init();
