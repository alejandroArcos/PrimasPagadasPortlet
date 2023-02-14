<%@ include file="./init.jsp"%>

<link rel="stylesheet" href="<%=request.getContextPath()%>/css/export.css">

<portlet:resourceURL id="/analitica/obtieneGraficaPrimaPagadaPesos" var="obtieneGraficaPrimaPagadaPesos" />
<portlet:resourceURL id="/analitica/obtieneGraficaPrimaPagadaDolar" var="obtieneGraficaPrimaPagadaDolar" />


<liferay-ui:success key="consultaExitosa" message="cotizacion.exito" />
<liferay-ui:error key="errorConocido" message=" ${errorMsg}" />
<liferay-ui:error key="errorDesconocido" message="cotizacion.erorDesconocido" />


<div class="col-12 mt5">
	<c:set var="versionEntrega" scope="session" value="V=0.03" />

	<br />
	<h5>
		<liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloTabal" />
	</h5>
	<br />

	<div class="row linea">
		<div class="col-12">
			<form id="formObtieneGrafica" action="${obtieneGraficaPrimaPagadaPesos}" method="POST">
				<div class="row">
					<div class="col-sm-4">
						<div class="md-form form-group">
							<input type="text" id="anoFolio" class="form-control" name="ano" maxlength="4"> <label for="estatus"><liferay-ui:message
									key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloAno" /></label>
						</div>
					</div>
					<div class="col-sm-4">
						<div class="md-form form-group">
							<select name="estatus" class="mdb-select" id="mesGrafica">
								<option value="-1"><liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.selectOpDefoult" /></option>
								<option value="0">Todos</option>
								<c:set var="estatusAnterior" value="" />
								<c:forEach items="${meses}" var="estado">
									<option value="${estado.key}" ${estatusAnterior }>${estado.value}</option>
									<c:set var="estatusAnterior" value="" />
								</c:forEach>
							</select> <label for="estatus"><liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloMes" /></label>
						</div>
					</div>
					<div class="col-sm-4">
						<div class="md-form form-group">
							<select name="agente" class="mdb-select colorful-select dropdown-primary" id="listaAgente"
								searchable='<liferay-ui:message key="ModuloComisionesPortlet.buscar" />'>
								<c:if test="${fn:length(listaAgente) > 1}">
									<option value="0">Todos</option>
								</c:if>
								<c:set var="estatusAnterior" value="" />
								<c:forEach items="${listaAgente}" var="agente">
									<c:if test="${agente.idPersona == idAgente}">
										<c:set var="estatusAnterior" value="selected" />
									</c:if>
									<option value="${agente.idPersona}" ${estatusAnterior }>${agente.nombre}${agente.appPaterno} ${agente.appMaterno}</option>
									<c:set var="estatusAnterior" value="" />
								</c:forEach>
							</select> <label for="mes"><liferay-ui:message key="analiticaportlet_Analiticaportletmvcportlet.tituloAgente" /></label>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="row">
		<div class="col-sm-12">
			<div class="md-form form-group form_search btn_search">
				<button type="button" class="btn btn-blue pull-right" id="btn-actu" onclick="obtieneGraficaNueva();">
					<a> <liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloActualizar" />
					</a>
				</button>
			</div>
		</div>
	</div>

	<div class="row linea">
		<div class="col-md-12">
			<div class="progress-search progress primary-color-dark bar" style="display: none">
				<div class="indeterminate"></div>
			</div>
		</div>

		<!--graficas-->
		<div class="col-md-12">
			<div class="row container-fluid graficas divCharPesos" style="display: none">
				<div class="card col-sm-12">
					<div class="card-header primary-color white-text">
						<liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloTablaPesos" />
					</div>
					<div class="card-body">
						<div id="chartdiv2" style="width: 100%; height: 540px;"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="row container-fluid graficas divCharDolares" style="display: none">
				<div class="card col-sm-12">
					<div class="card-header primary-color white-text">
						<liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tituloTablaDolar" />
					</div>
					<div class="card-body">
						<div id="chartdiv4" style="width: 100%; height: 540px;"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

</div>

<div id="divAux" hidden>
	<!-- 	resourceURL -->
	<input type="hidden" id="txtJsGrafPrimaPagPesos" value="${obtieneGraficaPrimaPagadaPesos}"> <input type="hidden"
		id="txtJsGrafPrimaPagDolar" value="${obtieneGraficaPrimaPagadaDolar}">

	<!-- 	variables auxiliares -->
	<input type="hidden" id="stringJsonDatosPesos" value="${stringJsonDatosPesos}"> <input type="hidden" id="stringJsonDatosDolar"
		value="${stringJsonDatosDolar}"> <input type="hidden" id="tipoEntradaMsj"
		value="<liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.tipoEntrada" />"> <input type="hidden"
		id="RequeridoMsj" value="<liferay-ui:message key="primaspagadasportlet_Primaspagadasportletmvcportlet.Requerido" />">


	<!-- 	javascript -->
	<script src="<%=request.getContextPath()%>/js/primasPagadas.js?v=${versionEntrega}"></script>
</div>
