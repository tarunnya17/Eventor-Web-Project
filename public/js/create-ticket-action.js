// Assuming you have loaded the HTML and are running JavaScript in a browser context

// Get all radio buttons by their name attribute
const radioButtons = document.getElementsByName("inline-radio-group");
const parentElement = document.getElementById('parentDiv'); 
// Initialize a variable to store the selected value
let selectedValue = null;

function createGridDiv(num) {
    for (let i = 0; i < num; i++) {
        const div = document.createElement('div');
        div.classList.add('grid', 'grid-cols-3', 'gap-4', 'p-3');

        const textInput = document.createElement('input');
        textInput.setAttribute('type', 'text');
        textInput.setAttribute('placeholder','Catagory Name');
        textInput.classList.add('border', 'border-gray-300', 'p-2', 'rounded-md');
        textInput.id = `catagory[${i}]`
        textInput.name = `catagory[${i}]`

        const numberInput1 = document.createElement('input');
        numberInput1.setAttribute('type', 'number');
        numberInput1.setAttribute('placeholder','Ticket Price');
        numberInput1.classList.add('border', 'border-gray-300', 'p-2', 'rounded-md');
        numberInput1.id = `price[${i}]`
        numberInput1.name = `price[${i}]`
    
        const numberInput2 = document.createElement('input');
        numberInput2.setAttribute('type', 'number');
        numberInput2.classList.add('border', 'border-gray-300', 'p-2', 'rounded-md');
        numberInput2.setAttribute('placeholder','Capacity');
        numberInput2.id = `amount[${i}]`
        numberInput2.name = `amount[${i}]`

        div.appendChild(textInput);
        div.appendChild(numberInput1);
        div.appendChild(numberInput2);
        parentElement.appendChild(div);
    }
  }

// Function to handle radio button change
function handleRadioChange() {
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      break; // Exit the loop once a checked radio button is found
    }
  }
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
  createGridDiv(selectedValue)
  // Now, selectedValue contains the value of the selected radio button
  console.log("Selected value:", selectedValue);
}


radioButtons[0].addEventListener("change", handleRadioChange);
radioButtons[1].addEventListener("change", handleRadioChange);
radioButtons[2].addEventListener("change", handleRadioChange);
radioButtons[3].addEventListener("change", handleRadioChange);