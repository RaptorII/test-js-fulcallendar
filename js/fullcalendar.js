document.addEventListener('DOMContentLoaded', function () {
    console.log('start input');

    // calendar
    calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
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
            {
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
            },
            {
                title: 'Meeting',
                start: '2022-08-12T10:30:00',
                end: '2022-08-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2022-08-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2022-08-12T14:30:00'
            },
            {
                title: 'Birthday Party',
                start: '2022-08-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2022-08-28'
            }
        ]

    });
    calendar.render();

    ZOHO.embeddedApp.on("PageLoad",async function(data){
        // console.log('data= '+data);

        var vendor_list = [];
        var jobsheet_list = [];
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
                console.log('vendor_list: ' +  JSON.stringify(vendor_list));

                // error_log("Employee_list:"+employee_list);

                let elm = document.getElementById('employee_option');
                let  df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
                for (let i = 0, l = vendor_list.length; i < l; i++) {
                    var option = document.createElement('option'); // create the option element
                    option.value = vendor_list[i].id; // set the value property
                    option.appendChild(document.createTextNode(vendor_list[i].title)); // set the textContent in a safe way.
                    df.appendChild(option); // append the option to the document fragment
                }
                elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
                // Example call of 'refresh'
                // $('.selectpicker').selectpicker('refresh');

            })


    })
    ZOHO.embeddedApp.init();


})
