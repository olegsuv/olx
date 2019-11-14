/**
 * Created by olegsuv on 17.11.2018.
 */

class Land extends ListUpdater {
    getCadastralNumber(response) {
        return this.getTDValueByLabel(response, 'Кадастровый номер', false) || null
    }

    getCadastralNode(cadastralNumber) {
        const link = 'https://newmap.land.gov.ua/?cadnum=' + escape(cadastralNumber);
        return $(`<br /><a href="${link}" target="_blank"><span class="list-updater-label list-updater-label-cadastralNumber">${cadastralNumber}</span></a>`);
    }

    processCadastralNumber(element, cadastralNumber) {
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
        const linkSelector = '.link.detailsLink';
        const node = this.getCadastralNode(cadastralNumber);
        cadastralNumber && $(element).find(linkSelector).after(node);
    }

    getSize(response) {
        return this.getTDValueByLabel(response, 'Площадь участка') || 1
    }

    getTextForLink(size) {
        return `${size} соток`;
    }

    getForEachText(size, currentPrice, currentCurrency) {
        return this.getPriceForUnit(size, currentPrice, currentCurrency, 'за сотку');
    }

    getForAllText(size, currentPrice, currentCurrency) {
        return this.getPriceForAll(size, currentPrice, currentCurrency, 'за все');
    }
}

const landMask = 'https://www.olx.ua/nedvizhimost/zemlya/';
if (location.href.indexOf(landMask) !== -1) {
    const land = new Land();
    land.init();
}

