function sendEmail() {
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var content = document.getElementById("message").value.trim();
    
    if (!name || !email || !content) {
        alert("Please fill in all fields before sending the email.");
        return;
    }
    
    var emailAddress = "adelinhojda297@gmail.com";
    var subject = "Email from " + name + " (" + email + ")";
    var mailtoLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(emailAddress) + 
                     "&su=" + encodeURIComponent(subject) + 
                     "&body=" + encodeURIComponent(content);

    window.open(mailtoLink, "_blank");
}
