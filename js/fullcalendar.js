document.addEventListener('DOMContentLoaded', function () {
    console.log('start input');

    // calendar
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        // initialDate: '2022-08-07',
        selectable: true,
        editable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            /*{
               title: 'All Day Event',
               start: '2022-08-01'
            },
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
            }*/
        ],
        eventDrop: function ( eventData ) {/* event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view */
            // handle all internal drops (or 'moves').
            console.clear();
            console.log("dropped");
            // console.log("eventData" + JSON.stringify(eventData));

            console.log(eventData.event.title + " end is now " + eventData.event.end.toISOString());

            // to Zoho
            let eventUpdate = {
                Entity:"Sales_Orders",
                APIData:{
                    "id": eventData.event.id,
                    "Subject": eventData.event.title,
                    "Start_Date": eventData.event.start.toISOString(),
                    "End_Date": eventData.event.end.toISOString(),
                }
            }
            ZOHO.CRM.API.updateRecord(eventUpdate)
                .then(function(data){
                    console.log(data)
                });
        },
        eventResize: function ( eventData ) { /// event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view
            // handle all resizing events (i.e. changing an events duration)
            console.clear();
            console.log("resize");
            // console.log("eventData" + JSON.stringify(eventData));

            console.log(eventData.event.title + " end is now " + eventData.event.end.toISOString());

            // to Zoho
            let eventUpdate = {
                Entity:"Sales_Orders",
                APIData:{
                    "id": eventData.event.id,
                    "Subject": eventData.event.title,
                    "Start_Date": eventData.event.start.toISOString(),
                    "End_Date": eventData.event.end.toISOString(),
                }
            }
            ZOHO.CRM.API.updateRecord(eventUpdate)
                .then(function(data){
                    console.log(data)
                });
        }

    });
    calendar.render();

    ZOHO.embeddedApp.on("PageLoad", async function(data){
        // console.log('data= '+data);

        var vendor_list = [];
        // var jobsheet_list = [];
         await ZOHO.CRM.API.getAllRecords({ Entity: "Vendors", sort_order: "asc", per_page: 100, page: 1 })
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

                // list of vendors
                let elm = document.getElementById('employee_option');
                let  df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                for (let i = 0, l = vendor_list.length; i < l; i++) {
                    var option = document.createElement('div'); // create the option element
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
                                    dataZC = dataZC?.data[0];

                                    console.log('i= ' + i );
                                    console.log('dataZC= ' + JSON.stringify(dataZC) );
                                    // console.log('dataZC_S= ' + dataZC?.Start_Date );
                                    // console.log('dataZC_E= ' + dataZC?.End_Date );

                                    // calendar.batchRendering(function() {
                                    //     calendar.changeView('dayGridMonth');
                                    //     calendar.addEvent({
                                    //         id: dataZ[i].Jobsheet.id,
                                    //         title: dataZC?.Subject,
                                    //         start: dataZC?.Start_Date,
                                    //         end: dataZC?.End_Date,
                                    //         editable: true,
                                    //         allDay: false,
                                    //     });
                                    // });

                                    // var eventObject = {
                                    //     title: displayText,
                                    //     start: item.startDate,
                                    //     end : item.endDate,
                                    //     allDay:true,
                                    //     color: '#BABBBF',
                                    //     editable : false,
                                    //     className : "user_block"
                                    // };
                                    // calendar.fullCalendar('renderEvent', eventObject, true);


                                    calendar.addEvent({
                                        id: dataZC.id,
                                        title: dataZC?.Subject,
                                        start: dataZC?.Start_Date,
                                        end: dataZC?.End_Date,
                                        // allDay: false, // if option is 'on' then destroi editable
                                        editable: true,
                                        description: dataZC?.Subject,
                                    });

                                });


                            }
                        }
                    });



                return this.getAttribute('data-id');
            });
        }
    }



    // [].forEach.call(selectpickerItems,function(el){
    //     el.addEventListener('click', function (e) {
    //         console.log('qwerty= ' + JSON.stringify( this.getAttribute('data-id') ) );
    //     })
    // });

})
