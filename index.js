const buttons = document.querySelectorAll('button');
const display = document.querySelector('header div#display');
let operations = [];
let lastNumber = 0;
let lastOperator = '';
let firstAddAfterDot = false;

buttons.forEach(btn => {
    addEventListenerAll('mouseup drag', btn, () => {
        const btnPressed = btn.textContent;
        switch (btnPressed) {
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
                    addNewOperation(parseInt(btnPressed));
                    break;
                }
            case '+':
            case '-':
                {
                    addNewOperation(btnPressed);
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
                    resetLastValues(0, lastOperator);
                    break;
                }
            case 'C':
                {
                    clearDisplay();
                    clearOperations();
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
                    throwError('Error');
                }
        }
    });
});

function resetLastValues(lastNum, lastOp) {
    lastNumber = lastNum;
    lastOperator = lastOp;
}

function clearLastOperation() {
    operations.pop();
}

function replaceDisplay(value) {
    clearDisplay();
    updateDisplay(value);
}

function eraseEntry() {
    if (operations.length > 0 && operations.length != 2) {
        const lastPos = operations.length - 1;
        let erase = operations[lastPos];
        erase = [...erase.toString().split('')];
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
    operations[lastPos] = parseFloat(1 / operations[lastPos]);
    updateResult(lastPos);
}

function calcSquare() {
    const lastPos = operations.length - 1;
    operations[lastPos] = parseFloat(Math.pow(operations[lastPos], 2));
    updateResult(lastPos);
}

function calcSquareRoot() {
    const lastPos = operations.length - 1;
    operations[lastPos] = parseFloat(Math.sqrt(operations[lastPos]));
    updateResult(lastPos);
}

function calcPlusMinus() {
    const lastPos = operations.length - 1;
    if (lastPos > 1)
        operations[lastPos] = -(operations[lastPos]);
    else {
        operations.push(operations[0]);
        calcPlusMinus();
        return;
    }
    updateResult(lastPos);
}

function throwError(message) {
    replaceDisplay(message);
    clearOperations();
    resetLastValues(0, '');
}

function addEventListenerAll(events, element, fn) {
    events.split(' ').forEach(event => {
        element.addEventListener(event, fn);
    })
}

function updateDisplay(value) {
    (display.innerHTML == 0 ||
        display.innerHTML == 'Error' ||
        display.innerHTML == 'Infinity') ? display.innerHTML = value :
        display.innerHTML += value;
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
        addResultToOperations(result);
        replaceDisplay(operations[0]);

        return true;
    }
    return false;
}

function calcPercent() {
    const tax = lastNumber / 100;
    const perc = operations.length > 1 ? operations[0] * tax : tax;
    replaceDisplay(perc);
    operations[operations.length - 1] = perc;
    lastNumber = perc;
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
            updateDisplay(',');
        }
        else if(operations.length == 0 || operations.length == 2)
        {
            operations.push('0.0');
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
        }
        else 
        {
            if (!isNaN(operations[lastPos]))
                operations.push(newOp.toString());

            else if (isOperator(operations[lastPos]))
                operations[lastPos] = newOp.toString();
        }

        lastOperator = newOp.toString();
    }
    else 
    {
        const lastPos = operations.length - 1;
        if(!firstAddAfterDot)
        {
            if (!isNaN(operations[lastPos])) 
            {
                operations[lastPos] = operations[lastPos].toString() + newOp.toString();
                updateDisplay(newOp);
            }
            else 
            {
                operations.push(newOp);
                replaceDisplay(newOp);
            }
        }
        else
        {
            if(newOp != 0) 
            {
                operations[lastPos] = (parseFloat(operations[lastPos])+newOp/10).toString();
                replaceDisplay(operations[lastPos].toString().replace('.', ','));
            }
            else
            {
                updateDisplay(0);
            }
            firstAddAfterDot = false;
        }
        lastNumber = parseFloat(operations[operations.length - 1]);
    }
    console.log(operations);
}

function handleEqualOperation() {
    if (lastOperator == '' || getResult()) return;

    if (operations.length == 1) {
        operations.push(lastOperator);
        operations.push(lastNumber);
        getResult();
    }
    else {
        operations.push(operations[0]);
        lastNumber = operations[0];
        getResult();
    }

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