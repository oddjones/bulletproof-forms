

$(document).ready(function(){

	//Paging for wizard forms
	$('#rootwizard').bootstrapWizard();	

	//CONTROL SPECIFIC

	//DatePicker

	$( '.FORM_datepicker' ).pickadate({
	    onOpen: function() {
	        scrollPageTo( this.$node );
	    },
	    //selectYears: true,
	    selectMonths: true,
	    selectYears: 200,
	    format: 'dd/mm/yyyy'
	});
	$( '.FORM_timepicker').pickatime();

	function scrollPageTo( $node ) {
	    $( 'html, body' ).animate({
	        scrollTop: ~~$node.offset().top - 60
	    }, 150);
	}
});


//Event listeners

	//helper hover/focus behaviour

	$('.FORM_control-group').hover(
		function(){
			//does this control-group have a child FORM_helper?
			var myCtrl = ($(this).children().children()[0]);
			if($(myCtrl).parent().hasClass('FORM_helper')){

				$(myCtrl).parent().css('z-index',20);
			}
		},function(){
			var myCtrl = ($(this).children().children()[0]);
			if($(myCtrl).parent().hasClass('FORM_helper')){
				$(myCtrl).parent().css('z-index',10);
			}
		});

		$('.FORM_controls input, .FORM_controls textarea, .FORM_controls select').focusin(
		function(){
			//does this control-group have a child FORM_helper?
			var myCtrl = ($(this).closest('.FORM_control-group').children()[0]);
			if($(myCtrl).hasClass('FORM_helper')){
				$(myCtrl).css('z-index',20);
			}
		});

		$('.FORM_controls input, .FORM_controls textarea, .FORM_controls select').focusout(
		function(){
			//does this control-group have a child FORM_helper?
			var myCtrl = ($(this).closest('.FORM_control-group').children()[0]);
			if($(myCtrl).hasClass('FORM_helper')){
				$(myCtrl).css('z-index',10);
			}
		});






