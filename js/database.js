document.getElementById('completeProfile').style.display = 'none'

//get currentState
  firebase.auth().onAuthStateChanged(function(user){
      //loading login if session exists
  
      //check for existing sessions
      if(user){
          document.getElementById("register").style.display = "none"
          document.getElementById("login").style.display = "none"
          document.getElementById('profilePage').style.display = 'block'
          
          var user = firebase.auth().currentUser
          if(user != null){
               useremail = user.email
               userID = user.uid

               //print email
               document.getElementById('userEmailComplete').innerHTML = useremail

               bindData()
          }
      }
      else{
          document.getElementById("register").style.display = "none"
          document.getElementById("login").style.display = "block"
          document.getElementById('profilePage').style.display = 'none'
          document.getElementById('completeProfile').style.display = 'none'
          }
      })

//create users
function createUser(){

    email = document.getElementById('reg_email').value
    password = document.getElementById('reg_password').value

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    if(error){
        toast(errorMessage)
        document.getElementById('completeProfile').style.display = 'none'
    }
    //on success
    else{
        toast('Sign up Successful')
    }
    
  });
}

  function login(){

    email = document.getElementById('login_email').value
    password = document.getElementById('login_pass').value
      //login
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    if(error){
        toast(errorMessage)
    }else{
        toast('Login Success')
        
        document.getElementById("register").style.display = "none"
        document.getElementById("login").style.display = "none"
        document.getElementById('completeProfile').style.display = 'none'
        document.getElementById('profilePage').style.display = 'block'
    }
  });

  }


  function signOut() {
    
  //signout
  firebase.auth().signOut().then(function() {
    // Sign-out successful.

    toast('Signout successs')

    //remove prrofilepage

    document.getElementById('profilePage').style.display = 'none'

  }).catch(function(error) {
    // An error happened.
    errorMessage = error.message

    console.log(errorMessage)
  });

  }
//Update users
function updateProfile() {
  //get user info from input form
  name = document.getElementById('name').value
  phone = document.getElementById('phone').value
  address = document.getElementById('address').value

  //initiate userInfo
    user = firebase.auth().currentUser
    userID = user.uid
    userEmail = user.email

    //create storage refernece
    storage = firebase.storage()
    //upload image into storage
    //get file
    fileData = document.getElementById('uploadFile')

    var file = fileData.files[0]
    //create storage file
    storageref = storage.ref('images/' + file.name)

    task = storageref.put(file)

    task.on('state_changed', uploadProgress, uploadError, uploadComplete)
    
    function uploadProgress(data){
      percent =  (data.bytesTransferred/data.totalBytes)*100
    }
    
    function uploadError(err){
      toasr('Unable to upload file. Please try again')
      console.log(err)
    }
    
    function uploadComplete(data){
      toast('Success')
      console.log(data)
      getURL()
    }
    
    function getURL() {
      storageref.getDownloadURL().then(function(url){
      
        //if succes initiate databae
      //create database reference
      database = firebase.database()
      databaseRef = database.ref('/userProfile/' + userID)
  
      databaseRef.set({
        name : name,
        phone : phone,
        address : address,
        email : userEmail,
        url : url,
      })
      if(url){
        console.log('database is ready')
        setUpProfile()
        //bind image to profile
        document.getElementById('profilePage').style.display = 'block'
      }
      })
    }

}
function verifyEmail() {
     //perform email verification
    var user = firebase.auth().currentUser;

    user.sendEmailVerification().then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });
}
 

function setUpProfile() {
  //hide profile editor
  document.getElementById('completeProfile').style.display = 'none'

}

function bindData(){
  
  ulList = document.getElementById('showUserInfo')

  user = firebase.auth().currentUser.uid
  userEmail = firebase.auth().currentUser.email
  //bind email
  document.getElementById('userEmailProfile').textContent = userEmail
  userURL = firebase.database().ref().child('userProfile/uid')
  
  userURL.on('child_added', snap => console.log(snap.val()))

  dbRef = firebase.database().ref().child('userProfile/')

  imageRefURL = firebase.database().ref().child('userProfile/' + user + '/url')
  
  dbRef.on('value', snap => console.log(snap.val()))

  dbRefList = dbRef.child(userID)

  dbRefList.on('child_added', snap => {
      
      lilList = document.createElement('li')

      lilList.innerText = snap.val()
      lilList.id = snap.key
      ulList.appendChild(lilList)

      //bind imageURl to img tag
      img = document.getElementById('showProfilePic')
      img.src = snap.val()

      console.log(snap.val())
  })

  dbRefList.on('child_changed', snap => {
      const lichanged = document.getElementById(snap.key)
      lichanged.innerText = snap.val()
  })
}
//animate popUp
function toast(message){
  const toast = document.getElementById('toast').classList.toggle('active')
  document.getElementById('toastMessage').textContent = message
  return message
}