export function getTDValueByLabel (response, label, int = false) {
    const description = $(response).find('.descriptioncontent');
    const td = description.find('td.value strong');
    for (let i = 0; i < td.length; i++) {
        let text = td[i].innerText.trim();
        if (text.indexOf(label) !== -1) {
            return int ? parseInt(text.split(' ')[0], 10) : text;
        }
    }
}