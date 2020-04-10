/**
 * Created by olegsuv on 19.11.2018.
 */
class Commercial extends ListUpdater {
    onFetchSuccess(response, element, url) {
        const size = this.getTDValueByLabel(response, 'Общая площадь') || 1;
        const description = $(response).find('#textContent').text().trim();
        let storageItem = {
            size,
            description,
        };
        localStorage.setItem(url, JSON.stringify(storageItem));
        this.insertChanges(element, size, description);
    }

    onReadLocalStorage(element, url) {
        const {size, description} = JSON.parse(localStorage.getItem(url));
        this.insertChanges(element, size, description);
        $(element).addClass('listUpdated');
    }

    insertChanges(element, size, description) {
        this.insertPricePerSizeNode(element, size, 'за м²');
        this.insertSizeNode(element, size, description, 'м²');
        $(element).addClass('listUpdated');
    }
}

const flatMask = '/nedvizhimost/kvartiry-komnaty/';
const houseMask = '/nedvizhimost/doma/prodazha-domov/';
if (location.href.search(flatMask) !== -1 || location.href.search(houseMask) !== -1) {
    const flat = new Commercial();
    flat.init();
}
