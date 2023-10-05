const catagorySelectorButtons = document.getElementsByName("catagorySelectorButton")
const choosenTicketList = []

for (let i = 0; i < catagorySelectorButtons.length; i++) {
    choosenTicketList[i] = new Set()
    catagorySelectorButtons[i].addEventListener('click', ()=> {
        console.log(choosenTicketList)
        callTicketSelector(i)
    })
}

function callTicketSelector (i) {
    let ticketSelectorPDivs = document.getElementsByName("ticketSelectorPDiv")
    ticketSelectorPDivs.forEach((ticketSelectorPDiv) => {
        const rowValue = ticketSelectorPDiv.querySelector('input[name="row"]').value
        const colValue = ticketSelectorPDiv.querySelector('input[name="col"]').value
        const ticketSelectorButton = ticketSelectorPDiv.querySelector('button[name="ticketSelectorButton"]')
        ticketSelectorButton.addEventListener('click', ()=> {
            ticketSelectorButton.classList.toggle('bg-green-400')
            if(choosenTicketList[i].has(`${rowValue}:${colValue}`)) {
                console.log("choosenTicketList")
                choosenTicketList[i].delete(`${rowValue}:${colValue}`)
            }
            else {
                choosenTicketList[i].add(`${rowValue}:${colValue}`)
            }
        })
    })
}
