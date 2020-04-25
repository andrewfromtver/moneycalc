const
    totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.querySelector('#form'),
    operationHeader = document.querySelector('.operation__header'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount'),
    operationAttachementField = document.querySelector('.upload__button'),
    balance = document.querySelector('.balance'),
    info = document.querySelector('.info'),
    popUp = document.querySelector('.popUp');

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

function maxLengthCheck(object) {
    if (object.value.length > object.maxLength)
      object.value = object.value.slice(0, object.maxLength)
};

const generateId = () => `id${Math.round(Math.random() * 1e8).toString(16)}`

const renderOperation = (operation) => {
    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    listItem.innerHTML = `${operation.time}
    <br>${operation.description}
    <span class="history__money" data-id="${operation.id}">${operation.amount} ₽</span>
    <button class="history__delete" data-id="${operation.id}">X</button>`;
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
        operationAttachement = document.getElementById('upload').files[0];
        operationName.style.borderColor = '';
        operationAmount.style.borderColor = '';
        if(operationNameValue && operationAmountValue && operationAttachement){
            let reader = new FileReader();
            reader.readAsDataURL(operationAttachement);
            reader.onload = function() {
                const operation = {
                    id: generateId(),
                    description: operationNameValue,
                    amount: +operationAmountValue,
                    time: new Date().toLocaleString(),
                    attachement: reader.result
                };
            dbOperation.push(operation);
            init();
        };
        } else {
            if (!operationNameValue) operationName.style.borderColor = 'red';
            if (!operationAmountValue) operationAmount.style.borderColor = 'red';
            if (!operationAttachement) operationAttachementField.style.borderColor = 'red';
        }
        operationName.value = '';
        operationAmount.value = '';
        document.getElementById("upload").value = "";;
};

const showImage = (src) => {
    img = document.createElement("img");
    img.src = src;
    img.className = 'popUpImage';
    if (popUp.childNodes.length > 0) {
        popUp.removeChild(popUp.firstChild);
    }
    popUp.appendChild(img);
    up();
};

const deleteOperation = (event) => {
    const target = event.target
    if (event.target.classList.contains('history__delete')) {
        dbOperation = dbOperation.filter(operation => operation.id !== target.dataset.id);
        init();
    }
    if (event.target.classList.contains('history__money')) {
        outputInfo = dbOperation.filter(operation => operation.id !== target.dataset.id);
        if (outputInfo.length == 0) {
            showImage(dbOperation[0].attachement);
        }
        else {
            outputInfo = dbOperation.filter(operation => operation.id == target.dataset.id);
            showImage(outputInfo[0].attachement);
        }
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

const hideImage = () => {
    if (popUp.childNodes.length > 0) {
        popUp.removeChild(popUp.firstChild);
    }
    down();
};

const up = () => {
	var t;
	var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top > 0) {
		window.scrollBy(0,-100);
		t = setTimeout('up()',50);
	}
	else clearTimeout(t);
	return false;
};

const down = () => {
	var t;
	var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top == 0) {
		window.scrollBy(0, 999999999);
		t = setTimeout('down()',50);
	}
	else clearTimeout(t);
	return false;
};
