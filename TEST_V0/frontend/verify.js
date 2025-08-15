document.addEventListener('DOMContentLoaded', () => {
    // Get email from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (!email) {
        window.location.href = 'register.html';
    }

    document.getElementById('verifyForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const code = document.getElementById('verificationCode').value;

        try {
            const response = await fetch('http://localhost:3000/api/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email verified successfully! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during verification');
        }
    });

    document.getElementById('resendCode').addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:3000/api/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Verification code resent! Please check your email.');
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while resending the code');
        }
    });
}); 