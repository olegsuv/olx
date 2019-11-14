class Utils {
    constructor(){}

    getTDValueByLabel (response, label, parse = true) {
        const details = $(response).find('.details');
        const th = details.find('th:contains(' + label + ')');
        const td = th.next();
        const text = td.text().trim();
        return parse ? parseFloat(text) : text;
    }
    
    getPriceForUnit(size, currentPrice, currentCurrency, text) {
        const currentPricePerUnit = parseInt(currentPrice / size, 10);
        const currentPricePerUnitText = currentPricePerUnit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `<span>${text}</span> ${currentPricePerUnitText} ${currentCurrency}`;
    }

    getPriceForAll(size, currentPrice, currentCurrency, text) {
        const currentPriceForAll = parseInt(currentPrice * size, 10);
        const currentPriceForAllText = currentPriceForAll.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `<span>${text}</span> ${currentPriceForAllText} ${currentCurrency}`;
    }

    isLocalStorageDataValid(url) {
        return localStorage.getItem(url)
            && !!JSON.parse(localStorage.getItem(url)).size
            && !!JSON.parse(localStorage.getItem(url)).description
    }

}