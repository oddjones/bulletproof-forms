/*
             _     _                     _             _                
            | |   | |                   | |           | |               
    __ _  __| | __| |_ __ ___  ___ ___  | | ___   ___ | | ___   _ _ __  
   / _` |/ _` |/ _` | '__/ _ \/ __/ __| | |/ _ \ / _ \| |/ / | | | '_ \ 
  | (_| | (_| | (_| | | |  __/\__ \__ \ | | (_) | (_) |   <| |_| | |_) |
   \__,_|\__,_|\__,_|_|  \___||___/___/ |_|\___/ \___/|_|\_\\__,_| .__/ 
                                                                 | |    
                                                                 |_|    

author: Dominic Jones: 
date: 27 Nov 2014
version: 1.0

User Enters postcode and looks up address.

Dummy webservice is pinged with postcode, returning JSON in the format

{
      "addresses": [
          {
              "uprn": "38169954##1",
              "address": "1 York Avenue, Liverpool, L17 2AS"
          },
          {
              "uprn": "38169955##2",
              "address": "2 York Avenue, Liverpool, L17 2AS"
          },
          {
              "uprn": "38169956##3",
              "address": "3 York Avenue, Liverpool, L17 2AS"
          }
      ]
  }

this is parsed into SELECT which is then displayed.
The option "*** MY ADDRESS ISN'T LISTED ***" is added to the select

selecting an address causes the SELECT to Validate (on change)


*/


$('.addLookupBtn').click(function(event){
  event.preventDefault();
  var controlGroup = $(this).closest($("div.FORM_control-group"));
  var postCode = controlGroup.find('input').val();
  
  if(postCode.length < 6){
    //invalid postcode message
    controlGroup.find('div.FORM_validationFeedback span').empty().append('Please enter a valid postcode');
    controlGroup.find('div.FORM_validationFeedback').show();
  }
  else
  {
    //clear invalid postcode validation
    controlGroup.find('div.FORM_validationFeedback span').empty();
    controlGroup.find('div.FORM_validationFeedback').hide();
    //proceed
    $(this).append("<span class='spinner'>&nbsp;&nbsp;<img src='/img/btnSpinner.gif' alt='fetching data'></span>");
    var ddDiv = $(this).next();
    var dropDown = ddDiv.find('select.addressLookup');
    var addressData = $.getJSON("/scripts/addressData.json",postCode,function(){
      ddDiv.removeClass('hidden');
    })
    .done(function(addressData){
      populateDropdown(addressData,dropDown);
    },stopSpinner)
    .fail(function(){
    })
  }
});

$('.addressLookup').on('change',function(){
  var selectedOption = $("option:selected", this).val();
  var controlGroup = $(this).closest($("div.FORM_control-group"));
  if(selectedOption =='oops'){
    controlGroup.find('div.addManual').show();
    controlGroup.find('.FORM_AM_postcode').append($('#postcode1').val());
  }
  else
  {
    $('div.addManual').hide();
    $(this).css({"width":"auto!important"});
  }
});

function populateDropdown(json,field){
  field.children().remove().end().append('<option selected value="0">Select your address</option>');
    $.each(json.addresses, function(){
      $(field).append('<option value="'+this.uprn+'">'+this.address+'</option>');
  });
  $(field).append('<option value="oops">*** MY ADDRESS ISN&apos;T LISTED ***</option>');
}

function stopSpinner(){

  $('span.spinner').remove();
  $('.addLookupBtn').addClass('disabled');
}


