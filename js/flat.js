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
        const currentPricePerSize = parseInt(currentPrice / size, 10);
        const currentPricePerSizeText = currentPricePerSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const isLowPrice = currentCurrency === '$' && currentPrice < 10000;
        return isLowPrice ? null : `<span>за м²</span> ${currentPricePerSizeText} ${currentCurrency}`;
    }

    getForAllText(size, currentPrice, currentCurrency) {
        const currentPriceForAll = parseInt(currentPrice * size, 10);
        const currentPriceForAllText = currentPriceForAll.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const isHighPrice = currentCurrency === '$' && currentPrice > 10000;
        return isHighPrice ? null : `<span>за все</span> ${currentPriceForAllText} ${currentCurrency}`;
    }
}

const flatMask = 'https://www.olx.ua/nedvizhimost/kvartiry-komnaty/';
if (location.href.indexOf(flatMask) !== -1) {
    const flat = new Flat();
    flat.init();
}
