function sendEmail() {
    var name = document.getElementById("userName").value;
    var content = document.getElementById("userContent").value;
    var emailAddress = "adelinhojda07@gmail.com";
    var subject = "Email from " + name;
    var mailtoLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(emailAddress) + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(content);

    window.open(mailtoLink, "_blank");
}