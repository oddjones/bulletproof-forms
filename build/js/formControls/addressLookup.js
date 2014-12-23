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

Dummy webservice is pinged with postcode, "returning" JSON in the format

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

DATA HANDLING CONSIDERATIONS
============================

We have been asked to add the option to "Enter an address Manually" for people
who don't know their postcode - Obviously, addresses entered in this fashion will 
have no notion of a UPRN.

My first thought was to parse addresses returned by the gazetteer into the (hidden)
Manual address boxes for consistency of returned data, but I have been informed that
the address data hosted in the gazetteer isn't consistent enought to allow for this.

That said, it might be more appropriate to simply concatenate data entered into the
manual form into a comma separated string (as returned by the gazetteer) and store
that in a hidden field. 

Addresses selected from the SELECT box will also populate the same hidden field, but
will prepend the UPRN & a pipe. On submission, the data handler for the control can parse the
string to look for a UPRN in the first case

*/

function populateDropdown(json,field){
  field.children().remove().end().append('<option selected value="0">Select your address</option>');
    $.each(json.addresses, function(){
      $(field).append('<option value="'+this.uprn+'">'+this.address+'</option>');
  });
  $(field).append('<option value="oops">*** MY ADDRESS ISN&apos;T LISTED ***</option>');
}

function stopSpinner(){
  $('span.spinner').remove();
  $('.AL_addLookupBtn').addClass('disabled');
}

//listeners

$('.AL_addLookupBtn').click(function(event){
  event.preventDefault();
  var controlGroup = $(this).closest($("div.FORM_control-group"));
  var postCode = controlGroup.find('input').val();
  controlGroup.find('.AL_manualPrompt').hide();
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
    var ddDiv = controlGroup.find('.AL_addLookup');
    var dropDown = ddDiv.find('select.AL_addDropDown');

    //DUMMY LOOKUP - Replace with REAL Address lookup.

    $.getJSON("/scripts/addressData.json",postCode,function(){
      ddDiv.removeClass('hidden');
    })

    // don't forget the callback(!)

    .done(function(addressData){
      populateDropdown(addressData,dropDown);
    },stopSpinner)
    .fail(function(){
    });
  }
});

$('.addressLookup').on('change',function(){
  var selectedVal = $("option:selected", this).val();
  var selectedOption = $("option:selected",this).html();
  var controlGroup = $(this).closest($("div.FORM_control-group"));
  if(selectedVal =='oops'){
    controlGroup.find('.AL_postcode').hide();
    controlGroup.find('.AL_addLookupBtn').hide();
    controlGroup.find('div.addManual').show();
    controlGroup.find('.AL_AM_postcode').val($(controlGroup.find('.AL_postcode')).val());
    controlGroup.find('.AL_AM_add1').focus();
  }
  else
  {
    //store address in hidden field
    controlGroup.find('.AL_address').val(selectedVal+'|'+selectedOption);
    //show selected address
    $('div.addManual').hide();
    $(controlGroup.find('.AL_address')).css({"width":"100%"});
  }
});

$('.AL_noPostcode').click(function(event){
  event.preventDefault();
  $(this).hide();
  var controlGroup = $(this).closest($("div.FORM_control-group"));
  controlGroup.find('.AL_postcode').hide();
  controlGroup.find('.AL_addLookupBtn').hide();
  controlGroup.find('div.addManual').show();
  controlGroup.find('.AL_AM_add1').focus();
});
