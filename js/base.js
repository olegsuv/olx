/**
 * Created by olegsuv on 18.11.2018.
 */
class ListUpdater extends Utils {
    log(...args) {
        this.config.logs && console.log('OLX Property Viewer Log', ...args)
    }

    error(...args) {
        this.config.logs && console.error('OLX Property Viewer Error', ...args)
    }

    //Override inside page class
    onFetchSuccess() {
    }

    //Override inside page class
    onReadLocalStorage() {
    }

    reset() {
        this.fetchLoads = 0;
        this.localStorageLoads = 0;
        this.modified = 0;
    }

    init() {
        this.config = {};
        this.reset();
        this.listenBackground();
    }

    startLoads() {
        this.offers = $('.listHandler .wrap .offer:not(".listUpdated")');
        this.offers.each((index, element) => {
            let href = $(element).find('.link.detailsLink').attr('href');
            let url = href && href.split('#')[0];
            if (this.isLocalStorageDataValid(url)) {
                this.localStorageLoads++;
                this.readLocalStorage(element, url);
            } else {
                this.fetchLoads++;
                this.fetchUrl(url, element);
            }
        });
    }

    checkLoads() {
        this.modified++;
        if (this.offers.length === this.modified) {
            this.log(`Loading finished: 
                working URL: ${this.config.url},
                total loads: ${this.offers.length},
                fetch loads ${this.fetchLoads} (${parseInt(this.fetchLoads / this.offers.length * 100, 10)}%),
                localStorage loads ${this.localStorageLoads} (${parseInt(this.localStorageLoads / this.offers.length * 100, 10)}%)`);
            this.reset()
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            this.error('fetchUrl handleErrors', response.statusText);
        }
        return response;
    }

    handleSuccess(response) {
        this.checkLoads();
        return response.text();
    }

    fetchUrl(url, element) {
        fetch(url)
            .then(this.handleErrors)
            .then((response) => this.handleSuccess(response, element, url))
            .then((html) => this.onFetchSuccess(html, element, url))
            .catch(error => this.error('fetchUrl error', error))
    }

    readLocalStorage(element, url) {
        this.onReadLocalStorage(element, url);
        this.checkLoads();
    }

    listenBackground() {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.hasOwnProperty('logs')) {
                this.config.logs = message.logs;
            }
            if (this.config.url !== message.url) {
                this.log('Start new load:', message.url);
                this.reset();
                this.config.url = message.url;
                this.startLoads();
            }
        });
    }
}