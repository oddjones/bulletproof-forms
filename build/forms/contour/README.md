PLEASE NOTE
===========
This folder contains entire Umbraco Contour "plugin" folders.

Umbraco contour's form markup is configured by editing a number of files in the base umbraco/plugin/umbracoContour folder
these files are as follow:

*	/Views/form.cshtml: The base form constructor - if you want to edit the type of form (form-inline/form-horizontal) used by ALL FORMS in this site, then here you are.
*	/Views/FieldType.xxx: should be fairly self-explanatory - this is the code which renders each individual field type.

There are a number of custom controls which have been developed. They need to be updated across versions. The last update is to the Bootstrap 2 version (because this is being used for the contour project on Liverpool.gov.uk)

Obviously there's more than this - as you find out, add the information here!