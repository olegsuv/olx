/**
 * Created by olegsuv on 17.11.2018.
 */
import {getTDValueByLabel} from './common'

class Land extends ListUpdater {
    getSize(response) {
        getTDValueByLabel(response, 'соток', true)
    }

    getTextForLink(size) {
        return `${size} соток`;
    }

    getForEachText(size, currentPrice, currentCurrency) {
        const currentPricePerSize = parseInt(currentPrice / size).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `<span>за сотку</span> ${currentPricePerSize} ${currentCurrency}`;
    }

    getForAllText(size, currentPrice, currentCurrency) {
        const currentPriceForAll = parseInt(currentPrice * size).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `<span>за все</span> ${currentPriceForAll} ${currentCurrency}`;
    }
}

const landMask = 'https://www.olx.ua/nedvizhimost/zemlya/';
if (location.href.indexOf(landMask) !== -1) {
    const land = new Land();
    land.init();
}

