var db;
var dbCreated = false;

//var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    /*$( '#form-query' ).live( 'pageinit',function(event){
        db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
        if (dbCreated)
        	db.transaction(getPatientList, transaction_error);
        else
        	db.transaction(populateDBQuery, transaction_error, populateDBQuery_success);
    });*/
    $( '#form-query' ).live( 'pageshow',function(event){
        db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
        if (dbCreated)
            db.transaction(getPatientList, transaction_error);
        else
            db.transaction(populateDBQuery, transaction_error, populateDBQuery_success);
    });
}

function backKeyDown(){
    alert('not working');
}

function transaction_error(tx, error) {
	//$('#busy').hide();
    alert("Database Error: " + error);
}

function populateDBQuery_success() {
    console.log("populateDBQuery_success");
	dbCreated = true;
    db.transaction(getPatientList, transaction_error);
}

function getPatientList(tx) {
    console.log("getPatientList")
	var sql = "select * from patient";
	tx.executeSql(sql, [], getPatientList_success);
}

function getPatientList_success(tx, results) {
    console.log("getPatientList_success");
    $('#patient-list li').remove();
    var len = results.rows.length;
    console.log("len = "+len);
    for (var i=0; i<len; i++) {
    	var patient = results.rows.item(i);
        //console.log(JSON.stringify(results.rows.item(i)));
		$('#patient-list').append('<li><a href="#form-input?ssn='+patient.personalDataSSN+'">'+
            '<h3 class="ui-li-heading">'+ patient.personalDataFname + ' ' + patient.personalDataLname +'</h3>'+
            '<p class="ui-li-desc">DNI: '+ patient.personalDataSSN + ', HC: ' + patient.personalDataMHNum + '</p></a><a href="#" data-theme="b" onclick="javascript:deletePatient('+patient.personalDataSSN+');"title="Borrar"></a>'+
            '</li>');
        $('#patient-list').trigger('create');
        $('#patient-list').listview('refresh');
    }
	setTimeout(function(){
		//scroll.refresh();
        $('#patient-list').trigger('create');
        $('#patient-list').listview('refresh');
	},100);
	db = null;
}

function populateDBQuery(tx) {
  //$('#busy').show();
  //tx.executeSql('DROP TABLE IF EXISTS employee');
  var sql = 
    "CREATE TABLE IF NOT EXISTS patient ("+
        "created TEXT," +
        "author TEXT," +
        "personalDataMHNum INTEGER,"+ 
        "personalDataFname TEXT,"+
        "personalDataLname TEXT,"+
        "personalDataSSN INTEGER PRIMARY KEY,"+
        "personalDataBday TEXT,"+ 
        "personalDataAge INTEGER,"+
        "personalDataGender TEXT,"+
        "personalDataAddress TEXT,"+
        "personalDataCity TEXT,"+
        "fatherAlive TEXT,"+
        "fatherCOD TEXT,"+
        "fatherDBT INTEGER,"+
        "fatherHTA INTEGER,"+
        "fatherDislipedemia INTEGER,"+
        "fatherThyroid TEXT,"+
        "fatherChagas INTEGER,"+
        "fatherOthers TEXT,"+
        "motherAlive INTEGER,"+
        "motherCOD TEXT,"+
        "motherDBT INTEGER,"+
        "motherHTA INTEGER,"+
        "motherDislipedemia INTEGER,"+
        "motherThyroid TEXT,"+
        "motherChagas INTEGER,"+
        "motherOthers TEXT,"+
        "personalMHDBT INTEGER,"+
        "personalMHHTA INTEGER,"+
        "personalMHDislipedemia INTEGER,"+
        "personalMHThyroid TEXT,"+
        "personalMHChagas INTEGER,"+
        "personalMHArhythmia TEXT,"+
        "personalMHOthers TEXT,"+
        "personalMHTreatment TEXT,"+
        "personalMHTreatdesc TEXT,"+
        "personalMHSmoking TEXT,"+
        "personalMHSmokeDay REAL,"+
        "personalMHSmokeYears REAL,"+
        "personalMHSmokeAbstinence REAL,"+
        "glycemiaSched TEXT,"+
        "glycemiaFasting TEXT,"+
        "glycemiaVal REAL,"+
        "glycemiaLastmeal TEXT,"+
        "physicalActRecently TEXT,"+
        "physicalActRecentlyLeisure INTEGER,"+
        "physicalActRecentlyCompetition INTEGER,"+
        "physicalActRecentlyDesc TEXT,"+
        "physicalActRecentlyFreq REAL,"+
        "physicalActRecentlyHours REAL,"+
        "physicalActPrevious TEXT,"+
        "physicalActPreviousLeisure INTEGER,"+
        "physicalActPreviousCompetition INTEGER,"+
        "physicalActPreviousDesc TEXT,"+
        "physicalActPreviousAgeIni REAL,"+
        "physicalActPreviousAgeEnd REAL,"+
        "physicalActPreviousFreq REAL,"+
        "physicalActPreviousHours REAL,"+
        "vitalSignsPulse TEXT,"+
        "vitalSignsPulseFreq REAL,"+
        "vitalSignsBloodPressureSistolic REAL,"+
        "vitalSignsBloodPressureDiastolic REAL,"+
        "measuresSizeNum REAL,"+
        "measuresWeight REAL,"+
        "measuresWaist REAL,"+
        "measuresIMC REAL,"+
        "physicalExamInspection TEXT,"+
        "physicalExamHeartAuscultation TEXT,"+
        "physicalExamMurmurs TEXT,"+
        "physicalExamMurmursDesc TEXT,"+
        "physicalExamPulmonarAuscultation TEXT,"+ 
        "physicalExamPulmonarAuscultationDesc TEXT)";
    tx.executeSql(sql);

    //tx.executeSql("INSERT INTO employee (id,firstName,lastName,managerId,title,department,officePhone,cellPhone,email,city,picture) VALUES (12,'Steven','Wells',4,'Software Architect','Engineering','617-000-0012','781-000-0012','swells@fakemail.com','Boston, MA','steven_wells.jpg')");
}

function deletePatient(ssn){
    db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
    db.transaction(
        function (tx){
            var sql = "delete from patient where personalDataSSN = " + ssn;
            tx.executeSql(sql);
            console.log("Paciente borrado con éxito");
            db.transaction(getPatientList, transaction_error);
            alert("Paciente borrado con éxito");
            
        }, transaction_error);
}

function syncData2Web(){
    if(db == null)
        db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
    if (db != null)
        db.transaction(syncPatientList, transaction_error);
}

function syncPatientList(tx) {
    console.log("syncPatientList")
    var sql = "select * from patient";
    tx.executeSql(sql, [], syncPatientList_success);
}

function syncPatientList_success(tx, results) {
    var outputResult = (typeof(results) == 'undefined')?'null':results;
    if(outputResult != 'null'){
        var patientList = {patients:[]};
        var len = results.rows.length;
        console.log("len = "+len);
        for (var i=0; i<len; i++) {
            var patient = results.rows.item(i);
            //console.log(JSON.stringify(results.rows.item(i)));
            patientList.patients.push(results.rows.item(i));
        }

        //send them All
        sendPatientList(patientList);

        setTimeout(function(){
            alert("Sincronización Exitosa");
        },100);
    }
    db = null;
}

function sendPatientList(patientList){
   $.support.cors = true;
   $.mobile.allowCrossDomainPages = true;
   $.ajax({
    type: 'POST',
    data: patientList,
        //change the url for your project
        url: 'http://pampanet-pps.jit.su/syncData',
        success: function(data){
            console.log(data);
            alert('Your comment was successfully added');
        },
        error: function(err){
            console.log(JSON.stringify(err));
            alert('There was an error adding your comment');
        }
    });
}