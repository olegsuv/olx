class Utils {
    getValueByLabel(dom, label, parse = true) {
        console.log('getValueByLabel', label, parse, dom);
        const metricsObject = dom.querySelectorAll('ul li p');
        const metricsArray = Array.from(metricsObject);
        const filteredMetrics = metricsArray.filter(metricNode => metricNode.innerText.indexOf(label) !== -1);
        const requiredMetricText = filteredMetrics[0].innerText;
        const regExpDigits = /\d+/;
        const value = regExpDigits.exec(requiredMetricText)[0];
        return parse ? parseFloat(value) : value;
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
        if ($(element).hasClass('listUpdated')) {
            return false
        }
        const currentPrice = this.getCurrentPrice(element);
        const currentCurrency = $('.currencySelector .selected').text();
        const currentPricePerSize = parseInt(currentPrice / size, 10);
        const currentPricePerSizeText = currentPricePerSize.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const node = this.getNode(`<br><span>${text}</span> ${currentPricePerSizeText} ${currentCurrency}`, 'price-per-size');
        $(element).find('.price').append(node)
    }

    insertPriceForAllNode(element, size, text) {
        if ($(element).hasClass('listUpdated')) {
            return false
        }
        const currentPriceLimit = 5000;
        const currentPrice = this.getCurrentPrice(element);
        const currentCurrency = $('.currencySelector .selected').text();
        const currentPriceForAll = parseInt(currentPrice * size, 10);
        const currentPriceForAllText = currentPriceForAll.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        const node = this.getNode(`<br><span>${text}</span> ${currentPriceForAllText} ${currentCurrency}`, 'price-for-all');
        currentPrice < currentPriceLimit && $(element).find('.price').append(node)
    }

    insertSizeNode(element, size, description, sizeText) {
        if ($(element).hasClass('listUpdated')) {
            return false
        }
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