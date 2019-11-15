/**
 * Created by olegsuv on 17.11.2018.
 */

class Land extends ListUpdater {
    onAjaxGetSuccess(response, element, url) {
        const size = this.getTDValueByLabel(response, 'Площадь участка') || 1;
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
    }

    onReadLocalStorage(element, url) {
        const {size, description, cadastralNumber} = JSON.parse(localStorage.getItem(url));
        this.insertChanges(element, size, description, cadastralNumber);
    }

    insertChanges(element, size, description, cadastralNumber) {
        this.insertPricePerSizeNode(element, size, 'за сотку');
        this.insertPriceForAllNode(element, size, 'за все');
        this.insertSizeNode(element, size, description, 'соток');
        cadastralNumber && this.insertCadastralNumberNode(element, this.getProcessedCadastralNumberNode(element, cadastralNumber));
    }

    getCadastralNumber(response) {
        return this.getTDValueByLabel(response, 'Кадастровый номер', false) || null
    }

    getCadastralNode(cadastralNumber) {
        const link = 'https://newmap.land.gov.ua/?cadnum=' + escape(cadastralNumber);
        return $(`<br /><a href="${link}" target="_blank"><span class="list-updater-label list-updater-label-cadastralNumber">${cadastralNumber}</span></a>`);
    }

    getProcessedCadastralNumberNode(element, cadastralNumber) {
        const cadastralRegexp = new RegExp(/\d{10}:\d{2}:\d{3}:\d{4}/g);
        const cadastralFailedRegexp = new RegExp(/\d{19}/g);
        if (!cadastralRegexp.test(cadastralNumber)) {
            if (cadastralFailedRegexp.test(cadastralNumber)) {
                cadastralNumber = cadastralNumber.substr(0, 10) + ':' +
                    cadastralNumber.substr(10, 2) + ':' +
                    cadastralNumber.substr(12, 3) + ':' +
                    cadastralNumber.substr(15, 4)
            } else {
                cadastralNumber = null
            }
        }
        return this.getCadastralNode(cadastralNumber);
    }
}

const landMask = 'https://www.olx.ua/nedvizhimost/zemlya/';
if (location.href.indexOf(landMask) !== -1) {
    const land = new Land();
    land.init();
}

