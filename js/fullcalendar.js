document.addEventListener('DOMContentLoaded', function () {
    console.log('start FullCallendar');

    let addEventWrapper = document.getElementById('add-event');
    let bodyId = document.getElementById('body-id');

    let vendorSelectId;
    let accNameSelectId;
    let productSelectId;
    let productSelectName;

    const offset = (new Date()).getTimezoneOffset();

    let datePickerS = document.getElementById('datepicker-start');
    MCDatepicker.create(
        {
            el: '#datepicker-start',
            bodyType: 'inline',
            closeOnBlur: true,
            dateFormat: 'YYYY-MM-DD'
        });
    let datePickerE = document.getElementById('datepicker-end');
    MCDatepicker.create(
        {
            el: '#datepicker-end',
            bodyType: 'inline',
            closeOnBlur: true,
            dateFormat: 'YYYY-MM-DD'
        });

    // calendar
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        // initialDate: '2022-08-07',
        selectable: true,
        editable: true,
        // allDay:  false,
        nextDayThreshold: '00:00:00',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'addEventButton'//'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
/*
            {
               title: 'Long Event',
               start: '2022-08-07',
               end: '2022-08-10'
            },
            {
               groupId: '999',
               title: 'Repeating Event',
               start: '2022-08-09T16:00:00'
            },
            {
               groupId: '999',
               title: 'Repeating Event',
               start: '2022-08-16T16:00:00'
            },
            {
               title: 'Conference',
               start: '2022-08-11',
               end: '2022-08-13'
            }
 */
        ],
        eventDrop: function ( eventData ) {/* event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view */
            console.clear();
            console.log("dropped");
            // console.log("eventData" + JSON.stringify(eventData));

            let startDate = new Date(eventData.event.start.getTime() - (offset*60*1000));
            let endDate = new Date(eventData.event.end.getTime() - (offset*60*1000));

            startDate = startDate.toISOString().split('T')[0];
            endDate = endDate.toISOString().split('T')[0];

            console.log(eventData.event.title + " start is now " + startDate);
            console.log(eventData.event.title + " end is now " + endDate);

            // to Zoho
            let eventUpdate = {
                Entity:"Sales_Orders",
                APIData:{
                    "id" : eventData.event.id,
                    "Subject" : eventData.event.title,
                    "Start_Date": startDate,
                    "End_Date"  : endDate,
                }
            }
            ZOHO.CRM.API.updateRecord(eventUpdate)
                .then(function(data){
                    console.log(data)
                });
        },
        eventResize: function( eventData ){
            // handle all resizing events (i.e. changing an events duration)
            console.clear();
            console.log("resize");
            // console.log("eventData" + JSON.stringify(eventData));

            let startDate = new Date(eventData.event.start.getTime() - (offset*60*1000));
            let endDate = new Date(eventData.event.end.getTime() - (offset*60*1000));
            startDate = startDate.toISOString().split('T')[0];
            endDate = endDate.toISOString().split('T')[0];

            console.log(eventData.event.title + " start is now " + startDate);
            console.log(eventData.event.title + " end is now " + endDate);

            // to Zoho
            let eventUpdate = {
                Entity:"Sales_Orders",
                APIData:{
                    "id": eventData.event.id,
                    "Subject": eventData.event.title,
                    "Start_Date": startDate,
                    "End_Date"  : endDate,
                }
            }
            ZOHO.CRM.API.updateRecord(eventUpdate)
                .then(function(data){
                    console.log(data)
                });
        },
        customButtons: {
            addEventButton: {
                text: 'add event...',
                click: function() {
                    // addEventWrapper.style.visibility = "visible";
                    addEventWrapper.classList.remove('block-none');
                    addEventWrapper.classList.add('block-show');
                    bodyId.style.overflow = "hidden";

                    // list of vendors
                    let eventVendor = document.getElementById('event__vendor');
                    let  df1 = document.createDocumentFragment();
                    for (let i = 0, l = main_vendor_list.length; i < l; i++) {
                        let option = document.createElement('div'); // create the option element
                        option.className = "event__vendor--item";
                        // option.value = vendor_list[i].id; // set the value property
                        option.setAttribute("data-id", main_vendor_list[i].id);
                        option.setAttribute("data-name", main_vendor_list[i].title);
                        option.appendChild(document.createTextNode(main_vendor_list[i].title)); // set the textContent in a safe way.
                        df1.appendChild(option); // append the option to the document fragment
                    }
                    eventVendor.appendChild(df1);

                    // list of accounts
                    let eventAccname = document.getElementById('event__accname');
                    let  df2 = document.createDocumentFragment();
                    for (let i = 0, l = main_account_list.length; i < l; i++) {
                        let option = document.createElement('div'); // create the option element
                        option.className = "event__accname--item";
                        // option.value = vendor_list[i].id; // set the value property
                        option.setAttribute("data-id", main_account_list[i].id);
                        option.setAttribute("data-name", main_account_list[i].title);
                        option.appendChild(document.createTextNode(main_account_list[i].title)); // set the textContent in a safe way.
                        df2.appendChild(option); // append the option to the document fragment
                    }
                    eventAccname.appendChild(df2);

                    // list of products
                    //console.log(main_product_list);
                    let eventProduct = document.getElementById('event__product');
                    let  df3 = document.createDocumentFragment();
                    for (let i = 0, l = main_product_list.length; i < l; i++) {
                        let option = document.createElement('div'); // create the option element
                        option.className = "event__product--item";
                        option.setAttribute("data-id", main_product_list[i].id);
                        option.setAttribute("data-name", main_product_list[i].title);
                        option.appendChild(document.createTextNode(main_product_list[i].title)); // set the textContent in a safe way.
                        df3.appendChild(option); // append the option to the document fragment
                    }
                    eventProduct.appendChild(df3);

                    // filter vendors;
                    let evSearch = document.getElementById('event__vendor--search');
                    evSearch.onkeyup = function() {
                        let filter = evSearch.value.toUpperCase();
                        let evItem = eventVendor.getElementsByClassName('event__vendor--item');
                        for (let i = 0; i < evItem.length; i++) {
                            let txtValue = evItem[i].textContent || evItem[i].innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                evItem[i].style.display = "";
                            } else {
                                evItem[i].style.display = "none";
                            }
                        }
                    }

                    // filter accnames;
                    let eanSearch = document.getElementById('event__accname--search');
                    eanSearch.onkeyup = function() {
                        let filter = eanSearch.value.toUpperCase();
                        let eanItem = eventAccname.getElementsByClassName('event__accname--item');
                        for (let i = 0; i < eanItem.length; i++) {
                            let txtValue = eanItem[i].textContent || eanItem[i].innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                eanItem[i].style.display = "";
                            } else {
                                eanItem[i].style.display = "none";
                            }
                        }
                    }

                    // filter Product;
                    let epSearch = document.getElementById('event__accname--search');
                    epSearch.onkeyup = function() {
                        let filter = epSearch.value.toUpperCase();
                        let epItem = eventProduct.getElementsByClassName('event__product--item');
                        for (let i = 0; i < epItem.length; i++) {
                            let txtValue = epItem[i].textContent || epItem[i].innerText;
                            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                                epItem[i].style.display = "";
                            } else {
                                epItem[i].style.display = "none";
                            }
                        }
                    }

                    /**/
                    let selectVendorItems = document.getElementsByClassName('event__vendor--item');
                    for (let i = 0; i < selectVendorItems.length; i++) {
                        selectVendorItems[i].addEventListener('click', function () {
                            // console.log('selectVendorItems[i]' + this.getAttribute('data-id'));
                            let evSearch1 = document.getElementById('event__vendor--search');
                            evSearch1.value = this.getAttribute('data-name');
                            vendorSelectId = this.getAttribute('data-id');
                        });
                    }

                    let selectAccNameItems = document.getElementsByClassName('event__accname--item');
                    for (let i = 0; i < selectAccNameItems.length; i++) {
                        selectAccNameItems[i].addEventListener('click', function () {
                            // console.log('selectAccNameItems[i]=' + this.getAttribute('data-id'));
                            let eanSearch1 = document.getElementById('event__accname--search');
                            eanSearch1.value = selectAccNameItems[i].getAttribute('data-name');
                            accNameSelectId = selectAccNameItems[i].getAttribute('data-id');
                        });
                    }

                    let selectProductItems = document.getElementsByClassName('event__product--item');
                    for (let i = 0; i < selectProductItems.length; i++) {
                        selectProductItems[i].addEventListener('click', function () {
                            // console.log('selectVendorItems[i]' + this.getAttribute('data-id'));
                            let epSearch1 = productSelectName = document.getElementById('event__product--search');
                            epSearch1.value = this.getAttribute('data-name');
                            productSelectId = this.getAttribute('data-id');
                        });
                    }
                    /**/

                    let okBtn = document.getElementById('add-event__btn');
                    okBtn.onclick = function() {
                        let startDate = datePickerS.value;
                        let endDate = datePickerE.value;
                        let eventName = document.getElementById('event__name').value;
                        let quantity = document.getElementById('event__product--quantity').value;

                        console.log('startDate=' + startDate);
                        console.log('endDate=' + endDate);
                        console.log('eventName=' + eventName);
                        console.log('vendorSelect=' + vendorSelectId);
                        console.log('accNameSelect=' + accNameSelectId);
                        console.log('productSelectId=' + productSelectId);
                        console.log('quantity=' + quantity);

                        let eventDateS = new Date(startDate + 'T00:00:00');
                        let eventDateE = new Date(endDate + 'T00:00:00');

                        if (isNaN(eventDateS.valueOf()) && isNaN(eventDateE.valueOf())) { // valid?
                            alert('Invalid date.');
                        } else if(!eventName) {
                            alert('Invalid name of event.');
                        } else if(!vendorSelectId) {
                            alert('Please select Vendor.');
                        } else if(!accNameSelectId) {
                            alert('Please select Account.');
                        } else if(!productSelectId) {
                            alert('Please select Product.');
                        } else if(!quantity) {
                            alert('Please enter quantity of Product.');
                        } else {

                            eventDateS = new Date(eventDateS.getTime() - (offset*60*1000));
                            eventDateE = new Date(eventDateE.getTime() - (offset*60*1000));
                            eventDateS = eventDateS.toISOString().split('T')[0];
                            eventDateE = eventDateE.toISOString().split('T')[0];

                            // calendar.addEvent({
                            //     id: vendorSelectId,
                            //     title: eventName,
                            //     start: eventDateS,
                            //     end: eventDateE,
                            //     editable: true,
                            //     description: eventName,
                            // });

                            let productDetail = {
                                "product": {
                                    "id": productSelectId,
                                },
                                "quantity": parseInt(quantity, 10),
                            }

                            let eventDataZoho = {
                                "Start_Date": eventDateS,
                                "End_Date": eventDateE,
                                "Vendor": vendorSelectId,
                                "Subject": eventName,
                                "Account_Name": accNameSelectId,
                                "Product_Details": [productDetail],
                            }
                            ZOHO.CRM.API.insertRecord({
                                Entity: "Sales_Orders",
                                APIData: eventDataZoho
                            }).then( function(data) {
                                console.log(data);
                                // console.log(data.data[0].details.id);
                                if (data.data[0].details.id) {
                                    ZOHO.CRM.API.insertRecord({
                                        Entity: "JobsheetXVendor",
                                        APIData: {
                                            "Jobsheet": data.data[0].details.id,
                                            "Vendor": vendorSelectId,
                                        }
                                    }).then( function(dataJXV) {
                                        console.log(dataJXV);
                                    });
                                }
                            });

                        }
                    }
                }
            }
        }
    });
    calendar.render();

    // close event popap;
    let closeEventWrapper = document.getElementsByClassName('close');
    closeEventWrapper[0].onclick = function() {
        addEventWrapper.classList.remove('block-show');
        addEventWrapper.classList.add('block-none');
        bodyId.style.overflow = "auto";
    }

    let main_vendor_list = [];
    let main_account_list = [];
    let main_product_list = [];

    ZOHO.embeddedApp.on("PageLoad", async function(data){
        // console.log('data= '+ JSON.stringify(data));

        let vendor_list = [];
        // var jobsheet_list = [];
        await ZOHO.CRM.API.getAllRecords({ Entity: "Vendors", sort_order: "asc", per_page: 200, page: 1 })
            .then(async function (vendor_detail) {
                // console.log("Employee Record");
                // console.log(vendor_detail.data);
                let get_all_vendor = vendor_detail.data;
                for (let i = 0, l = get_all_vendor.length; i < l; i++) {
                    let vendor_object = {};
                    vendor_object.id = get_all_vendor[i].id;
                    vendor_object.title = get_all_vendor[i].Vendor_Name;
                    vendor_list.push(vendor_object);
                }
                // console.log('vendor_list: ' +  JSON.stringify(vendor_list));
                main_vendor_list = vendor_list;

                // list of vendors
                let elm = document.getElementById('employee_option');
                let  df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                for (let i = 0, l = vendor_list.length; i < l; i++) {
                    let option = document.createElement('div'); // create the option element
                    option.className = "selectpicker__item";
                    // option.value = vendor_list[i].id; // set the value property
                    option.setAttribute("data-id", vendor_list[i].id);
                    option.setAttribute("data-name", vendor_list[i].title);
                    option.appendChild(document.createTextNode(vendor_list[i].title)); // set the textContent in a safe way.
                    df.appendChild(option); // append the option to the document fragment
                }
                elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
            })
        await getIDbyClickOnVendor();//.then(r => 'notfound');

        let account_list = [];
        for(let page = 0; page <= 4; page++) {
            await ZOHO.CRM.API.getAllRecords({Entity: "Accounts", sort_order: "asc", per_page: 200, page: page })
                .then(async function (account_detail) {
                    if ( account_detail.data?.length  ) {
                        let get_all_accounts = account_detail.data;
                        for (let i = 0, l = get_all_accounts.length; i < l; i++) {
                            let account_object = {};
                            account_object.id = get_all_accounts[i].id;
                            account_object.title = get_all_accounts[i].Account_Name;
                            account_list.push(account_object);
                        }
                        // console.log('vendor_list: ' +  JSON.stringify(vendor_list));
                        // console.log('get_all_accounts.length: ' + get_all_accounts.length);
                        if( account_list.length !== undefined ) {
                            main_account_list = main_account_list.concat(account_list);
                        }
                    }
                })
        }
        main_account_list = [...new Set(main_account_list)];

        let product_list = [];
        for(let page = 0; page <= 4; page++) {
            await ZOHO.CRM.API.getAllRecords({Entity: "Products", sort_order: "asc", per_page: 200, page: page })
                .then(async function (product_detail) {
                    if ( product_detail.data?.length  ) {
                        let get_all_products = product_detail.data;
                        for (let i = 0, l = get_all_products.length; i < l; i++) {
                            let product_object = {};
                            product_object.id = get_all_products[i].id;
                            product_object.title = get_all_products[i].Product_Name;
                            product_list.push(product_object);
                        }
                        if( product_list.length !== undefined ) {
                            main_product_list = main_product_list.concat(product_list);
                        }
                    }
                })
        }
        main_product_list = [...new Set(main_product_list)];

    })
    ZOHO.embeddedApp.init();

     async function getIDbyClickOnVendor() {
        let selectpickerItems = document.getElementsByClassName('selectpicker__item');

        for (let i = 0; i < selectpickerItems.length; i++) {
            selectpickerItems[i].addEventListener('click', function () {
                // console.log('qwerty= ' + JSON.stringify(this.getAttribute('data-id')));

                for (let i = 0; i < selectpickerItems.length; i++) { selectpickerItems[i].classList.remove("selected__item"); } // clear
                this.classList.add("selected__item"); // select item

                if (calendar) { // refresh all events
                    calendar.removeAllEvents();
                }

                let qveryStr = "(Vendor.id:equals:" + this.getAttribute('data-id') + ")";
                console.log(qveryStr);

                ZOHO.CRM.API.searchRecord({
                        Entity: "JobsheetXVendor",
                        Type: "criteria",
                        Query: qveryStr
                    })
                    .then( function(dataZ){

                        dataZ = dataZ.data;
                        if (dataZ.length) {

                            ZOHO.CRM.API.searchRecord({
                                Entity: "Sales_Orders",
                                Type: "criteria",
                                Query: "( (id:equals: 3546009000053598120 ) and ($converted = true) )"
                            })
                            .then( function(dataZC){
                                console.log('dataZC criteria = ' + JSON.stringify(dataZC) );
                            });


                            // console.log('dataZ length= ' + JSON.stringify(dataZ.length));

                            /*for (let j = 0; j < dataZ.length; j++) {

                                // console.log('dataZ[' + j + ']= ' + dataZ[j].Jobsheet.id);

                                ZOHO.CRM.API.searchRecord({
                                    Entity: "Sales_Orders",
                                    Type: "criteria",
                                    Query: "(id:equals:" + dataZ[j].Jobsheet.id + ")"
                                })
                                .then( function(dataZC){

                                    // console.log("i" + i);
                                    // console.log("dataZC?.data["+ j +"]" + JSON.stringify(dataZC?.data[j]));

                                    if(dataZC) {
                                        dataZC = dataZC?.data[0];

                                        console.log('j= ' + j);
                                        // console.log('dataZC= ' + JSON.stringify(dataZC) );
                                        console.log('dataZC_S= ' + dataZC?.Start_Date);
                                        console.log('dataZC_E= ' + dataZC?.End_Date);

                                        calendar.addEvent({
                                            id: dataZC.id,
                                            title: dataZC?.Subject,
                                            start: dataZC?.Start_Date,
                                            end: dataZC?.End_Date,
                                            // allDay: false, // if option is 'true' then destroi editable
                                            editable: true,
                                            description: dataZC?.Subject,
                                        });
                                    }

                                });
                            }*/
                        }
                    });
                return this.getAttribute('data-id');
            });
        }
    }
})
