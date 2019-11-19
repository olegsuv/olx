class Utils {
    getTDValueByLabel(response, label, parse = true) {
        const details = $(response).find('.details');
        const th = details.find('th:contains(' + label + ')');
        const td = th.next();
        const text = td.text().trim();
        return parse ? parseFloat(text) : text;
    }

    getNode(text, className) {
        return `<span class="list-updater-label list-updater-label-${className}">${text}</span>`;
    }

    getCurrentPrice(element) {
        const priceSelector = '.price strong';
        const priceArray = $(element).find(priceSelector).text().match(/\d/ig);
        return priceArray && parseInt(priceArray.join(''), 10);
    }

    insertPricePerSizeNode(element, size, text) {
        const currentPrice = this.getCurrentPrice(element);
        const currentCurrency = $('.currencySelector .selected').text();
        const currentPricePerSize = parseInt(currentPrice / size, 10);
        const currentPricePerSizeText = currentPricePerSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const node = this.getNode(`<br><span>${text}</span> ${currentPricePerSizeText} ${currentCurrency}`, 'price-per-size');
        $(element).find('.price').append(node)
    }

    insertPriceForAllNode(element, size, text) {
        const currentPrice = this.getCurrentPrice(element);
        const currentCurrency = $('.currencySelector .selected').text();
        const currentPriceForAll = parseInt(currentPrice * size, 10);
        const currentPriceForAllText = currentPriceForAll.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const node = this.getNode(`<br><span>${text}</span> ${currentPriceForAllText} ${currentCurrency}`, 'price-for-all');
        $(element).find('.price').append(node)
    }

    insertSizeNode(element, size, description, sizeText) {
        $(element).find('.link.detailsLink')
            .attr('title', description)
            .after(this.getNode(`<br>${size} ${sizeText}`, 'size'));
    }

    isLocalStorageDataValid(url) {
        return localStorage.getItem(url)
            && !!JSON.parse(localStorage.getItem(url)).size
            && !!JSON.parse(localStorage.getItem(url)).description
    }

}