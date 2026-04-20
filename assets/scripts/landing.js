window.onload = function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.querySelector('.workspace').scrollTop = 0;
};

function accessContent(){
    document.querySelector('.right-component').style.display = "none";
    document.querySelector('.accessLogin').style.display = "none";
    document.querySelector('.accessContent').style.display = "block";
}

function accessLogin(){
    document.querySelector('.right-component').style.display = "none";
    document.querySelector('.accessContent').style.display = "none";
    document.querySelector('.accessLogin').style.display = "block";

    document.getElementById('usertype').value = window.user_type || 'student';
}

// accessLogin();

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
    console.log("flage");
    const email = document.getElementById("useremail").value.trim();
    const password = document.getElementById("userpassword").value.trim();
    const userType = document.getElementById("usertype").value;
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
