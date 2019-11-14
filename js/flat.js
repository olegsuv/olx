/**
 * Created by olegsuv on 19.11.2018.
 */
class Flat extends ListUpdater {
    getSize(response) {
        return this.getTDValueByLabel(response, 'Общая площадь');
    }

    getTextForLink(size) {
        return `${size} м²`;
    }

    getForEachText(size, currentPrice, currentCurrency) {
        return this.getPriceForUnit(size, currentPrice, currentCurrency, 'за м²');
    }

    getForAllText(size, currentPrice, currentCurrency) {
        return this.getPriceForAll(size, currentPrice, currentCurrency, 'за все');
    }
}

const flatMask = 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/';
if (location.href.indexOf(flatMask) !== -1) {
    const flat = new Flat();
    flat.init();
}
