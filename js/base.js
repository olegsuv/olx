/**
 * Created by olegsuv on 18.11.2018.
 */
class ListUpdater extends Utils {
    getCadastralNumber() {
        return null;
    }

    processCadastralNumber() {
    }

    getSize() {
    }

    getTextForLink() {
    }

    getForEachText() {
    }

    getForAllText() {
    }

    constructor() {
        super();
        this.ajaxLoads = 0;
        this.localStorageLoads = 0;
        this.modified = 0;
    }

    init() {
        this.startLoads();
        this.listenBackground();
    }

    startLoads() {
        this.isWorking = true;
        this.offers = $('.listHandler .offer:not(".listUpdated")');
        this.offers.addClass('listUpdated');
        this.offers.each((index, element) => {
            let href = $(element).find('.link.detailsLink').attr('href');
            let url = href && href.split('#')[0];
            if (this.isLocalStorageDataValid(url)) {
                this.localStorageLoads++;
                this.readLocalStorage(element, url);
            } else {
                this.ajaxLoads++;
                $.get(url, (response) => this.ajaxGetSuccess(response, element, url)).fail(this.ajaxGetFail);
            }
        });
    }

    listenBackground() {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg === 'url-update') {
                this.startLoads();
            }
        });
    }

    checkLoads() {
        this.modified++;
        if (this.offers.length === this.modified) {
            console.log(`localStorageLoads: ${this.localStorageLoads}, ajaxLoads: ${this.ajaxLoads}`);
            this.isWorking = false;
            this.modified = 0;
        }
    }

    readLocalStorage(element, url) {
        const {size, description, cadastralNumber} = JSON.parse(localStorage.getItem(url));
        this.modifyDOM(element, size, description, cadastralNumber);
    }

    ajaxGetSuccess(response, element, url) {
        const size = this.getSize(response);
        const description = $(response).find('#textContent').text().trim();
        const cadastralNumber = this.getCadastralNumber(response);
        let storageItem = {
            size,
            description,
        };
        if (cadastralNumber) {
            storageItem.cadastralNumber = cadastralNumber
        }
        localStorage.setItem(url, JSON.stringify(storageItem));
        this.modifyDOM(element, size, description, cadastralNumber);
    }

    modifyDOM(element, size, description, cadastralNumber) {
        this.processLink(element, size, description);
        this.processPrice(element, size);
        cadastralNumber && this.processCadastralNumber(element, cadastralNumber);
        this.checkLoads();
    }

    static ajaxGetFail(response) {
        console.log('fail', response);
    }

    getNode(text, className) {
        return $(`<br /><span class="list-updater-label list-updater-label-${className}">${text}</span>`);
    }

    getCurrentPrice(element) {
        const priceSelector = '.price strong';
        const priceArray = $(element).find(priceSelector).text().match(/\d/ig);
        return priceArray && parseInt(priceArray.join(''), 10);
    }

    processLink(element, size, description) {
        const linkSelector = '.link.detailsLink';
        const text = this.getTextForLink(size);
        const node = this.getNode(text, 'size');
        $(element).find(linkSelector).attr('title', description).append(node);
    }

    processPrice(element, size) {
        const currentPrice = this.getCurrentPrice(element);
        if (currentPrice) {
            const currentCurrency = $('.currencySelector .selected').text();
            const forEachText = this.getForEachText(size, currentPrice, currentCurrency);
            const forEachNode = this.getNode(forEachText, 'price-per-size');
            const forAllText = this.getForAllText(size, currentPrice, currentCurrency);
            const forAllNode = this.getNode(forAllText, 'price-for-all');
            forEachNode && $(element).find('.price').append(forEachNode);
            forAllNode && $(element).find('.price').append(forAllNode);
        }
    }
}