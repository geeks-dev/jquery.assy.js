jquery.assy.js
==============

jquery AutoSetSidenav for Bootstrap

Require jQuery UI

	<script src="path/to/js/jquery.min.js"></script>
	<script src="path/to/js/jquery-ui-1.9.1.custom.min.js"></script>
	<script src="path/to/js/jquery.assy.min.js"></script>
	
example

	var ass = $("#ass").assy({
							selectors: "h2, h3, h4",
							extendPage:false,
							scrollTo:50,
							navClass:"bs-sidenav"
						});
