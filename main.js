function main() {
    event.preventDefault();
    const input = document.getElementById('urls').value;
    if (input === '') {
        return alert('Alert: Link not found.');
    }
    const textArea = input.split('\n');
    if (textArea[textArea.length - 1] === "") {
        textArea.splice(textArea.length - 1);
    }
    document.querySelector('.result').innerHTML = `Found: ${textArea.length} links. Please wait...`;

    const urlData = new Pdf(textArea);

    urlData.checkUrls();
    document.getElementById('urls').value = '';

}

document.getElementById('button1').addEventListener('click', main);