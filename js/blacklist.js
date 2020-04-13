/**
 * Created by Oleg on 14.02.2017.
 */

(function () {

    const labels = {
        notFound: 'Жалоб еще не было, можно звонить',
        found: 'Найдены жалобы: ',
        toAddHeader: 'Добавить жалобу:',
        adding: 'Добавляется...',
        added: 'Телефон добавлен в базу, спасибо',
        error: 'Ошибка скрипта',
        enterComment: 'Введите комментарий',
        emptyComment: 'Вы не ввели комментарий, добавления в базу не будет',
        pending: 'Загрузка данных...',
        placeholder: 'Введите текст жалобы',
        clickToAction: 'Пожаловаться',
        noPhones: 'Телефонные номера не загружены'
    };

    const config = {
        host: 'https://pacific-oasis-63187.herokuapp.com',
        add: '/api/v1/estate/advertisement/add.json',
        phones: '/api/v1/estate/advertisement/phones.json',
        search: '/api/v1/estate/advertisement/search.json'
    };

    const selectors = {
        addButton: '.js-claim-button',
        addText: '.js-claim-text',
        addForm: '.js-claim-form',
        renderElement: '#result',
        templateId: '#panelView',
        blacklist: '/blacklist/layout.stache',
        installPlace: '#contact_methods',
        phoneBlock: '.contact-button.link-phone',
        extensionInject: '.extension-inject'
    };

    const data = {
        phones: [],
        content: {
            items: []
        },
        labels: labels,
        location: location
    };

    function getTransferData(comment) {
        const dataObject = {
            phones: data.phones,
            url: location.pathname
        };
        if (comment) {
            dataObject.comment = comment;
        }
        return dataObject;
    }

    function getData() {
        $.ajax({
            crossOrigin: true,
            type: 'get',
            url: config.host + config.search,
            data: getTransferData(),
            dataType: 'json',
            success: function (receivedData) {
                data.content = receivedData;
                renderData(data);
            },
            error: function (json) {
                this.log('error', json);
            }
        });
    }

    function setData(comment) {
        $.ajax({
            crossOrigin: true,
            type: 'post',
            url: config.host + config.add,
            data: getTransferData(comment),
            dataType: 'json',
            success: function () {
                data.content.items.push(getTransferData(comment));
                $(selectors.addButton).prop('disabled', false).val('');
                renderData(data);
            },
            error: function (json) {
                this.log('error', json);
            }
        });
    }

    function renderData(data) {
        const renderedTemplate = $.templates(selectors.templateId).render(data);
        $(selectors.extensionInject).html(renderedTemplate);
        if (data.content.items.length) {
            $(selectors.phoneBlock).css({
                background: 'red',
                opacity: '0.5',
                cursor: 'not-allowed'
            });
        }
    }

    function parsePhones() {
        const $phones = $(selectors.phoneBlock).find('.block');
        if ($phones.length) {
            $phones.each(function (i, phone) {
                data.phones.push($(phone).text().replace('+38', ''));
            });

            getData();
        }
    }

    function formSubmit(element) {
        element.preventDefault();

        const comment = $(selectors.addText).val();
        if (comment) {
            $(selectors.addButton).prop('disabled', true);
            setData(comment);
        }
        else {
            alert(labels.emptyComment);
        }
    }

    function init() {
        $(selectors.phoneBlock).bind('DOMSubtreeModified', parsePhones).click();
        $(selectors.installPlace).after($('<div/>').addClass(selectors.extensionInject.replace('.', '')));

        //install panel into body!
        $.get(chrome.extension.getURL(selectors.blacklist), function (response) {
            $(selectors.installPlace).append($(response));
            $(selectors.extensionInject).on('submit', selectors.addForm, formSubmit);
        });
    }

    init(); //run this
})();
