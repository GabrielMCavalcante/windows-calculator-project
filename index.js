const buttons = document.querySelectorAll('button');

buttons.forEach(btn=>{
    addEventListenerAll('mouseup drag', btn, ()=>{
        const btnPressed = btn.textContent;
        switch(btnPressed)
        {
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
                    console.log('You pressed '+btnPressed);
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