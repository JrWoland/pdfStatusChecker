class Pdf {
    constructor(arr) {
        this.urls = arr;
        this.data = [];
        this.i = 1;
        this.regularExp = /([A-Z]{2})([A-Z0-9]{9})([0-9]{1})/;
    }
    renderSecondButton() {
        document.querySelector('.result').innerHTML = `<div>Done.</div>`;

        this.anotherCheck = this.data.filter(item => item.status !== 200);

        if (this.anotherCheck.length >= 1) {
            const secondButton = `<button id="button2">Check Again ${this.anotherCheck.length} pdfs.</button>`;

            document.querySelector('.result').innerHTML += secondButton;

            document.getElementById('button2').addEventListener('click', this.checkUrlsAgain.bind(this));
        }
    }
    renderRow(id, url, statusText, status, isin = "Could not fetch") {
        const row = `<tr>
                     <td>${id}</td>
                    <td><a href="${url}" target="blank">PDF</a></td>
                    <td>${statusText}</td>
                    <td>${status}</td>
                    <td>${isin}</td>
                    </tr>`;
        return row;
    }
    checkUrls(link = 0, id = 0) {
        const prefix = "https://cors-anywhere.herokuapp.com/";

        if (link) {
            let xhr = new XMLHttpRequest();

            //OPEN - (type, url/file,async)

            xhr.open('GET', prefix + link, true);

            xhr.onload = () => {
                const row = this.renderRow(id + '*', link, xhr.statusText, xhr.status);
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
                let string = '';
                if (xhr.status === 200) {
                    let docPdf = null,
                        pageNum = 1;
                    //open the page,
                    const openPdf = (num) => {
                        docPdf.getPage(num).then(page => {
                            page.getTextContent().then((text) => {
                                text.items.forEach(element => string += element.str);
                                const isinCode = string.match(this.regularExp)[0];
                                this.insertData(this.i++, url, xhr.statusText, xhr.status, isinCode)
                            })
                        });
                    };
                    //get document
                    pdfjsLib.getDocument(prefix + url).promise.then(pdfDoc_ => {
                        docPdf = pdfDoc_;
                        openPdf(pageNum);
                    })
                } else if (xhr.status !== 200) {
                    this.insertData(this.i++, url, xhr.statusText, xhr.status, "Unknown")
                }
            }
            xhr.send()
        });
    }
    insertData(id, url, statusText, status, isin) {
        const checkUrl = {
            id: id,
            link: url,
            status: status,
            isin: isin,
        }
        console.log(checkUrl);
        this.data.push(checkUrl);
        const row = this.renderRow(checkUrl.id, url, statusText, status, isin);
        document.querySelector('.pdfs').innerHTML += row;
        if (this.data.length === this.urls.length) {
            this.renderSecondButton();
        }
    }
    checkUrlsAgain() {
        this.anotherCheck.forEach(item => {
            this.checkUrls(item.link, item.id)
        })
    }
}