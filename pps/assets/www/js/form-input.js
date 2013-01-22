var db;
var dbCreated = false;

//var scroll = new iScroll('wrapper', { vScrollbar: false, hScrollbar:false, hScroll: false });

var globalSSN = '';

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  $("#form-input").live("pagebeforeshow", function(e, data){
    if ($.mobile.pageData && $.mobile.pageData.ssn){
        console.log("Parameter ssn=" + $.mobile.pageData.ssn);
        //globalSSN = $.mobile.pageData.ssn;
    }
});
  /*$( '#form-input' ).live( 'pageinit',function(event){
    //alert( 'This page was just enhanced by jQuery Mobile!' );
    console.log("opening database");
    db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
    console.log("database opened");
    db.transaction(populateDBInput, transaction_error, populateDBInput_success);
  });*/
  $( '#form-input' ).live( 'pageshow',function(event){
    //alert( 'This page was just enhanced by jQuery Mobile!' );
    console.log("opening database");
    db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
    console.log("database opened");
    db.transaction(populateDBInput, transaction_error, populateDBInput_success);
  });
    //document.addEventListener("backKeyDown", backKeyDown, true); 
    
}

function backKeyDown() { 
    // do something here if you wish
    // alert('go back!');
    alert('not working');
}

function transaction_error(tx, error) {
    alert("Database Error: " + error);
}

function submitPatient(form){
  if (db == null)
    db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
  db.transaction(savePatient, transaction_error);
    
}


function savePatient(tx){
    $('#author').val('androidUser-'+device.name);
    var fields = $('form').serializeArray(); // Objects of (name,value)

    var fieldStr = fields[0].name;
    var fieldVals= "'"+ fields[0].value + "'";
    var fieldType;
    for (var i = 1; i< fields.length; i++){
        fieldStr += ","+fields[i].name;
        fieldType = $('[name="'+ fields[i].name +'"]')[0].type;
        console.log(fields[i].name +' '+ fieldType +' '+ fields[i].value);
        if(fieldType == 'number')
            fieldVals += "," + ((fields[i].value == '')?'null':fields[i].value);
        else if(fieldType == 'checkbox')
            fieldVals += "," + (new Number(1));
        else
            fieldVals += ",'" + fields[i].value + "'"; 
            
    }
    var ssn = $('#ssn').val();
    console.log("INSERT OR REPLACE INTO patient ("+ fieldStr +") VALUES ("+ fieldVals +")");
    var sql = "INSERT OR REPLACE INTO patient ("+ fieldStr +") VALUES ("+ fieldVals +")";
    tx.executeSql(sql);
}

function populateDBInput(tx) {
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

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function populateDBInput_success() {
  dbCreated = true;

  //globalSSN = getUrlVars()["ssn"];
  if($.mobile.pageData != null){
    console.log("globalSSN: "+$.mobile.pageData.ssn);
    if($.mobile.pageData.ssn != '')
      db.transaction(getPatientsBySSN, transaction_error, getPatientsBySSN_success);  
  }else
      $('#patientForm')[0].reset();
  db = null;
}



function getPatientsBySSN(ssn){
    if(db == null)
      db = window.openDatabase("ppsAndroid", "1.0", "PPS Android DB", 512000);
    db.transaction(
        function (tx){
            var sql = "select * from patient where personalDataSSN = " + $.mobile.pageData.ssn;
            tx.executeSql(sql, [], getPatientsBySSN_success);
        }, transaction_error);

}


function getPatientsBySSN_success(tx, results){
    var outputResult = (typeof(results) == 'undefined')?'null':results;
    if(outputResult != 'null'){
      console.log("getPatientsBySSN_success: "+outputResult);
      var len = results.rows.length; //should be 1;
      if(len > 0){
        for (var i=0; i<len; i++) {
            var patient = results.rows.item(i);
            populateForm(patient);
        }
      }
    }
    db = null;
}

function populateForm(patient){
    console.log("Populating Form");
    $('[name="personalDataMHNum"]').val(patient.personalDataMHNum);
    $('[name="personalDataFname"]').val(patient.personalDataFname);
    $('[name="personalDataLname"]').val(patient.personalDataLname);
    $('[name="personalDataSSN"]').val(patient.personalDataSSN);
    $('[name="personalDataBday"]').val(patient.personalDataBday);
    $('[name="personalDataAge"]').val(patient.personalDataAge);
    $('[name="personalDataGender"]').val(patient.personalDataGender);$('[name="personalDataGender"] option[value="'+patient.personalDataGender+'"]').attr('selected', 'selected');
    $('[name="personalDataAddress"]').val(patient.personalDataAddress);
    $('[name="personalDataCity"]').val(patient.personalDataCity);
    $('[name="fatherAlive"]').val(patient.fatherAlive); $('[name="fatherAlive"] option[value="'+patient.fatherAlive+'"]').attr('selected', 'selected'); // ('true' | 'false')
    $('[name="fatherCOD"]').val(patient.fatherCOD);
    (patient.fatherDBT == 1 )?$('[name="fatherDBT"]').attr('checked','checked'):$('[name="fatherDBT"]').removeAttr('checked');
    (patient.fatherHTA == 1 )?$('[name="fatherHTA"]').attr('checked','checked'):$('[name="fatherHTA"]').removeAttr('checked');
    (patient.fatherDislipedemia == 1 )?$('[name="fatherDislipedemia"]').attr('checked','checked'):$('[name="fatherDislipedemia"]').removeAttr('checked');
    (patient.fatherThyroid == 1 )?$('[name="fatherThyroid"]').attr('checked','checked'):$('[name="fatherThyroid"]').removeAttr('checked');
    (patient.fatherChagas == 1 )?$('[name="fatherChagas"]').attr('checked','checked'):$('[name="fatherChagas"]').removeAttr('checked');
    $('[name="fatherOthers"]').val(patient.fatherOthers);
    $('[name="motherAlive"]').val(patient.motherAlive); $('[name="motherfatherAlive"] option[value="'+patient.motherAlive+'"]').attr('selected', 'selected');// ('true' | 'false')
    (patient.motherDBT == 1 )?$('[name="motherDBT"]').attr('checked','checked'):$('[name="motherDBT"]').removeAttr('checked');
    (patient.motherHTA == 1 )?$('[name="motherHTA"]').attr('checked','checked'):$('[name="motherHTA"]').removeAttr('checked');
    (patient.motherDislipedemia == 1 )?$('[name="motherDislipedemia"]').attr('checked','checked'):$('[name="motherDislipedemia"]').removeAttr('checked');
    (patient.motherThyroid == 1 )?$('[name="motherThyroid"]').attr('checked','checked'):$('[name="motherThyroid"]').removeAttr('checked');
    (patient.motherChagas == 1 )?$('[name="motherChagas"]').attr('checked','checked'):$('[name="motherChagas"]').removeAttr('checked');
    $('[name="motherOthers"]').val(patient.motherOthers);
    (patient.personalMHDBT == 1 )?$('[name="personalMHDBT"]').attr('checked','checked'):$('[name="personalMHDBT"]').removeAttr('checked');
    (patient.personalMHHTA == 1 )?$('[name="personalMHHTA"]').attr('checked','checked'):$('[name="personalMHHTA"]').removeAttr('checked');
    (patient.personalMHDislipedemia == 1 )?$('[name="personalMHDislipedemia"]').attr('checked','checked'):$('[name="personalMHDislipedemia"]').removeAttr('checked');
    (patient.personalMHThyroid == 1 )?$('[name="personalMHThyroid"]').attr('checked','checked'):$('[name="personalMHThyroid"]').removeAttr('checked');
    (patient.personalMHChagas == 1 )?$('[name="personalMHChagas"]').attr('checked','checked'):$('[name="personalMHChagas"]').removeAttr('checked');
    (patient.personalMHArhythmia == 1 )?$('[name="personalMHArhythmia"]').attr('checked','checked'):$('[name="personalMHArhythmia"]').removeAttr('checked');
    $('[name="personalMHOthers"]').val(patient.personalMHOthers);
    $('[name="personalMHTreatment"]').val(patient.personalMHTreatment); // 'on'| 'off'
    $('[name="personalMHTreatDesc"]').val(patient.personalMHTreatdesc);
    $('[name="personalMHSmoking"]').val(patient.personalMHSmoking); // 'on'| 'off'
    $('[name="personalMHSmokeDay"]').val(patient.personalMHSmokeDay);
    $('[name="personalMHSmokeYears"]').val(patient.personalMHSmokeYears);
    $('[name="personalMHSmokeAbstinence"]').val(patient.personalMHSmokeAbstinence);
    $('[name="glycemiaSched"]').val(patient.glycemiaSched);
    $('[name="glycemiaFasting"]').val(patient.glycemiaFasting); // 'on'| 'off'
    $('[name="glycemiaVal"]').val(patient.glycemiaVal);
    $('[name="glycemiaLastmeal"]').val(patient.glycemiaLastmeal);
    $('[name="physicalActRecently"]').val(patient.physicalActRecently); // 'on'| 'off'
    (patient.physicalActRecentlyLeisure == 1 )?$('[name="physicalActRecentlyLeisure"]').attr('checked','checked'):$('[name="physicalActRecentlyLeisure"]').removeAttr('checked');
    (patient.physicalActRecentlyCompetition == 1 )?$('[name="physicalActRecentlyCompetition"]').attr('checked','checked'):$('[name="physicalActRecentlyCompetition"]').removeAttr('checked');
    $('[name="physicalActRecentlyDesc"]').val(patient.physicalActRecentlyDesc);
    $('[name="physicalActRecentlyFreq"]').val(patient.physicalActRecentlyFreq);
    $('[name="physicalActRecentlyHours"]').val(patient.physicalActRecentlyHours);
    $('[name="physicalActPrevious"]').val(patient.physicalActPrevious); // 'on'| 'off'
    (patient.physicalActPreviousLeisure == 1 )?$('[name="physicalActPreviousLeisure"]').attr('checked','checked'):$('[name="physicalActPreviousLeisure"]').removeAttr('checked');
    (patient.physicalActPreviousCompetition == 1 )?$('[name="physicalActPreviousCompetition"]').attr('checked','checked'):$('[name="physicalActPreviousCompetition"]').removeAttr('checked');
    $('[name="physicalActPreviousDesc"]').val(patient.physicalActPreviousDesc);
    $('[name="physicalActPreviousAgeIni"]').val(patient.physicalActPreviousAgeIni);
    $('[name="physicalActPreviousAgeEnd"]').val(patient.physicalActPreviousAgeEnd);
    $('[name="physicalActPreviousFreq"]').val(patient.physicalActPreviousFreq);
    $('[name="physicalActPreviousHours"]').val(patient.physicalActPreviousHours);
    $('[name="vitalSignsPulse"]').val(patient.vitalSignsPulse); // 'on'| 'off' -> Regular | Irregular
    $('[name="vitalSignsPulseFreq"]').val(patient.vitalSignsPulseFreq);
    $('[name="vitalSignsBloodPressureSistolic"]').val(patient.vitalSignsBloodPressureSistolic);
    $('[name="vitalSignsBloodPressureDiastolic"]').val(patient.vitalSignsBloodPressureDiastolic);
    $('[name="measuresSizeNum"]').val(patient.measuresSizeNum);
    $('[name="measuresWeight"]').val(patient.measuresWeight);
    $('[name="measuresWaist"]').val(patient.measuresWaist);
    $('[name="measuresIMC"]').val(patient.measuresIMC);
    $('[name="physicalExamInspection"]').val(patient.physicalExamInspection);
    $('[name="physicalExamHeartAuscultation"]').val(patient.physicalExamHeartAuscultation);
    $('[name="physicalExamMurmurs"]').val(patient.physicalExamMurmurs);// 'on'| 'off'
    $('[name="physicalExamMurmursDesc"]').val(patient.physicalExamMurmursDesc);
    $('[name="physicalExamPulmonarAuscultation"]').val(patient.physicalExamPulmonarAuscultation); /* Normal | Hallazgo */ // 'on'| 'off'
    $('[name="physicalExamPulmonarAuscultationDesc"]').val(patient.physicalExamPulmonarAuscultationDesc);
    
    $('input[type="checkbox"]').trigger('create');
    $('select.selectmenutrigger').trigger('create');
    $('select[data-role="slider"]').trigger('create');


    $('input[type="checkbox"]').checkboxradio('refresh');
    $('select.selectmenutrigger').selectmenu('refresh',true);
    $('select[data-role="slider"]').slider('refresh');
    initScript();
}

function toggleCOD(sel,number){
      var value = sel.options[sel.selectedIndex].value;
      if (value == "true")
        $('#div-cod-'+number).fadeOut();
      else
        $('#div-cod-'+number).fadeIn();
    }
    function toggleTreatment(sel){
      var value = sel.options[sel.selectedIndex].value;
      if (value == "on")
        $('#div-treatdesc').fadeIn();
      else
        $('#div-treatdesc').fadeOut();
    }
    function toggleTobacco(sel){
      var value = sel.options[sel.selectedIndex].value;
      if (value == "on")
        $('#div-tobacco-desc').fadeIn();
      else
        $('#div-tobacco-desc').fadeOut();
    }
    function toggleActivity(sel,kind){
      var value = sel.options[sel.selectedIndex].value;
      if (value == "on")
        $('#div-'+kind+'-desc').fadeIn();
      else
        $('#div-'+kind+'-desc').fadeOut();
    }
    function getAge(dateString) {
      console.log("getting age");
      var today = new Date();
      var birthDate = (typeof(dateString == 'string'))? new Date(dateString):new Date(dateString.value);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
      }
      $('#age').val(age);
      return age;
    }
    function getIMC(){
      var weight = new Number($('#weight').val());
      var tall = new Number($('#sizeNum').val());
      var result = 0;
      try{
        result = weight/(tall * tall);
      }catch(e){
        result = 0;
      }
      
      $('#imc').val(result);
    }

    //init script
    function initScript(){
      $('select[name*="Alive"]').each(
        function(index,element){
          toggleCOD(element,index+1);
          });
      toggleTreatment($('#personalMHTreatment')[0]);
      toggleTobacco($('#smoking')[0]);
      toggleActivity($('#recently')[0],'recently');
      toggleActivity($('#previous')[0],'previous');
      toggleActivity($('#murmurs')[0],'murmurs');
      toggleActivity($('#pulmonarAuscultation')[0],'pulmonarAuscultation'); 
      $('#created').val(new Date());

      $('.nativedatepicker').focus(function(event) {
          var currentField = $(this);
          var myNewDate = Date.parse(currentField.val()) || new Date();

          // Same handling for iPhone and Android
          window.plugins.datePicker.show({
              date : new Date(myNewDate),
              mode : 'date', // date or time or blank for both
              allowOldDates : true
          }, function(returnDate) {
              var newDate = new Date(returnDate);
              currentField.val((newDate.toISOString().split('T'))[0]);
              getAge(newDate);
              // This fixes the problem you mention at the bottom of this script with it not working a second/third time around, because it is in focus.
              currentField.blur();
          });
      });

      $('.nativetimepicker').focus(function(event) {
          var currentField = $(this);
          var time = currentField.val();
          var myNewTime = new Date();

          myNewTime.setHours(time.substr(0, 2));
          myNewTime.setMinutes(time.substr(3, 2));

          // Same handling for iPhone and Android
          plugins.datePicker.show({
              date : myNewTime,
              mode : 'time', // date or time or blank for both
              allowOldDates : true
          }, function(returnDate) {
            // returnDate is generated by .toLocaleString() in Java so it will be relative to the current time zone
              var newDate = new Date(returnDate);
              currentField.val(newDate.toString("HH:mm"));

              currentField.blur();
          });
      });

    }

    initScript();

    
    