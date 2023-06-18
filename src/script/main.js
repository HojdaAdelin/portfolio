function opener(link) {

    window.open(link);

}

function alertshow() {

    alert("This link doesn't work for now.");

}

function projectsalert() {

    alert("Projects page doesn't work for now.")

}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Address copied!")
      })
      .catch((error) => {
        console.error("Failed to copy address: ", error);
      });
  }