const catagorySelectorButtons = document.getElementsByName("catagorySelectorButton")
const closeButtons = document.getElementsByName("closeTicket")
const selectedTicketDiv = document.getElementById('selectedTicketDiv');
const confirmButton = document.getElementById('confirmButton');
const totalPriceField = document.getElementById('totalPriceField');
const ticketListField = document.getElementById('ticketListField');
const choosenTicketList = []
const catagoryNameList = []
const catagoryPriceList = []
const totalPrice = []
let ticketListValue;
let totalPriceAll = 0;

closeButtons.forEach((c)=>{
    c.addEventListener('click',()=> {
        updateSelectedTicketDiv()
    })
})

for (let i = 0; i < catagorySelectorButtons.length; i++) {
    catagoryNameList[i] = catagorySelectorButtons[i].querySelector('h1[name="catagoryName"]').innerHTML
    catagoryPriceList[i] = catagorySelectorButtons[i].querySelector('h1[name="catagoryPrice"]').innerHTML
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
            if(choosenTicketList[i].has(`${rowValue}:${colValue}@${ticketSelectorButton.innerHTML.trim()}`)) {
                console.log(`Removed ${rowValue}:${colValue}@${ticketSelectorButton.innerHTML.trim()}`)
                choosenTicketList[i].delete(`${rowValue}:${colValue}@${ticketSelectorButton.innerHTML.trim()}`)
            }
            else {
                console.log(`Added ${rowValue}:${colValue}@${ticketSelectorButton.innerHTML.trim()}`)
                choosenTicketList[i].add(`${rowValue}:${colValue}@${ticketSelectorButton.innerHTML.trim()}`)
            }
        })
    })
}

function setsToNamedRequestParams(sets) {
    const paramStrings = [];
  
    sets.forEach((set, index) => {
      const setArray = Array.from(set);
      const paramString = setArray.join(',');
      const paramName = `cat[${index}]`;
      paramStrings.push(`${paramName}=${paramString}`);
    });
  
    return paramStrings.join('&');
  }

function updateSelectedTicketDiv() {
    for (let i = 0; i < catagoryNameList.length; i++) {
        totalPrice[i] =  parseInt(choosenTicketList[i].size) * parseInt(catagoryPriceList[i]);
    }
    totalPriceAll = 0
    totalPrice.forEach((t)=> {
        totalPriceAll += t;
    })
    selectedTicketDiv.innerHTML = totalPriceAll
    totalPriceField.value = totalPriceAll
    ticketListValue = setsToNamedRequestParams(choosenTicketList)
    ticketListField.value = ticketListValue
    if(totalPriceAll <= 0){
        confirmButton.setAttribute('disabled', '')
    }
    else {
        confirmButton.removeAttribute('disabled')
    }
}