document.getElementById('login').style.display ='none'

document.getElementById("day").addEventListener('click', function(){
    document.getElementById("app").classList.toggle('morning')
    document.getElementById("app").classList.remove('night')
})
document.getElementById("night").addEventListener('click', function(){
    document.getElementById("app").classList.toggle('night')
    document.getElementById("app").classList.remove('morning')
})

function openLoginPage() {
    document.getElementById('login').style.display ='block'
    document.getElementById('register').style.display ='none'
}

function openRegPage(){
    
    document.getElementById('login').style.display ='none'
    document.getElementById('register').style.display ='block'
}

function setUpProfilePage(){
    document.getElementById('completeProfile').style.display = 'none'
    document.getElementById('userEmailComplete').innerHTML = 'Almost There'
    document.getElementById('profilePage').style.display = 'none'
    document.getElementById('completeProfile').style.display = 'block'
}

function removeToast() {
    document.getElementById('toast').classList.remove('active')
}