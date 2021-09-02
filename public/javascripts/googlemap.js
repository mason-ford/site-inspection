var map;
var markers = [];
const json = "./json";

$(document).ready(function () {

  $.getJSON(json, (result) => {
    var parsed = JSON.parse(result);
    $("#licenseTable").html(createLicenseTable(parsed));
    $.each(parsed, function (key, data) {
      addLicenseMarker(data);
    });
  });

  $('#formLicenseFilter').on('submit', function (e) {

    var licStatus = [];
    $("input:checkbox[name=licStatus]:checked").each(function(){
      licStatus.push($(this).val());
    });

    var formData = {
      licNumber: $('#licNumber').val().trim(),
      stnName: $('#stnName').val().trim(),
      chTxFreq: $('#chTxFreq').val().trim(),
      chRxFreq: $('#chRxFreq').val().trim(),
      licStatus: licStatus,
      licTags: $('#licTags').val().trim()
    };

    $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: 'json', // the url where we want to POST
      data: formData, // our data object
      dataType: 'json', // what type of data do we expect back from the server
      encode: true
    })
    .done(function (result) {
      deleteMarkers();
      var parsed = JSON.parse(result);
      $("#licenseTable").html(createLicenseTable(parsed));
      $.each(parsed, function (key, data) {
        addLicenseMarker(data);
      });
    });

    e.preventDefault();
  });

  $("#tableExport").click(function() {
    exportTableToCSV($("#tableLicense"), "CRESTLicenseExport.csv")
  });

  $("#formClear").click(function() {
    $("#formLicenseFilter").trigger("reset");
  });

  $("#licenseCardNavTable").click(function() {
    $("#licenseMap").hide();
    $("#licenseTableContainer").show();
    $('#licenseCardNavTable').addClass("active");
    $('#licenseCardNavMap').removeClass("active");
  });

  $("#licenseCardNavMap").click(function() {
    $("#licenseTableContainer").hide();
    $("#licenseMap").show();
    $('#licenseCardNavMap').addClass("active");
    $('#licenseCardNavTable').removeClass("active");
  });

});

$(document).on("click",".editLicense",function () {
  if($(this).text() === "Edit") {
    $(this).parent().children(".licenseToEdit").hide();
    $(this).parent().children(".licenseEdit").show();
    $(this).text("Save");
  } else if($(this).text() === "Save") {
    var number = $(this).parent().find(".licenseNumber").text();
    var status = $(this).parent().find(".licenseEditStatus option:selected").text();
    var tags = $(this).parent().find(".licenseEditTags").val();
    var comment = $(this).parent().find(".licenseEditComment").val();

    var data = {
      licenseNumber: number,
      status: status,
      tags: tags,
      comment: comment
    }

    var elem = $(this);
    $.ajax({
      type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url: 'update', // the url where we want to POST
      data: data, // our data object
      dataType: 'json', // what type of data do we expect back from the server
      encode: true
    })
    .done(function (result) {
      result = JSON.parse(result);
      console.log(result);
      if(result.n > 0) {
        updateMarkerIcon(number, status, tags);
        elem.parent().find(".licenseStatus").text(status);
        elem.parent().find(".licenseTags").text(tags);
        elem.parent().find(".licenseComment").text(comment);

        elem.parent().children(".licenseEdit").hide();
        elem.parent().children(".licenseToEdit").show();
        elem.text("Edit");
      } else {
        alert("Error");
      }
    });
  }
}); 

$(document).on("click",".cancelEdit",function () {
  $(this).parent().children(".licenseEdit").hide();
  $(this).parent().children(".licenseToEdit").show();
  $(this).siblings(".editLicense").text("Edit");
}); 

function addLicenseMarker(license) {
  for (let i = 0; i < license.station.length; i++) {
    if (license.station[i].type !== "ML") {

      var startDate = new Date(license.dateStart);
      var licenseTags = (typeof license.tags != "undefined" ? license.tags : "");
      var licenseComment = (typeof license.comment != "undefined" ? license.comment : "");

      var content = `<div><b>License:</b> <span class="licenseNumber">` + license.number + `</span></div>
                    <div class="licenseToEdit"><b>Status:</b> <span class="licenseStatus">`+ license.status + `</span></div>
                    <div class="licenseEdit" style="display: none;"><b>Status:</b>
                      <select class="licenseEditStatus">
                        <option value="Active" `+(license.status === "Active" ? "selected" : "")+`>Active</option>
                        <option value="Cancel" `+(license.status === "Cancel" ? "selected" : "")+`>Cancel</option>
                        <option value="Modify" `+(license.status === "Modify" ? "selected" : "")+`>Modify</option>
                        <option value="Investigate" `+(license.status === "Investigate" ? "selected" : "")+`>Investigate</option>
                        <option value="In Progress" `+(license.status === "In Progress" ? "selected" : "")+`>In Progress</option>
                        <option value="Archive" `+(license.status === "Archive" ? "selected" : "")+`>Archive</option>
                        <option value="Complete" `+(license.status === "Complete" ? "selected" : "")+`>Complete</option>
                        <option value="PagingSZ" `+(license.status === "PagingSZ" ? "selected" : "")+`>PagingSZ</option>
                        <option value="Temporary" `+(license.status === "Temporary" ? "selected" : "")+`>Temporary</option>
                      </select>
                    </div>
                    <div><b>Date:</b> `+ startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + `</div>
                    <div><b>Station:</b> `+ license.station[i].name + `</div>
                    <div><b>Type:</b> `+ license.station[i].type + `</div>
                    <div><b>Channels:</b> `+license.station[i].channel.length+`</div>`;
      content += `<br>`+frequencyTable(license.station[i])+`<br>`;
      content += `<div class="licenseToEdit"><b>Tags:</b><br><span class="licenseTags">`+licenseTags+`</span></div>
                  <div class="licenseEdit" style="display: none;"><b>Tags</b><br><input class="licenseEditTags" value="`+licenseTags+`" /></div>
                  <div class="licenseToEdit"><b>Comment:</b><br><span class="licenseComment">`+licenseComment+`</span></div>
                  <div class="licenseEdit" style="display: none;"><b>Comment</b><br><textarea class="licenseEditComment">`+licenseComment+`</textarea></div>`;
      content += `<span class="licenseEdit javaLink cancelEdit" style="display: none;">Cancel</span><span class="editLicense javaLink">Edit</span>`;
      var infowindow = new google.maps.InfoWindow({
        content: content
      });

      var latLng = new google.maps.LatLng(license.station[i].location.lat, license.station[i].location.long);
      latLng = checkDuplicateLatLong(latLng);
      var icon = returnGoogleMapsMarker(license.status, license.tags);
      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
          url: icon
        },
        customInfo: license.number
      });
      markers.push(marker);

      bindInfoWindow(marker, map, infowindow);
    }
  }
}

function checkDuplicateLatLong(latLng) {
  if(markers.length != 0) {
    for (i=0; i < markers.length; i++) {
        var existingMarker = markers[i];
        var pos = existingMarker.getPosition();
        if (latLng.equals(pos)) {
            var a = 360.0 / markers.length;
            var newLat = pos.lat() + -.00004 * Math.cos((+a*i) / 180 * Math.PI);  //x
            var newLng = pos.lng() + -.00004 * Math.sin((+a*i) / 180 * Math.PI);  //Y
            latLng = new google.maps.LatLng(newLat,newLng);
        }
    }
  }
  return latLng;
}

function bindInfoWindow(marker, map, infowindow) {
  marker.addListener('click', function () {
    infowindow.open(map, this);
  });
}

function createLicenseTable(licenses) {
  var returnHTML = `<table class="table table-striped" id="tableLicense">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>License Number</th>
                          <th>Date</th>
                          <th>Stations</th>
                          <th>Status</th>
                          <th>Tags</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>`;

  for(let i=0; i<licenses.length; i++) {
    var stations = "";
    for(let j=0; j<licenses[i].station.length; j++) {
      stations += "<div>"+licenses[i].station[j].name + " - " + licenses[i].station[j].type+"</div>";
    }

    var startDate = new Date(licenses[i].dateStart);
    var licenseTags = (typeof licenses[i].tags != "undefined" ? licenses[i].tags : "");
    var licenseComment = (typeof licenses[i].comment != "undefined" ? licenses[i].comment : "");

    returnHTML += `<tr>
                    <td>`+(i+1)+`</td>
                    <td>`+licenses[i].number+`</td>
                    <td>`+ startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate() + `</td>
                    <td>`+stations+`</td>
                    <td> `+ licenses[i].status + `</td>
                    <td> `+ licenseTags + `</td>
                    <td> `+ licenseComment + `</td>
                  </td>`;
  }

  returnHTML += `</tbody><table>`;
  return returnHTML;
};

function frequencyTable(station) {
  var freqTable = `<table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ERP (W)</th>
                        <th>Tx (MHz)</th>
                        <th>Rx (MHz)</th>
                      </tr>
                    </thead>
                    <tbody>`;
  for (let i = 0; i < station.channel.length; i++) {
    freqTable += '<tr><td>' + (i + 1) + '</td><td>';
    if (station.channel[i].txPower) {
      freqTable += Number(station.channel[i].txPower).toFixed(1);
    }
    freqTable += '</td><td>';
    if (station.channel[i].transmitter) {
      freqTable += Number(station.channel[i].transmitter.frequency) / 1000000;
    }
    freqTable += '</td><td>';
    if (station.channel[i].receiver) {
      freqTable += Number(station.channel[i].receiver.frequency) / 1000000;
    }
    freqTable += '</td></tr>';
  }
  freqTable += '</tbody></table>';

  return freqTable;
}

// Initialize and add the map
function initMap() {
  // The location of coverage
  const coverageCenter = { lat: 49.5, lng: -125.8 };
  // The map, centered at coverage
  map = new google.maps.Map(document.getElementById("licenseMap"), {
    zoom: 8,
    center: coverageCenter
  });
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function updateMarkerIcon(licenseNumber, status, tags) {
  for(let i=0; i<markers.length; i++) {
    if(markers[i].customInfo === licenseNumber) {
      markers[i].setIcon(returnGoogleMapsMarker(status, tags));
    }
  }
}

function returnGoogleMapsMarker(status, tags = "") {

  // https://sites.google.com/site/gmapsdevelopment/
  // http://www.googlemapsmarkers.com/v1/FF3399/
  const iconActive = "../images/icons/green.png";
  const iconActiveSite = "../images/icons/green-site.png";
  const iconCancel = "../images/icons/red.png";
  const iconCancelSite = "../images/icons/red-site.png";
  const iconModify = "../images/icons/yellow.png";
  const iconModifySite = "../images/icons/yellow-site.png";
  const iconInvestigate = "../images/icons/purple.png";
  const iconInvestigateSite = "../images/icons/purple-site.png";
  const iconInProgress = "../images/icons/lightblue.png";
  const iconInProgressSite = "../images/icons/lightblue-site.png";
  const iconArchive = "../images/icons/orange.png";
  const iconArchiveSite = "../images/icons/orange-site.png";
  const iconComplete = "../images/icons/blue.png";
  const iconCompleteSite = "../images/icons/blue-site.png";
  const iconPagingSZ = "../images/icons/pink.png";
  const iconPagingSZSite = "../images/icons/pink-site.png";
  const iconTemporary = "../images/icons/grey.png";
  const iconTemporarySite = "../images/icons/grey-site.png";
  const iconDefault = "../images/icons/white.png";

  var site = false;
  if(!Array.isArray(tags)) {
    tags = tags.split(",").map(function(item) {
      return item.trim();
    });
  }
  tags.forEach(tag => {
    if(tag === "Site") site = true;
  });

  switch(status) {
    case "Active":
      if(site) return iconActiveSite;
      else return iconActive;
    case "Cancel":
      if(site) return iconCancelSite;
      else return iconCancel;
    case "Modify":
      if(site) return iconModifySite;
      else return iconModify;
    case "Investigate":
      if(site) return iconInvestigateSite;
      else return iconInvestigate;
    case "In Progress":
      if(site) return iconInProgressSite;
      else return iconInProgress;
    case "Archive":
      if(site) return iconActiveSite;
      else return iconArchive;
    case "Complete":
      if(site) return iconCompleteSite;
      else return iconComplete;
    case "PagingSZ":
      if(site) return iconPagingSZSite;
      else return iconPagingSZ;
    case "Temporary":
      if(site) return iconTemporarySite;
      else return iconTemporary;
    default:
      return iconDefault;
  }
}

function exportTableToCSV($table, filename) {

  var $rows = $table.find('tr:has(td)'),

    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = String.fromCharCode(11), // vertical tab character
    tmpRowDelim = String.fromCharCode(0), // null character

    // actual delimiter characters for CSV format
    colDelim = '","',
    rowDelim = '"\r\n"',

    // Grab text from table into CSV formatted string
    csv = '"' + $rows.map(function(i, row) {
      var $row = $(row),
        $cols = $row.find('td');

      return $cols.map(function(j, col) {
        var $col = $(col),
          text = $col.text();

        return text.replace(/"/g, '""'); // escape double quotes

      }).get().join(tmpColDelim);

    }).get().join(tmpRowDelim)
    .split(tmpRowDelim).join(rowDelim)
    .split(tmpColDelim).join(colDelim) + '"';

  // Deliberate 'false', see comment below
  if (false && window.navigator.msSaveBlob) {

    var blob = new Blob([decodeURIComponent(csv)], {
      type: 'text/csv;charset=utf8'
    });

    // Crashes in IE 10, IE 11 and Microsoft Edge
    // See MS Edge Issue #10396033
    // Hence, the deliberate 'false'
    // This is here just for completeness
    // Remove the 'false' at your own risk
    window.navigator.msSaveBlob(blob, filename);

  } else if (window.Blob && window.URL) {
    // HTML5 Blob        
    var blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8'
    });
    var csvUrl = URL.createObjectURL(blob);

    $(this)
      .attr({
        'download': filename,
        'href': csvUrl
      });
  } else {
    // Data URI
    var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    $(this)
      .attr({
        'download': filename,
        'href': csvData,
        'target': '_blank'
      });
  }
}