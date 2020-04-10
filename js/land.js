/**
 * Created by olegsuv on 17.11.2018.
 */

class Land extends ListUpdater {
    async onFetchSuccess(response, element, url) {
        const size = this.getTDValueByLabel(response, 'Площадь участка') || 1;
        const description = $(response).find('#textContent').text().trim();
        const cadastralNumber = this.getTDValueByLabel(response, 'Кадастровый номер', false) || null;
        let storageItem = {
            size,
            description,
        };
        if (cadastralNumber) {
            const processedCadastralNumber = this.getProcessedCadastralNumberNode(cadastralNumber);
            if (processedCadastralNumber) {
                storageItem.cadastralNumber = processedCadastralNumber;
                const coordsWGS84 = await this.getWGS84Coords(processedCadastralNumber);
                if (coordsWGS84) {
                    storageItem.coordsWGS84 = coordsWGS84
                }
            }
        }
        localStorage.setItem(url, JSON.stringify(storageItem));
        this.insertChanges(element, storageItem);
    }

    async onReadLocalStorage(element, url) {
        const storageItem = JSON.parse(localStorage.getItem(url));
        const {cadastralNumber, coordsWGS84} = storageItem;
        const processedCadastralNumber = this.getProcessedCadastralNumberNode(cadastralNumber);
        if (cadastralNumber && !coordsWGS84) {
            const coordsWGS84 = await this.getWGS84Coords(processedCadastralNumber);
            localStorage.setItem(url, JSON.stringify(...storageItem, coordsWGS84));
        }
        this.insertChanges(element, storageItem);
        $(element).addClass('listUpdated');
    }

    insertChanges(element, storageItem) {
        const {size, description, cadastralNumber, coordsWGS84} = storageItem;
        this.insertPricePerSizeNode(element, size, 'за сотку');
        this.insertPriceForAllNode(element, size, 'за все');
        this.insertSizeNode(element, size, description, 'соток');
        cadastralNumber && this.insertCadastralNumberNode(element, cadastralNumber);
        coordsWGS84 && this.insertGoogleMapLinkNode(element, coordsWGS84);
        $(element).addClass('listUpdated');
    }

    insertCadastralNumberNode(element, cadastralNumber) {
        const link = `<br />
            <a href="https://newmap.land.gov.ua/?cadnum=${escape(cadastralNumber)}" target="_blank">
                <span class="list-updater-label list-updater-label-cadastralNumber">
                    Кадастровая карта: ${cadastralNumber}
                </span>
            </a>`;
        $(element).find('.link.detailsLink').after(link);
    }

    async insertGoogleMapLinkNode(element, coordsWGS84) {
        if (!coordsWGS84 || !coordsWGS84.x || !coordsWGS84.y) {
            console.log('insertGoogleMapLinkNode error:', element, coordsWGS84);
            return false
        }
        const locationName = $(element).find('.breadcrumb.x-normal i[data-icon="location-filled"]').eq(0).parent().text();
        const cityName = locationName.split(',')[0];
        const lon = coordsWGS84.x * 180 / 20037508.34;
        const lat = Math.atan(Math.exp(coordsWGS84.y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;
        const link = `<br />
            <a href="https://www.google.com.ua/maps/dir/${cityName}/${lat},${lon}/@${lat},${lon},13z" target="_blank">
                <span class="list-updater-label list-updater-label-cadastralNumber">
                    Google карта: ${lat}, ${lon}
                </span>
            </a>`;
        $(element).find('.link.detailsLink').after(link);
    }

    async getWGS84Coords(cadastralNumber) {
        let response = await fetch('https://map.land.gov.ua/mapi/find-parcel?cadnum=' + escape(cadastralNumber) + '&activeArchLayer=0');
        if (response.ok) {
            let json = await response.json();
            return {
                x: json.data.st_x,
                y: json.data.st_y
            }
        } else {
            console.log(cadastralNumber + " - ошибка HTTP: " + response.status);
            return false
        }
    }

    getProcessedCadastralNumberNode(cadastralNumber) {
        const cadastralRegexp = new RegExp(/\d{10}:\d{2}:\d{3}:\d{4}/g);
        const cadastralFailedRegexp = new RegExp(/\d{19}/g);
        if (!cadastralRegexp.test(cadastralNumber)) {
            console.log('getProcessedCadastralNumberNode fail', cadastralNumber);
            if (cadastralFailedRegexp.test(cadastralNumber)) {
                cadastralNumber = cadastralNumber.substr(0, 10) + ':' +
                    cadastralNumber.substr(10, 2) + ':' +
                    cadastralNumber.substr(12, 3) + ':' +
                    cadastralNumber.substr(15, 4)
            } else {
                cadastralNumber = null
            }
        }
        return cadastralNumber;
    }
}

const landMask = '/nedvizhimost/zemlya/';
if (location.href.search(landMask) !== -1) {
    const land = new Land();
    land.init();
}

