class Building extends ListUpdater {
  onFetchSuccess(html, element, url) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    const size = this.getValueByLabel(dom, "Общая площадь");
    if (!size) return;
    const description = $(dom).find("#textContent").text().trim();
    let storageItem = {
      size,
      description,
    };
    localStorage.setItem(url, JSON.stringify(storageItem));
    this.insertChanges(element, size, description);
  }

  onReadLocalStorage(element, url) {
    const { size, description } = JSON.parse(localStorage.getItem(url));
    this.insertChanges(element, size, description);
    $(element).addClass("listUpdated");
  }

  insertChanges(element, size, description) {
    this.insertPricePerSizeNode(element, size, "за м²");
    this.insertSizeNode(element, size, description, "м²");
    $(element).addClass("listUpdated");
  }
}
