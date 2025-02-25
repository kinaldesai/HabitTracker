if (window.PublicKeyCredential) {
    console.log("WebAuthn is supported.");  //authentication is supported
} else {
    alert("WebAuthn is not supported by your browser."); //authentication is not supported
}
async function authenticateUsers() {
    try {
        const response = await fetch('/api/get-authentication-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        const publicKeyCredentialRequestOption = {
            challenge: new Uint8Array(data.challenge),  
            rpId: "your-app.com", 
            allowCredentials: [
                {
                    id: new Uint8Array(data.credentialId),  
                    type: "public-key"
                }
            ],
            timeout: 50000,  
            userVerification: "preferred"  
        };

        
        const assertion = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOption
        });

        console.log('Authentication successful', assertion); //authentication is successful

        // Send the assertion back to the server to do the verification
        const verifyResponses = await fetch('/api/verify-authentication', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                assertion: assertion,
                challenge: data.challenge
            })
        });

        const verifyResults = await verifyResponses.json();

        if (verifyResults.success) {
            alert('Authentication successful!');
        } else {
            alert('Authentication failed.');
        }

    } catch (error) {
        console.error('Authentication failed', error);
        alert('Authentication failed.');
    }
}
