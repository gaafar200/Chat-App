const signinbtn = document.querySelector('#signinbtn');
const signupbtn = document.querySelector('#signupbtn');
const title = document.querySelector('#title');
const namefield = document.querySelector('#name-field');
const confirmed_password = document.querySelector('#confirmed_password_field');

//input fields
const Name = document.querySelector('input[name="name"]');
const Username = document.querySelector('input[name="username"]');
const Password = document.querySelector('input[name="password"]');
const ConfirmedPassword = document.querySelector('input[name="confirmed_password"]');
//validate name and display error accordingly
Name.addEventListener("change",(e)=>{
    const check = validateName(e.target.value);
    handleErrorInInputField(e.target,check);
});

//validate username and print error accordingly
Username.addEventListener('input',(e)=>{
    const debounceTimer = setTimeout(async ()=>{
        let check = validateUsername(e.target.value)
        if(check === true){
            if(!signupbtn.classList.contains("disable")){
                check = await checkUsernameUnique(e.target.value);
            }
            handleErrorInInputField(e.target,check);
        }
        else{
            handleErrorInInputField(e.target,check);
        }   
    },400);
});

//validate password and display Errors accordingly
Password.addEventListener("input",(e)=>{
    const debounceTimer = setTimeout(()=>{
        const check  = checkPasswordStrength(e.target.value);
        handleErrorInInputField(e.target,check);
        console.log(ConfirmedPassword.value);
        if(ConfirmedPassword.value != ""){
            validateConfirmedPasswordAndDisplayError(ConfirmedPassword);
        }
    },400);
});


//validate password confirmation and display error accordingly
ConfirmedPassword.addEventListener("input",(e)=>{
   validateConfirmedPasswordAndDisplayError(e.target)
});
const validateConfirmedPasswordAndDisplayError = (target)=>{
     const debounceTimer = setTimeout(()=>{
        const check = validatePasswordConfirmation(target.value,Password.value);
        handleErrorInInputField(target,check);
    },400);
}
function checkPasswordStrength(password){
    if(password.length < 6){
        return "password is too weak";
    }
    return true;
}

function validatePasswordConfirmation(password1,password2){
    if(password1 != password2){
        return "passwords don't match";
    }
    return true;
}

async function checkUsernameUnique(username){
    const url = "http://localhost:3000/user/checkusername";
    let data = {
        "username" : username
    };  
    try{
        const result = await fetch(url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        data = await result.json();
        if(!data.isunique){
            return "username is not unique";
        }
        return true;
    }  
    catch(error){
        console.log(error);
    }
}
function validateUsername(username){
    if(username.length < 3){
        return "username must be at least 3 characters";
    }
    regex = /^[a-zA-Z0-9]+$/;
    if(!regex.test(username)){
        return "username must consist of characters and numbers only";
    }
    return true;
}

signupbtn.addEventListener("click",(e)=>{
    if(e.target.classList.contains("disable")){
        title.innerText = "Sign Up";
        e.target.classList.remove("disable");
        signinbtn.classList.add("disable");
        namefield.classList.toggle("hidden");
        confirmed_password.classList.toggle("hidden");
    }
    else{
        SignUp().then().catch(e=>{console.log(e)});
    }
});

signinbtn.addEventListener("click",(e)=>{
    if(e.target.classList.contains("disable")){
        title.innerText = "Sign In";
        e.target.classList.remove("disable");
        signupbtn.classList.add("disable");
        namefield.classList.toggle("hidden");
        confirmed_password.classList.toggle("hidden");
    }
    else{
        Login().then().catch(e=>{console.log(e)});
    }
});

async function SignUp(){
    const name = Name.value;
    const username = Username.value;
    const password = Password.value;
    const confirmedPassword = ConfirmedPassword.value;
    const userFormData = {
        name,
        username,
        password,
        confirmedPassword
    };
    const url = "http://localhost:3000/signup";
    try{
        const result = await fetch(url,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userFormData),
        });
        const data = await result.json();
        console.log(data);
        if(Object.keys(data.errors).length === 0){
            window.location.href = "/index.html";
        }
        else{
            Object.keys(data.errors).forEach((key)=>{
                let value = data.errors[key];
                if(key == "name"){
                    handleErrorInInputField(Name,value);
                }
                else if(key == "username"){
                    handleErrorInInputField(Username,value);
                }
                else if(key == "password"){
                    handleErrorInInputField(Password,value);
                }
                else if(key == "confirmPassword"){
                    handleErrorInInputField(ConfirmedPassword,value);
                }
            })
        }
    }
    catch(error){
        console.log(error);
    }
}

async function Login(){
    const username = Username.value;
    const password = Password.value;
    const url = "http://localhost:3000/login";
    const userFormData = {
        username,
        password
    };
    const result = await fetch(url,
    {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userFormData),
    });
    const data = await result.json();
    console.log(data);
    if(Object.keys(data.errors).length === 0){
        window.location.href = "/index.html";
    }
    else{
        Object.keys(data.errors).forEach((key)=>{
            let value = data.errors[key];
            if(key == "username"){
                handleErrorInInputField(Username,value);
            }
            else if(key == "password"){
                handleErrorInInputField(Password,value);
            }
        });
    }

}

const validateName = (name)=>{
    if(name.length < 3){
        return "name must be greater that three characters";
    }
    const regex = /^[a-zA-Z ]+$/; 
    if(!regex.test(name)){
        return "name must only consist of chacters only";
    }
    return true;
}

const handleErrorInInputField = (element,check)=>{
    const fullField = element.parentNode.parentNode;
    const errorMessage = element.parentNode.nextElementSibling;
    if(check === true){
        fullField.classList.remove("error");
        fullField.classList.add("success");
    }
    else{
        fullField.classList.remove("success");
        fullField.classList.add("error");
        errorMessage.innerHTML = `<small>${check}</small>`;
    }
}