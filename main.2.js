class Url {
    constructor(arr) {
        this.urls = arr;
        this.data = [];
        this.i = 1;
        this.anotherCheck = [];
    }
    checkUrls(link = 0, id = 0) {
        const prefix = "https://cors-anywhere.herokuapp.com/";

        if (link) {
            let xhr = new XMLHttpRequest();

            //OPEN - (type, url/file,async)

            xhr.open('GET', prefix + link, true);

            xhr.onload = () => {
                const row = `<tr>
                            <td>${id}*</td>
                            <td><a href="${link}">PDF</a></td>
                            <td>${xhr.statusText}</td>
                            <td>${xhr.status}</td>
                            </tr>`;
                document.querySelector('.pdfs').innerHTML += row;
            }
            xhr.send()
            return;
        }

        this.urls.forEach((url) => {

            let xhr = new XMLHttpRequest();

            //OPEN - (type, url/file,async)

            xhr.open('GET', prefix + url, true);

            xhr.onload = () => {
                const checkUrl = {
                    id: this.i++,
                    status: xhr.status,
                    link: url,
                }
                this.data.push(checkUrl)
                const row = `<tr>
                            <td>${checkUrl.id}</td>
                            <td><a href="${url}">PDF</a></td>
                            <td>${xhr.statusText}</td>
                            <td>${xhr.status}</td>
                            </tr>`;
                document.querySelector('.pdfs').innerHTML += row;
                if (this.data.length === this.urls.length) {
                    document.querySelector('.result').innerHTML = `<div>Done.</div>`;

                    this.anotherCheck = this.data.filter(item => item.status !== 200);

                    if (this.anotherCheck.length >= 1) {
                        const secondButton = `<button id="button2">Check Again ${this.anotherCheck.length} pdfs.</button>`;

                        document.querySelector('.result').innerHTML += secondButton;

                        document.getElementById('button2').addEventListener('click', this.checkUrlsAgain.bind(this));
                    }
                }
            }
            xhr.send()
        });
    }

    checkUrlsAgain() {
        this.anotherCheck.forEach(item => {
            this.checkUrls(item.link, item.id)
        })
    }

}

function main() {
    event.preventDefault();
    const input = document.getElementById('urls').value;
    if (input === '') {
        return alert('Alert: Link not found.');
    }
    const textArea = input.split('\n');
    document.querySelector('.result').innerHTML = `Found: ${textArea.length} links. Please wait...`;

    const urlData = new Url(textArea);

    urlData.checkUrls();
    document.getElementById('urls').value = '';

}

document.getElementById('button1').addEventListener('click', main);