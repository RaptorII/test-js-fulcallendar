document.addEventListener('DOMContentLoaded', function () {
    console.log('start input');

    let addEventWrapper = document.getElementById('add-event');
    let bodyId = document.getElementById('body-id');

    let datePickerS = MCDatepicker.create(
        {
            el: '#datepicker-start',
            bodyType: 'inline',
            closeOnBlur: true,
            dateFormat: 'YYYY-MM-DD'
        });
    let datePickerE = MCDatepicker.create(
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

            const offset = (new Date()).getTimezoneOffset();
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

            const offset = (new Date()).getTimezoneOffset();
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
                    /*var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                    var date = new Date(dateStr + 'T00:00:00'); // will be in local time

                    if (!isNaN(date.valueOf())) { // valid?
                        calendar.addEvent({
                            title: 'dynamic event',
                            start: date,
                            allDay: true
                        });
                        alert('Great. Now, update your database...');
                    } else {
                        alert('Invalid date.');
                    }*/

                    // addEventWrapper.style.visibility = "visible";
                    addEventWrapper.classList.remove('block-none');
                    addEventWrapper.classList.add('block-show');
                    bodyId.style.overflow = "hidden";

                    // console.log('main_vendor_list=' + JSON.stringify(main_vendor_list));

                    // list of vendors
                    let elm1 = document.getElementById('event__vendor');
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
                    elm1.appendChild(df1);
                    // console.log("df1=" + df1);


                    // list of accounts
                    console.log('main_accounts_list.length: ' + main_accounts_list.length);

                    let elm2 = document.getElementById('event__accname');
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
                    elm2.appendChild(df2);

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

    ZOHO.embeddedApp.on("PageLoad", async function(data){
        // console.log('data= '+ JSON.stringify(data));

        let vendor_list = [];
        // var jobsheet_list = [];
        await ZOHO.CRM.API.getAllRecords({ Entity: "Vendors", sort_order: "asc", per_page: 200, page: 1 })
            .then(async function (vendor_detail) {
                // console.log("Employee Record");
                // console.log(vendor_detail.data);
                var get_all_vendor = vendor_detail.data;
                for (let i = 0, l = get_all_vendor.length; i < l; i++) {
                    var vendor_object = {};
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
        for(let page = 0; page <= 10; page++) {
            await ZOHO.CRM.API.getAllRecords({Entity: "Accounts", sort_order: "asc", per_page: 200, page: page })
                .then(async function (account_detail) {
                    var get_all_accounts = account_detail.data;
                    for (let i = 0, l = get_all_accounts.length; i < l; i++) {
                        var account_object = {};
                        account_object.id = get_all_accounts[i].id;
                        account_object.title = get_all_accounts[i].Account_Name;
                        account_list.push(account_object);
                    }
                    // console.log('vendor_list: ' +  JSON.stringify(vendor_list));
                    // console.log('get_all_accounts.length: ' + get_all_accounts.length);
                    main_account_list = [].concat(main_account_list, account_list);

                })
        }
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
                    .then(function(dataZ){

                        dataZ = dataZ.data;
                        if (dataZ.length) {
                            // console.log('dataZ length= ' + JSON.stringify(dataZ.length));

                            for (let i = 0; i < dataZ.length; i++) {
                                console.log('dataZ[' + i + ']= ' + dataZ[i].Jobsheet.id);
                                ZOHO.CRM.API.searchRecord({
                                    Entity: "Sales_Orders",
                                    Type: "criteria",
                                    Query: "(id:equals:" + dataZ[i].Jobsheet.id + ")"
                                })
                                .then(function(dataZC){
                                    if(dataZC) {
                                        dataZC = dataZC?.data[0];

                                        console.log('i= ' + i);
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


                            }
                        }
                    });



                return this.getAttribute('data-id');
            });
        }
    }



})
