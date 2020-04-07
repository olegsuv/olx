/**
 * Created by olegsuv on 18.11.2018.
 */
class ListUpdater extends Utils {
    onAjaxGetSuccess() {
    }

    onReadLocalStorage() {
    }

    reset() {
        this.ajaxLoads = 0;
        this.localStorageLoads = 0;
        this.modified = 0;
        this.isWorking = false;
        this.workingUrl = '';
    }

    init() {
        this.reset();
        this.startLoads();
        this.listenBackground();
    }

    startLoads() {
        this.isWorking = true;
        this.workingUrl = location.href;
        this.offers = $('.listHandler .offer:not(".listUpdated")');
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
            if (msg === 'url-update' && this.workingUrl !== location.href) {
                console.log('listenBackground start new load: ', location.href);
                this.reset();
                this.startLoads();
            }
        });
    }

    checkLoads() {
        this.modified++;
        this.offers.length === this.modified && this.reset()
    }

    readLocalStorage(element, url) {
        this.onReadLocalStorage(element, url);
        this.checkLoads()
    }

    ajaxGetSuccess(response, element, url) {
        this.onAjaxGetSuccess(...arguments);
        this.checkLoads()
    }

    ajaxGetFail(response) {
        console.log('fail', response);
    }
}