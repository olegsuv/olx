/**
 * Created by olegsuv on 19.11.2018.
 */
class House extends Building {
  onFetchSuccess(html, element, url) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const buildingSize = this.getValueByLabel(dom, "Общая площадь");
    const groundSize = this.getValueByLabel(dom, "Площадь участка");
    const description = $(dom).find("#textContent").text().trim();
    const storageItem = {
      buildingSize,
      groundSize,
      description,
    };
    localStorage.setItem(url, JSON.stringify(storageItem));
    this.insertChanges(element, ...storageItem);
  }

  onReadLocalStorage(element, url) {
    const { buildingSize, groundSize, description } = JSON.parse(
      localStorage.getItem(url)
    );
    this.insertChanges(element, buildingSize, groundSize, description);
    $(element).addClass("listUpdated");
  }

  insertChanges(element, buildingSize, groundSize, description) {
    this.insertPricePerSizeNode(element, size, "за м²");
    this.insertSizeNode(element, size, description, "м²");
    $(element).addClass("listUpdated");
  }
}

const houseMask = "/nedvizhimost/doma/";
checkInit([houseMask], House);
