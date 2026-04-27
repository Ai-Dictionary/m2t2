class SIGNUP{
    constructor(type){
        this.account_type = type;
    }
    async make_request(formData){
        try{
            if(this.account_type=='student' || this.account_type=='teacher' || this.account_type=='admin'){
                const response = await fetch('/create_account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ info:{"type": this.account_type, "details": formData} })
                });

                const result = await response.json();

                if(response.ok){
                    if(result.id){
                        console.log('Account created successfully. Your ID:', result.id);
                        route('/accountCreated?encode='+encodeURIComponent(system.encoder(`name=${formData.name.replaceAll(' ','%20')}&email=${formData.email}&id=${result.id}`,'1441')));
                    }else if(result.message){
                        console.warn('Server responded with a message:', result.message);
                        document.getElementById("waitpopup").style.display = "none";
                        system.alert({'error': 400, 'message': result.message.message, 'mute': true});
                    }else{
                        console.warn('Unexpected response format:', result);
                        document.getElementById("waitpopup").style.display = "none";
                        system.alert({'error': 500, 'message': 'We encountered an unexpected issue while processing your signup request. This may be due to a temporary server error or an incomplete response. Please wait a few moments and try again. If your user ID does not appear within 60 seconds, refresh the page and resubmit the form. Your data has not been saved yet.', 'mute': true});
                    }
                }else{
                    console.error('Server returned an error status:', response.status, response?.message);
                    document.getElementById("waitpopup").style.display = "none";
                    system.alert({'error': 500, 'message':"Our servers are currently experiencing an issue and couldn't complete your signup request. This may be due to high traffic or a temporary outage. Please wait a moment and try again. If the problem continues, your account has not been created—refresh the page and resubmit the form.", 'mute': true});
                }
            }
        }catch{
            console.error('Failed to creat account:', err);
            system.alert({'error': 500, 'message': 'Oops! Something went wrong. Due to an internal issue, we couldn\'t creat your account using this data. Please double-check your field information and try again sometime later.', 'mute': true});
            return null;
        }
    }
}

async function make_request_to_signup(formData){
    try{
        document.getElementById("waitpopup").style.display = "block";
        let signup = new SIGNUP(formData.accountType);
        await signup.make_request(formData);
    }catch(e){
        console.log("faild to make request for this account creation");
    }
}

let params = new URL(window.location.href);
let searchParams = new URLSearchParams(params.search);

if(searchParams.has('type')){
    let typeValue = searchParams.get('type');
    (async () => {
        // await accountType(typeValue);
    })();
}