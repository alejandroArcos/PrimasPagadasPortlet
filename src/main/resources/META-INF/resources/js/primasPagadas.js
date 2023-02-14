$(document).ready(function() {
	
	var types = $('#stringJsonDatosPesos').val();

	var chart;
	var legend;
	var selected;

	function generateChartData() {
		var chartData = [];
		for (var i = 0; i < types.length; i++) {
			if (i == selected) {
				for (var x = 0; x < types[i].subs.length; x++) {
					chartData.push({
						type : types[i].subs[x].type,
						percent : types[i].subs[x].percent,
						color : types[i].color,
						pulled : true
					});
				}
			} else {
				chartData.push({
					type : types[i].type,
					percent : types[i].percent,
					color : types[i].color,
					id : i
				});
			}
		}
		return chartData;
	}

	
	var types = $('#stringJsonDatosDolar').val();

	var chart;
	var legend;
	var selected;

	function generateChartData() {
		var chartData = [];
		for (var i = 0; i < types.length; i++) {
			if (i == selected) {
				for (var x = 0; x < types[i].subs.length; x++) {
					chartData.push({
						type : types[i].subs[x].type,
						percent : types[i].subs[x].percent,
						color : types[i].color,
						pulled : true
					});
				}
			} else {
				chartData.push({
					type : types[i].type,
					percent : types[i].percent,
					color : types[i].color,
					id : i
				});
			}
		}
		return chartData;
	}
});
/* -------------------------------------------------------------------------------------------------------
 * ------------------------------------ fin del documend ready -------------------------------------------
 * -------------------------------------------------------------------------------------------------------
 */


$("#anoFolio").keyup(function() {
	var regex_numeros = /^[0-9]+$/;
	var tam = $("#anoFolio").val();
	
	$("div").remove(".alert.alert-danger");

	if (tam.match(regex_numeros)) {
		if (tam.length < 4) {
			$("#btn-actu").attr("disabled", "disabled");
		} else {
			$("#btn-actu").attr("disabled", false);
		}
	} else {
		$("#btn-actu").attr("disabled", "disabled");
		$("#anoFolio").parent().append(
			"<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>"
			+ " "
			+ $('#tipoEntradaMsj').val()
			+ "</div>");
	}
});

$("#mesGrafica").on('change', function() {
	$("div").remove(".alert.alert-danger");
});

function barraDeProgreso() {
	$('#btn-actu').prop("disabled", true);
	$('.bar').show();
	$('.graficas').hide();
	
}


function obtieneGraficaNueva() {
	
	$("div").remove(".alert.alert-danger");
	var anoBusqueda = $("#anoFolio").val();
	var mesBusqueda = parseInt($("#mesGrafica").val());
	var agente = $("#listaAgente").val();
	var hayError = false;
	
	
	if (valIsNullOrEmpty(anoBusqueda)) {
		hayError = true;
		$("#anoFolio").parent().append(
				"<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" + " "
				+ $('#RequeridoMsj').val() + "</div>");

	}
	if (mesBusqueda == -1) {
		hayError = true;
		$("#mesGrafica").parent().append(
				"<div class=\"alert alert-danger\" role=\"alert\"> <span class=\"glyphicon glyphicon-ban-circle\"></span>" + " "
				+ $('#RequeridoMsj').val() + "</div>");

	}
	
	if (!hayError) {
		
		barraDeProgreso();

		$.ajax({
			url : $('#txtJsGrafPrimaPagPesos').val(),
			type : 'POST',
			data : {
				mesBusqueda : mesBusqueda,
				anoBusqueda : anoBusqueda,
				agente : agente
			},
			success : function(data) {
				var DatoKPI = JSON.parse(data);
				var tieneDatos = false;
				
				if (valIsNullOrEmpty(DatoKPI)) {
					showMessageError('.navbar', 'Error al consultar la información', $( "div[id^='customAlert']" ).length);
				}
				
				$.each(DatoKPI, function(key, registro) {
				    
					if (registro.percent > 0){
						tieneDatos = true;
						return false;
				    }
				});
				
				if (tieneDatos){
					
					var types = DatoKPI;

					var chart;
					var legend;
					var selected;

					function generateChartData() {
						var chartData = [];
						for (var i = 0; i < types.length; i++) {
							if (i == selected) {
								for (var x = 0; x < types[i].subs.length; x++) {
									chartData.push({
										type : types[i].subs[x].type,
										percent : types[i].subs[x].percent,
										color : types[i].color,
										pulled : true
									});
								}
							} else {
								chartData.push({
									type : types[i].type,
									percent : types[i].percent,
									color : types[i].color,
									id : i
								});
							}
						}
						return chartData;
					}
					try{
						$('.divCharPesos').show();
						AmCharts.makeChart("chartdiv2", {
							"type" : "pie",
							"theme" : "light",

							"dataProvider" : generateChartData(),
							"labelText" : "[[title]]: [[value]]",
							"balloonText" : "[[title]]: [[value]]",
							"titleField" : "type",
							"valueField" : "percent",
							"outlineColor" : "#FFFFFF",
							"outlineAlpha" : 0.8,
							"outlineThickness" : 2,
							"colorField" : "color",
							"pulledField" : "pulled",
							"listeners" : [ {
								"event" : "clickSlice",
								"method" : function(event) {
									var chart = event.chart;
									if (event.dataItem.dataContext.id != undefined) {
										selected = event.dataItem.dataContext.id;
									} else {
										selected = undefined;
									}
									chart.dataProvider = generateChartData();
									chart.validateData();
								}
							},
							{
							    "event": "rendered",
							    "method": function(e) {
							    	showMessageSuccess(".navbar", "Exito al obtener la grafica de MXN", $( "div[id^='customAlert']" ).length);
							    	$('.bar').hide();
									$('#btn-actu').prop("disabled", false);
							    }
							  }],
							"export" : {
								"enabled" : true
							}
						});
					}  catch (err) {
						console.log(err);
						showMessageError('.navbar', 'Error al consultar la información', $( "div[id^='customAlert']" ).length);
						$('.bar').hide();
						$('.divCharPesos').hide();
						$('#btn-actu').prop("disabled", false);
					}
					
				}else{
					showMessageError('.navbar', 'Tabla pesos sin información', $( "div[id^='customAlert']" ).length);
					$('.bar').hide();
					$('.divCharPesos').hide();
					$('#btn-actu').prop("disabled", false);
				}
			}
		});

		$.ajax({
			url : $('#txtJsGrafPrimaPagDolar').val(),
			type : 'POST',
			data : {
				mesBusqueda : mesBusqueda,
				anoBusqueda : anoBusqueda,
				agente : agente
			},
			success : function(data) {
				
				var DatoKPI = JSON.parse(data);

				var tieneDatos = false;
				
				if (valIsNullOrEmpty(DatoKPI)) {
					showMessageError('.navbar', 'Error al consultar la información', $( "div[id^='customAlert']" ).length);
				}
				
				$.each(DatoKPI, function(key, registro) {
					if (registro.percent > 0){
						tieneDatos = true;
						return false;
				    }
				});
				
				
				if (tieneDatos){
					try{

						var types = DatoKPI;
	
						var chart;
						var legend;
						var selected;
	
						function generateChartData() {
							var chartData = [];
							for (var i = 0; i < types.length; i++) {
								if (i == selected) {
									for (var x = 0; x < types[i].subs.length; x++) {
										chartData.push({
											type : types[i].subs[x].type,
											percent : types[i].subs[x].percent,
											color : types[i].color,
											pulled : true
										});
									}
								} else {
									chartData.push({
										type : types[i].type,
										percent : types[i].percent,
										color : types[i].color,
										id : i
									});
								}
							}
							return chartData;
						}
					
						
					}catch (err) {
						console.log(err);
						showMessageError('.navbar', 'Error al consultar la información', $( "div[id^='customAlert']" ).length);
						$('.bar').hide();
						$('.divCharPesos').hide();
						$('#btn-actu').prop("disabled", false);
					}
					$('.divCharDolares').show();
					AmCharts.makeChart("chartdiv4", {
						"type" : "pie",
						"theme" : "light",

						"dataProvider" : generateChartData(),
						"labelText" : "[[title]]: [[value]]",
						"balloonText" : "[[title]]: [[value]]",
						"titleField" : "type",
						"valueField" : "percent",
						"outlineColor" : "#FFFFFF",
						"outlineAlpha" : 0.8,
						"outlineThickness" : 2,
						"colorField" : "color",
						"pulledField" : "pulled",
						"listeners" : [ {
							"event" : "clickSlice",
							"method" : function(event) {
								var chart = event.chart;
								if (event.dataItem.dataContext.id != undefined) {
									selected = event.dataItem.dataContext.id;
								} else {
									selected = undefined;
								}
								chart.dataProvider = generateChartData();
								chart.validateData();
							}
						},
						 {
						    "event": "rendered",
						    "method": function(e) {
						    	showMessageSuccess(".navbar", "Exito al obtener la grafica de Dolares", $( "div[id^='customAlert']" ).length);
						    	$('.bar').hide();
								$('#btn-actu').prop("disabled", false);
						    }
						  }
						],
						"export" : {
							"enabled" : true
						}
					});
				}else{
					showMessageError('.navbar', 'Tabla dolares sin información', $( "div[id^='customAlert']" ).length);
					$('.bar').hide();
					$('.divCharDolares').hide();
					$('#btn-actu').prop("disabled", false);
				}
			}
		});

	}else{
		$('.graficas').hide();
	}
}


function valIsNullOrEmpty(value) {
	if (value === undefined) {
		return true;
	}
	value = value.trim();
	return (value == null || value == "null" || value === "");
}