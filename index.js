const buttons = document.querySelectorAll('button');
const display = document.querySelector('header div#mainDisplay');
const history = document.querySelector('header div#historyDisplay');
let operations = [];
let operationsHistory = [];
let lastNumber = 0;
let lastOperator = '';
let firstAddAfterDot = false;
let comesFromHandleEqualOp = false;
let operationFinished = false;

buttons.forEach(btn => {
    addEventListenerAll('mouseup drag', btn, () => {
        const btnPressed = btn.textContent;
        switchBtns(btnPressed, true);
        console.log(operationsHistory);
    });
});

document.addEventListener('keyup', pressed=>{
    let keyPressed;
    switch(pressed.code)
    {
        case 'Numpad1':
        case 'Numpad2':
        case 'Numpad3':
        case 'Numpad4':
        case 'Numpad5':
        case 'Numpad6':
        case 'Numpad7':
        case 'Numpad8':
        case 'Numpad9':
        case 'Numpad0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
        case 'Digit0':
            {
                keyPressed = pressed.code.split('').pop();
                break;
            }
        case 'NumpadMultiply':
            {
                keyPressed = 'X';
                break;
            }
        case 'NumpadDivide':
            {
                keyPressed = '÷';
                break;
            }
        case 'NumpadSubtract':
        case 'Minus':
            {
                keyPressed = '-';
                break;
            }
        case 'NumpadAdd':
            {
                keyPressed = '+';
                break;
            }
        case 'NumpadEnter':
        case 'Enter':
        case 'Equal':
            {
                keyPressed = '=';
                break;
            }
    }
    switchBtns(keyPressed, false);
});

function switchBtns(obj, defaultVal)
{
    switch (obj) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            {
                addNewOperation(parseInt(obj));
                break;
            }
        case '+':
        case '-':
            {
                addNewOperation(obj);
                break;
            }
        case 'X':
            {
                addNewOperation('*');
                break;
            }
        case '÷':
            {
                addNewOperation('/');
                break;
            }
        case '=':
            {
                handleEqualOperation();
                break;
            }
        case '%':
            {
                calcPercent();
                break;
            }
        case '¹/x':
            {
                calcOneOverX();
                break;
            }
        case 'x²':
            {
                calcSquare();
                break;
            }
        case '√':
            {
                calcSquareRoot();
                break;
            }
        case '±':
            {
                calcPlusMinus();
                break;
            }
        case '←':
            {
                eraseEntry();
                break;
            }
        case 'CE':
            {
                clearDisplay();
                clearLastOperation();
                clearLastOperationHistory();
                resetLastValues(0, lastOperator);
                break;
            }
        case 'C':
            {
                clearDisplay();
                clearOperations();
                clearOperationsHistory();
                clearHistory();
                resetLastValues(0, '');
                break;
            }
        case ',':
        case '.':
            {
                addDot();
                break;
            }
        default:
            {
                if(defaultVal)
                    throwError('Error');
            }
    }
}

function resetLastValues(lastNum, lastOp) {
    lastNumber = lastNum;
    lastOperator = lastOp;
}

function clearLastOperation() {
    operations.pop();
}

function clearLastOperationHistory()
{
    operationsHistory.pop();
}

function replaceDisplay(value) {
    clearDisplay();
    updateDisplay(value);
}

function eraseEntry() {
    //console.log(operations);
    if (operations.length > 0 && operations.length != 2) {
        const lastPos = operations.length - 1;
        let erase = operations[lastPos];
        erase = [...erase.toString().split('')];
        erase.pop();
        if(erase.length == 1 && isOperator(erase[0]))
            erase.pop();
        operations[lastPos] = (erase.length > 0) ? parseFloat(erase.join('')) : 0;
        replaceDisplay(operations[lastPos]);
    }
}

function updateResult(lastPos) {
    replaceDisplay(operations[lastPos]);
    lastNumber = operations[lastPos];
}

function calcOneOverX() {
    const lastPos = operations.length - 1;
    const result = parseFloat(1 / parseFloat(operations[lastPos]));

    const oldHistory = operationsHistory[operationsHistory.length - 1];
    operationsHistory[operationsHistory.length - 1] = `¹/(${oldHistory})`;
    updateHistory();

    operations[lastPos] = result;
    
    updateResult(lastPos);
}

function calcSquare() {
    const lastPos = operations.length - 1;
    const result = parseFloat(Math.pow(parseFloat(operations[lastPos]), 2));

    const oldHistory = operationsHistory[operationsHistory.length - 1];
    operationsHistory[operationsHistory.length - 1] = `sqr(${oldHistory})`;
    updateHistory();

    operations[lastPos] = result;

    
    updateResult(lastPos);
}

function calcSquareRoot() {
    const lastPos = operations.length - 1;
    const result = parseFloat(Math.sqrt(parseFloat(operations[lastPos])));

    const oldHistory = operationsHistory[operationsHistory.length - 1];
    operationsHistory[operationsHistory.length - 1] = `√(${oldHistory})`;
    updateHistory();

    operations[lastPos] = result;
    updateResult(lastPos);
}

function calcPlusMinus() {
    if(display.innerHTML == 0) return;

    const lastPos = operations.length - 1;
    if (lastPos >= 0)
        operations[lastPos] = -(operations[lastPos]);
    
    updateResult(lastPos);
}

function calcPercent() {
    const tax = parseFloat(lastNumber) / 100;
    const perc = operations.length > 1 ? operations[0] * tax : tax;
    replaceDisplay(perc);
    operations[operations.length - 1] = perc.toString();

    operationsHistory[operationsHistory.length - 1] = perc;
    updateHistory();

    
    lastNumber = perc;
}

function throwError(message) {
    replaceDisplay(message);
    clearOperations();
    clearOperationsHistory();
    clearHistory();
    resetLastValues(0, '');
}

function addEventListenerAll(events, element, fn) {
    events.split(' ').forEach(event => {
        element.addEventListener(event, fn);
    })
}

function updateDisplay(value) 
{
    if(display.innerHTML.length + 1 > 11 || value.length > 11)
    {
        throwError('Error');
        return;
    }

    (display.innerHTML == 0 ||
        display.innerHTML == 'Error' ||
        display.innerHTML == 'Infinity') ? display.innerHTML = value :
        display.innerHTML += value;
}

function updateHistory()
{
    clearHistory();
    operationsHistory.forEach(value=>{
        history.innerHTML += value.toString().replace('*', '×').replace('"/"', '÷');
    })
}

function clearHistory()
{
    history.innerHTML = ' ';
}

function clearOperationsHistory()
{
    operationsHistory = [];
}

function clearDisplay() {
    display.innerHTML = 0;
}

function isOperator(input) {
    return ['+', '-', '*', '/'].indexOf(input) == -1 ? false : true;
}

function getResult() {
    if (operations.length == 3) {
        const result = calcResult();
        if (result == undefined) return true;
        addResultToOperations(result.replace(',', '.'));
        replaceDisplay(operations[0]);

        if(comesFromHandleEqualOp)
        {
            operationsHistory.push('=');
            updateHistory();
            
            operationsHistory = [result];
            comesFromHandleEqualOp = false;
        }
        
        return true;
    }
    return false;
}

function hasDot() {
    if(operations.length == 0) return false;
    const lastPos = operations.length - 1;
    const thisNumber = operations[lastPos].toString();

    return thisNumber.split('').indexOf('.') == -1 ? false : true;
}

function addDot() {
    if (!hasDot()) {
        if (operations.length == 1 || operations.length == 3) 
        {
            const lastPos = operations.length - 1;
            operations[lastPos] = operations[lastPos].toString() + '.0';

            operationsHistory[operationsHistory.length - 1] = operations[lastPos];

            updateDisplay(',');
        }
        else if(operations.length == 0 || operations.length == 2)
        {
            operations.push('0.0');

            operationsHistory.push('0.0');

            replaceDisplay('0,');
        }
        firstAddAfterDot = true;
    }
}

function addNewOperation(newOp) 
{
    if (display.innerHTML == 'Infinity')
        throwError('Infinity');

    if (isNaN(newOp)) 
    {
        getResult();

        if (display.innerHTML == 'Error') return;

        const lastPos = operations.length - 1;

        if (operations.length == 0) 
        {
            operations.push(0);
            operations.push(newOp.toString());

            operationsHistory.push(0);
            operationsHistory.push(newOp.toString());
        }
        else 
        {
            if (!isNaN(operations[lastPos]))
            {
                operations.push(newOp.toString());

                operationsHistory.push(newOp.toString());
            }
            else if (isOperator(operations[lastPos]))
            {
                operations[lastPos] = newOp.toString();

                operationsHistory[operationsHistory.length-1] = newOp.toString(); 
            }
                
        }
        operationFinished = false;
        lastOperator = newOp.toString();
        updateHistory();
    }
    else 
    {
        const lastPos = operations.length - 1;
        if(!firstAddAfterDot)
        {
            if(!operationFinished)
            {
                if (!isNaN(operations[lastPos])) 
                {
                    operations[lastPos] = operations[lastPos].toString() + newOp.toString();

                    operationsHistory[operationsHistory.length - 1] = operations[lastPos].toString();

                    updateDisplay(newOp);
                }
                else 
                {
                    operations.push(newOp);

                    operationsHistory.push(newOp);

                    replaceDisplay(newOp);
                }
            }
            else 
            {
                clearOperations();
                clearOperationsHistory();
                clearHistory();

                operations.push(newOp);

                operationsHistory.push(newOp);

                replaceDisplay(newOp);
            }
        }
        else
        {
            if(newOp != 0) 
            {
                operations[lastPos] = (parseFloat(operations[lastPos])+newOp/10).toString();
                
                operationsHistory[operationsHistory.length - 1] = operations[lastPos].toString(); 

                replaceDisplay(operations[lastPos].toString().replace('.', ','));
            }
            else
            {
                updateDisplay(0);
            }
            firstAddAfterDot = false;
        }
        lastNumber = parseFloat(operations[operations.length - 1]);
        operationFinished = false;
    }
    
}

function handleEqualOperation() {
    comesFromHandleEqualOp = true;
    if (lastOperator == '' || getResult())
    {
        operationFinished = true;
        return;
    } 

    if (operations.length == 1) {
        operations.push(lastOperator);
        operations.push(lastNumber);

        operationsHistory.push(lastOperator);
        operationsHistory.push(lastNumber);
        
        getResult();
    }
    else {
        operations.push(operations[0]);

        operationsHistory.push(operations[0]);

        lastNumber = operations[0];
        getResult();
    }
    operationFinished = true;
}

function calcResult() {
    if (operations[1] == '/' && operations[2] == 0) {
        throwError();
        return;
    }

    operations[0] = ('(' + operations[0] + ')').replace(',', '.');
    operations[2] = ('(' + operations[2] + ')').replace(',', '.');
    const expression = operations.join('');
    return (eval(expression)).toString().replace('.', ',');
}

function addResultToOperations(result) {
    clearOperations();
    operations.push(result);
}

function clearOperations() {
    operations = [];
}