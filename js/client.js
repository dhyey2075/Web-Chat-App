const socket = io("http://localhost:8000")

const form = document.getElementById('container')
const msgInp = document.querySelector('.chat')
const msgContainer = document.querySelector('.chat-messages')
const sendBtn = document.querySelector('.btn')
const users = []
const play = new Audio('./tone.mp3')

window.setInterval(function() {
    var elem = document.querySelector('.chat-messages');
    elem.scrollTop = elem.scrollHeight;
  }, 1000);
msgContainer.overflow = 'hidden'

document.querySelector(".clear").addEventListener('click',(e)=>{
    e.preventDefault()
    msgContainer.innerHTML = ''
})

document.querySelector(".chat").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendBtn.click();
    }
})
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageElement.classList.add('message')
    messageElement.classList.add(position)
    msgContainer.append(messageElement)
}

 let names = []
let name = prompt("Enter your name to join")
if(name === null){
    name = 'Anonymous'
}
socket.emit('new-user-joined', name)
names.push(name)

sendBtn.addEventListener('click', (e)=>{
    console.log('clicked')
    e.preventDefault()
    const message = msgInp.value
    append(`You: ${message}`, 'right')
    socket.emit('send', message)
    msgInp.value = ''
})

socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'left')
    console.log(name)
    document.querySelector('.currUser').innerHTML = users
    users.push(name)
    console.log(users)
})

socket.on('receive', data =>{
    play.play()
    append(`${data.name}: ${data.message}`, 'left')
})

socket.on('send', data=>{
    append(`${name}: ${data.message}`, 'right')
})

