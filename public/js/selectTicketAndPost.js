const catagorySelectorButtons = document.getElementsByName("catagorySelectorButton")
const selectedTicketDiv = document.getElementById('selectedTicketDiv');
const choosenTicketList = []
const catagoryNameList = []
const catagoryPriceList = []

for (let i = 0; i < catagorySelectorButtons.length; i++) {
    catagoryNameList[i] = catagorySelectorButtons[i].querySelector('h1[name="catagoryName"]').innerHTML
    choosenTicketList[i] = new Set()
    callTicketSelector(i)
}

function callTicketSelector (i) {
    const ticketSelectorPDivs = document.getElementsByName(`ticketSelectorPDiv-${i}`)
    ticketSelectorPDivs.forEach((ticketSelectorPDiv) => {
        const rowValue = ticketSelectorPDiv.querySelector(`input[name="row-${i}"]`).value
        const colValue = ticketSelectorPDiv.querySelector(`input[name="col-${i}"]`).value
        const ticketSelectorButton = ticketSelectorPDiv.querySelector(`button[name="ticketSelectorButton-${i}"]`)
        ticketSelectorButton.addEventListener('click', ()=> {
            ticketSelectorButton.classList.toggle('bg-green-400')
            ticketSelectorButton.classList.toggle('bg-slate-200')
            if(choosenTicketList[i].has(`${rowValue}:${colValue}:${ticketSelectorButton.innerHTML.trim()}`)) {
                console.log(`Removed ${rowValue}:${colValue}:${ticketSelectorButton.innerHTML.trim()}`)
                choosenTicketList[i].delete(`${rowValue}:${colValue}:${ticketSelectorButton.innerHTML.trim()}`)
            }
            else {
                console.log(`Added ${rowValue}:${colValue}:${ticketSelectorButton.innerHTML.trim()}`)
                choosenTicketList[i].add(`${rowValue}:${colValue}:${ticketSelectorButton.innerHTML.trim()}`)
            }
        })
    })
}

function modifySelectedTicketDiv() {
    
}

