const records = (function() {
    function RecordsView() {
        let myContainer = null;
        this.init = function(container) {
            myContainer = container;
        }
        this.printData = function(recordList) {
            let index = 1;
            let numberRecords = recordList.length <= 10 ? recordList.length : 10

            let dataContainer = myContainer.querySelector('.records_body');
            dataContainer.innerHTML = '';

            for (let i = 0; i < numberRecords; i++) {
                const player = recordList[i];
                dataContainer.appendChild(this.createRow(index++, player));
            }
        }
        this.createRow = function(index = 1, player) {

            let row = document.createElement('tr'),
                td1 = document.createElement('td'),
                td2 = document.createElement('td'),
                td3 = document.createElement('td');

            row.setAttribute('data-id', player.username);
            td1.innerHTML = index;
            td2.innerHTML = `<strong>${player.username}</strong>`;
            td3.innerHTML = `${player.record}`;
            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            return row
        }
    }

    function RecordsModel() {
        let myView = null;
        let arrayRecords = [];
        let sortNameFlag = false;
        let sortRecordFlag = false;
        this.init = function(view) {
            sortNameFlag = false;
            sortRecordFlag = false;
            myView = view;
            this.printData();
        }
        this.printData = function() {
            let model = this;
            appDB.ref('score/').on('value', function(snapshot) {
                model.sortByRecord(snapshot.val());
            }, function(error) {
                console.log('Error:' + error.code);
            })
        }
        this.sortByRecord = function(recordList) {
            if (recordList) {
                arrayRecords = []
                for (let player in recordList) {
                    arrayRecords.push(recordList[player]);
                }
            }
            if (!sortRecordFlag) {
                arrayRecords.sort((a, b) => a.record > b.record ? 1 : -1);
                sortRecordFlag = true;
            } else {
                arrayRecords.sort((a, b) => a.record > b.record ? 1 : -1).reverse();
                sortRecordFlag = false;
            }
            sortNameFlag = false;
            myView.printData(arrayRecords);
        }
        this.sortByName = function() {
            if (!sortNameFlag) {
                arrayRecords.sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1);
                sortNameFlag = true;
            } else {
                arrayRecords.sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1).reverse();
                sortNameFlag = false;
            }
            sortRecordFlag = false;
            myView.printData(arrayRecords);
        }
    }

    function RecordsController() {
        let myModel = null;
        let myContainer = null;
        let sortNameBtn = null;
        let sortRecordBtn = null;
        this.init = function(model, container) {
            myModel = model;
            myContainer = container;
            sortNameBtn = myContainer.querySelector('button[data-sort="name"]');
            sortRecordBtn = myContainer.querySelector('button[data-sort="record"]');
            sortNameBtn.addEventListener('click', this.handlerSortNameBtn);
            sortRecordBtn.addEventListener('click', this.handlerSortRecordBtn);
            window.addEventListener("hashchange", this.exitRecords);
        }
        this.handlerSortNameBtn = function() {
            myModel.sortByName();
        }
        this.handlerSortRecordBtn = function() {
            myModel.sortByRecord();
        }
        this.exitRecords = function() {
            sortNameBtn.removeEventListener('click', this.handlerSortNameBtn);
            sortRecordBtn.removeEventListener('click', this.handlerSortRecordBtn);
            window.removeEventListener("hashchange", this.exitRecords);
        }
    }
    return {
        init: function() {
            let view = new RecordsView();
            let model = new RecordsModel();
            let controller = new RecordsController();
            view.init(document.querySelector('.records-page'));
            model.init(view);
            controller.init(model, document.querySelector('.records-page'));
        }
    }
})()