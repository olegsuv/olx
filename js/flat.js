/**
 * Created by olegsuv on 19.11.2018.
 */
class Flat extends ListUpdater {
    onAjaxGetSuccess(response, element, url) {
        const size = this.getTDValueByLabel(response, 'Общая площадь') || 1;
        const description = $(response).find('#textContent').text().trim();
        let storageItem = {
            size,
            description,
        };
        localStorage.setItem(url, JSON.stringify(storageItem));
    }

    onReadLocalStorage(element, url) {
        const {size, description} = JSON.parse(localStorage.getItem(url));
        this.insertChanges(element, size, description);
    }

    insertChanges(element, size, description) {
        this.insertPricePerSizeNode(element, size, 'за м²');
        this.insertSizeNode(element, size, description, 'м²');
    }
}

const flatMask = 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/';
if (location.href.indexOf(flatMask) !== -1) {
    const flat = new Flat();
    flat.init();
}
