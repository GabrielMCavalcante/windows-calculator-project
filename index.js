const buttons = document.querySelectorAll('button');
const display = document.querySelector('header div#display');
let operations = [];
let lastNumber = 0;
let lastOperator = '';

buttons.forEach(btn=>{
    addEventListenerAll('mouseup drag', btn, ()=>{
        const btnPressed = btn.textContent;
        switch(btnPressed)
        {
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
        }
    });
});

function addEventListenerAll(events, element, fn)
{
    events.split(' ').forEach(event=>{
        element.addEventListener(event, fn);
    })
}

function updateDisplay(value)
{
    (display.innerHTML == 0) ? display.innerHTML = value : display.innerHTML += value;
}

function clearDisplay()
{
    display.innerHTML = 0;
}

function isOperator(input)
{
    return ['+','-','*','/'].indexOf(input) == -1 ? false : true; 
}

function getResult()
{
    if(operations.length == 3)
    {
        const result = calcResult();
        addResultToOperations(result);
        clearDisplay();
        updateDisplay(operations[0]);

        return true;
    }
    return false;
}

function addNewOperation(newOp)
{
    if(isNaN(newOp))
    {
        const operation = isOperator(newOp);
        switch(operation)
        {
            case true:
                {
                    getResult();
                    const lastPos = operations.length - 1;
                    if(operations.length == 0)
                    {
                        operations.push(0);
                        operations.push(newOp.toString());
                    }
                    else 
                    {
                        if(!isNaN(operations[lastPos]))
                            operations.push(newOp.toString());
                        
                        else if(isOperator(operations[lastPos]))
                            operations[lastPos] = newOp.toString();
                    }
                    lastOperator = newOp.toString();
                    break;
                }
            case false:
                {
                    return;
                }
        }
    }
    else 
    {
        const lastPos = operations.length-1;
        if(!isNaN(operations[lastPos])) {
            operations[lastPos] = parseFloat(operations[lastPos] + newOp.toString());
            updateDisplay(newOp);
        }
        else
        {
            operations.push(parseFloat(newOp));
            clearDisplay();
            updateDisplay(newOp);
        }
            
        lastNumber = parseFloat(operations[operations.length-1]);
    }
    console.log(operations);
    console.log(lastOperator, lastNumber);
}

function handleEqualOperation()
{
    if(getResult()) return;

    if(operations.length == 1)
    {
        operations.push(lastOperator);
        operations.push(lastNumber);
        getResult();
    }
    else
    {
        operations.push(operations[0]);
        lastNumber = operations[0];
        getResult();
    }

}

function calcResult() 
{
    operations[0] = '('+operations[0]+')';
    operations[2] = '('+operations[2]+')';
    const expression = operations.join('');
    return eval(expression);
}

function addResultToOperations(result)
{
    clearOperations();
    operations.push(result);
}

function clearOperations()
{
    operations = [];
}