/**
 * Created by olegsuv on 18.11.2018.
 */
class ListUpdater extends Utils {
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
        this.workingUrl = '';
    }

    init() {
        this.reset();
        this.startLoads();
        this.listenBackground();
    }

    startLoads() {
        this.workingUrl = location.href;
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
            console.log(`Loading finished: 
                working URL: ${this.workingUrl},
                fetch loads ${this.fetchLoads},
                localStorage loads ${this.localStorageLoads}`);
            this.reset()
        }
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error('fetchUrl handleErrors: ' + response.statusText);
        }
        return response;
    }

    handleSuccess(response, element, url) {
        this.onFetchSuccess(...arguments);
        this.checkLoads()
    }

    fetchUrl(url, element) {
        fetch(url)
            .then(this.handleErrors)
            .then((response) => this.handleSuccess(response, element, url))
            .catch(error => console.log('fetchUrl error', error))
    }

    readLocalStorage(element, url) {
        this.onReadLocalStorage(element, url);
        this.checkLoads()
    }

    listenBackground() {
        chrome.runtime.onMessage.addListener((msg) => {
            if (msg === 'url-update' && this.workingUrl !== location.href) {
                console.log('listenBackground start new load: ', location.href);
                this.reset();
                this.startLoads();
            }
        });
    }
}