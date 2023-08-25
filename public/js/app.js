window.onload = function () {
    const el = document.getElementById('event_dropdown')
    const eventButton = document.getElementById('event_button')
    eventButton.addEventListener('click', function () {
        el.classList.toggle('hidden')
        console.log("hi")
    })
}

