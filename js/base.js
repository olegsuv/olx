/**
 * Created by olegsuv on 18.11.2018.
 */
class ListUpdater extends Utils {
    onAjaxGetSuccess() {}
    onReadLocalStorage() {}

    reset() {
        this.ajaxLoads = 0;
        this.localStorageLoads = 0;
        this.modified = 0;
    }

    init() {
        this.startLoads();
        this.listenBackground();
    }

    startLoads() {
        this.reset();
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
        this.onReadLocalStorage(element, url);
        this.checkLoads()
    }

    ajaxGetSuccess(response, element, url) {
        this.onAjaxGetSuccess(...arguments);
        this.checkLoads()
    }

    static ajaxGetFail(response) {
        console.log('fail', response);
    }
}