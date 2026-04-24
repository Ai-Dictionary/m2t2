window.onload = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.querySelector('.workspace').scrollTop = 0;
};

function accessContent(){
    document.querySelector('.right-component').style.display = "none";
    document.querySelector('.accessLogin').style.display = "none";
    document.querySelector('.accessSignup').style.display = "none";
    document.querySelector('.accessContent').style.display = "block";
}

function accessLogin(){
    document.querySelector('.right-component').style.display = "none";
    document.querySelector('.accessContent').style.display = "none";
    document.querySelector('.accessSignup').style.display = "none";
    document.querySelector('.accessLogin').style.display = "block";

    document.getElementById('l-usertype').value = window.user_type || 'student';
}

function accessSignup(){
    document.querySelector('.right-component').style.display = "none";
    document.querySelector('.accessContent').style.display = "none";
    document.querySelector('.accessLogin').style.display = "none";
    document.querySelector('.accessSignup').style.display = "block";
    document.getElementById('s-type').textContent = (window.user_type=='admin'?'student':window.user_type) || 'teacher';
    if(document.getElementById('s-type').textContent == 'student'){
        document.querySelector('.student-signup').style.display = 'block';
        document.querySelector('.teacher-signup').style.display = 'none';
    }else{
        document.querySelector('.student-signup').style.display = 'none';
        document.querySelector('.teacher-signup').style.display = 'block';
    }
}

function toggleUser(){
    if(window.user_type=='student'){
        window.user_type = 'teacher';
    }else{
        window.user_type = 'student';
    }
    accessSignup();
}

// accessLogin();
accessSignup();

document.addEventListener("DOMContentLoaded", function () {
    const userTypes = document.querySelectorAll(".usertype");
    const utypeSpan = document.querySelector(".btn .utype");

    userTypes.forEach(type => {
        type.addEventListener("click", function () {
            userTypes.forEach(t => t.classList.remove("choosentype"));

            this.classList.add("choosentype");

            const name = this.querySelector(".username .name").textContent;

            utypeSpan.textContent = " as "+name;

            window.user_type = name.toLowerCase();
        });
    });
});


function login(){
    const email = document.getElementById("l-useremail").value.trim();
    const password = document.getElementById("l-userpassword").value.trim();
    const userType = document.getElementById("l-usertype").value;
    const errorDiv = document.querySelector(".accessLogin .error");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex = /^\d{10}$/;

    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-@#!&%$*?])[A-Za-z\d\-@#!&%$*?]{8,}$/;

    errorDiv.textContent = "";
    errorDiv.style.display = "block";

    if (!emailRegex.test(email)) {
        errorDiv.textContent = "Invalid email format. Please provide register email id.";
        return;
    }

    if (!(phoneRegex.test(password) || strongPasswordRegex.test(password))) {
        errorDiv.textContent = "Password must be either a 10-digit phone number or a strong password.";
        return;
    }

    const validTypes = ["student", "teacher", "admin"];
    if (!validTypes.includes(userType)) {
        errorDiv.textContent = "Invalid user type selected.";
        return;
    }

    errorDiv.innerHTML = "<span style='color: green;'>Waiting for server response!</span>";
    fetch('/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
            type: userType.trim()
        })
    }).then(response => response.json()).then(data => {
        if(data?.success){
            password.value = "";
            window.location.href = '/main';
        }else{
            system.alert(data);
            // window.location.href = '/login';
        }
    }).catch(error => {
        console.error('Error:', error);
    });
}

function signup(){
    const userType = document.getElementById('s-type').textContent || 'student';

    let allValid = true;
    let isValid = true;
    const formData = {};
    let not_consider = userType=='student'?'t-d':'s-d';

    const form_section = document.querySelectorAll(".form-box");
    form_section.forEach((section, index) => {
        const fields = section.querySelectorAll("input, select, textarea");
        fields.forEach(field => {
            if(!field.classList.value.includes(not_consider)){
                const pass = validateField(field);
                if (!pass) {
                    console.warn(`Invalid field: #${field.id} (${field.type}) - value entered: "${field.value.trim()}"`);
                    isValid = false;
                }else{
                    const id = field.id;
                    const value = id=='subject'?Array.from(document.getElementById(id).selectedOptions).map(opt => opt.value):field.value.trim();
                    if(id){
                        formData[id] = value;
                    }
                }

                if(!isValid){
                    document.querySelector('.signup-form').querySelector(".title").innerHTML = "<span>Please ensure that all fields are completed accurately before proceeding</span>";
                    console.warn("Please ensure that all fields are completed accurately before proceeding.");
                    if(allValid){
                        system.alert({'error': 400, 'message': 'Before proceeding, please ensure that all required fields have been filled out accurately. Some entries appear to be missing or incorrectly formatted. Kindly review the form and make the necessary corrections to continue.', 'mute': true});
                    }
                    allValid = false;
                }
            }
        });
    });
    console.log(formData);

    if(allValid){
        (async()=>{
            delete formData.iagree;
            delete formData.confirmPassword;
            formData.accountType = userType;
            formData.status = "active";
            formData.dob = "15-08-1947";
            await make_request_to_signup(formData);
        })();
    }else{
        // system.alert({'error': 400, 'message': 'Before proceeding, please ensure that all required fields have been filled out accurately. Some entries appear to be missing or incorrectly formatted. Kindly review the form and make the necessary corrections to continue.', 'mute': true});
    }
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type || field.tagName.toLowerCase();
    const id = field.id;

    const regex = {
        name: /^(?=.{7,50}$)([a-zA-Z]{3,}\s+){1,2}[a-zA-Z]{3,}$/,
        email: /^[\w.-]+@[\w.-]+\.\w{2,}$/,
        url: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
        textarea: /^(.{20,400})$/,
        text: /^[A-Za-z0-9\s\-+,#@$&.:;!?]{5,250}$/,
        dob: /^\d{4}-\d{2}-\d{2}$/,
        contact: /^[6-9]\d{9}$/,
        address: /^[A-Za-z0-9\s\-+,#@$&.:;!?]{10,250}$/,
        pin: /^\d{6}$/,
        gpa: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/,
        percentage: /^(100(\.0{1,2})?|[0-9]{1,2}(\.\d{1,2})?)$/,
        subjectList: /^[A-Za-z\s]+(,\s*[A-Za-z\s]+)*$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^+=])[A-Za-z\d@$!%*#?&^+=]{8,}$/,
    };

    let pass = false;

    if (id === "name" || type === "name"){
        pass = regex.name.test(value);
    }else if (id === "dob"){
        if (regex.dob.test(value)){
            const birthYear = new Date(value).getFullYear();
            const age = new Date().getFullYear() - birthYear;
            pass = age >= 8 && age <= 60;
        }
    }else if (id === "contact" || type==="tel"){
        pass = regex.contact.test(value);
    }else if (type === "email"){
        pass = regex.email.test(value);
    }else if (id === "address"){
        pass = regex.address.test(value);
    }else if (type === "text"){
        pass = regex.text.test(value);
    }else if (id === "pin" || id === "t-pin" || id === "s-pin"){
        pass = regex.pin.test(value);
    }else if (id === "results"){
        pass = regex.gpa.test(value) || regex.percentage.test(value);
    }else if (id === "fav_subjects" || id === "diff_subjects"){
        pass = regex.subjectList.test(value);
    }else if (id === "pass"){
        pass = regex.password.test(value);
    }else if (id === "confirmPassword"){
        const password = document.getElementById("pass")?.value.trim();
            pass = value === password && regex.password.test(value);
    }else if (type === "select-one" || type === "date"){
        pass = value !== "";
    }else{
        pass = value.length > 0;
    }

    field.classList.toggle("is-valid", pass);
    field.classList.toggle("is-invalid", !pass);
    return pass;
}

document.querySelector(".form-box").querySelectorAll("input, select, textarea").forEach(field => {
    field.addEventListener("input", () => {
        validateField(field);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const target = document.querySelector(".right-component.accessIntro");

    const styleTag = document.createElement("style");
    styleTag.id = "conditional-css";
    document.head.appendChild(styleTag);

    function applyConditionalCSS() {
        if (getComputedStyle(target).display === "block") {
        styleTag.textContent = `
            @media only screen and (max-width: 900px), only screen and (min-width: 900px) and (max-width: 1200px) {
                .subpage:nth-child(1){
                    display: flex;
                    flex-direction: column;
                }
                .subpage:nth-child(1) .left-component{
                    display: block;
                    border-radius: 0px;
                    width: 100%;
                }
                .subpage:nth-child(1) .right-component.accessIntro{
                    border-top-left-radius: 20px;
                    border-top-right-radius: 20px;
                    margin-top: -20px;
                }
            }
            @media only screen and (min-width: 768px) and (max-width: 1024px) {
                .subpage:nth-child(1) {
                    flex-direction: row;
                    .left-component{
                        width: 40%;   
                    }
                    .right-component.accessIntro{
                        margin-top: 0px;
                        padding-top: 20%;
                    }
                }
            }
            @media only screen and (min-width: 481px) and (max-width: 767px) {
                .subpage:nth-child(1) {
                    .right-component.accessIntro{
                        margin-top: -60px;
                    }
                }
            }
        `;
        } else {
            styleTag.textContent = "";
        }
    }

    applyConditionalCSS();

    const observer = new MutationObserver(applyConditionalCSS);
    observer.observe(target, { attributes: true, attributeFilter: ["style"] });
});
