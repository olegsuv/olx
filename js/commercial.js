/**
 * Created by olegsuv on 19.11.2018.
 */
class Commercial extends Building {
    insertChanges(element, size, description) {
        this.insertPriceForAllNode(element, size, 'за все');
        super.insertChanges(element, size, description);
    }
}

const commercialMask = '/nedvizhimost/kommercheskaya-nedvizhimost/';
checkInit([commercialMask], Commercial);