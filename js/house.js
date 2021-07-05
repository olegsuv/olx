/**
 * Created by olegsuv on 19.11.2018.
 */
class House extends Building {
  onFetchSuccess(html, element, url) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const buildingSize = this.getValueByLabel(dom, "Общая площадь");
    const groundSize = this.getValueByLabel(dom, "Площадь участка");
    const storageItem = {
      buildingSize,
      groundSize,
    };
    localStorage.setItem(url, JSON.stringify(storageItem));
    this.insertChanges(element, buildingSize, groundSize);
  }

  onReadLocalStorage(element, url) {
    const { buildingSize, groundSize } = JSON.parse(localStorage.getItem(url));
    this.insertChanges(element, buildingSize, groundSize);
    $(element).addClass("listUpdated");
  }

  insertChanges(element, buildingSize, groundSize) {
    this.insertPricePerSizeNode(element, buildingSize, "за м²");
    this.insertSizeNode(element, buildingSize, null, "м²");
    this.insertPricePerSizeNode(element, groundSize, "за сотку");
    this.insertSizeNode(element, groundSize, null, "соток");
    $(element).addClass("listUpdated");
  }
}

const houseMask = "/nedvizhimost/doma/";
checkInit([houseMask], House);
