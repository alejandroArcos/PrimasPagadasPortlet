/**
 * ========================== fechas Versiones a produccion ============================
 * >>>>>>>>> 01/11/2018
 */
package com.tokio.corizador.analitica.portlet.portlet;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.google.gson.Gson;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.servlet.SessionErrors;
import com.liferay.portal.kernel.servlet.SessionMessages;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.tokio.cotizador.CotizadorService;
import com.tokio.cotizador.Bean.Persona;
import com.tokio.cotizador.Bean.PrimaResponse;

@Component(
	immediate = true,
	property = {
		"com.liferay.portlet.display-category=category.sample",
		"com.liferay.portlet.instanceable=true",
		"javax.portlet.display-name=PrimasPagadasPortlet Portlet",
		"javax.portlet.init-param.template-path=/",
		"javax.portlet.init-param.view-template=/view.jsp",
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.security-role-ref=power-user,user",
		"javax.portlet.init-param.add-process-action-success-action=false",
		"com.liferay.portlet.requires-namespaced-parameters=false",
		"com.liferay.portlet.private-session-attributes=false"

	},
	service = Portlet.class
)
public class PrimaspagadasportletmvcportletPortlet extends MVCPortlet {
private static Log _log = LogFactoryUtil.getLog(PrimaspagadasportletmvcportletPortlet.class);
	
	@Reference
	CotizadorService _CotizadorService;
	
	@Override
	public void doView(RenderRequest renderRequest, RenderResponse renderResponse)
			throws IOException, PortletException {
		
		ThemeDisplay themeDisplay = (ThemeDisplay)renderRequest.getAttribute(WebKeys.THEME_DISPLAY);
		String usuario = themeDisplay.getUser().getFullName();
		String pantalla = "LOGIN";
		//Se manda 0 como si fuera un todos
		String agente = "0";
		Calendar cal= Calendar.getInstance();
		int year = cal.get(Calendar.YEAR);
		int month = cal.get(Calendar.MONTH);
		
		Map<Integer, String> meses = new HashMap<>();
		meses.put(1, "Enero");
		meses.put(2, "Febrero");
		meses.put(3, "Marzo");
		meses.put(4, "Abril");
		meses.put(5, "Mayo");
		meses.put(6, "Junio");
		meses.put(7, "Julio");
		meses.put(8, "Agosto");
		meses.put(9, "Septiembre");
		meses.put(10, "Octubre");
		meses.put(11, "Noviembre");
		meses.put(12, "Diciembre");
		
		PrimaResponse primaResp = null;
		
		try {
			primaResp = _CotizadorService.getPrimaPagada(year, month+1, agente, usuario, pantalla);
			Gson gson = new Gson();
			String stringJsonDatos = gson.toJson(primaResp.getDatosKPI());
			Gson gson2 = new Gson();
			String stringJsonDatosUSD = gson2.toJson(primaResp.getDatosKPIUSD());
			_log.info("grafica:" + stringJsonDatos);
			_log.info("grafica2:" + stringJsonDatosUSD);
			
			HttpServletRequest originalRequest = PortalUtil
					.getOriginalServletRequest(PortalUtil.getHttpServletRequest(renderRequest));

			List<Persona> persona = (List<Persona>) originalRequest.getSession().getAttribute("listaAgentes");
			renderRequest.setAttribute("listaAgente", persona);

			if( primaResp.getCode() !=0 ){
				renderRequest.setAttribute("errorMsg",  primaResp.getMsg() );
				SessionErrors.add(renderRequest, "errorConocido", primaResp.getMsg() );
			}

			
			renderRequest.setAttribute("stringJsonDatosPesos", stringJsonDatos);
			renderRequest.setAttribute("stringJsonDatosDolar", stringJsonDatosUSD);
		} catch (Exception e) {
			e.printStackTrace();
			SessionErrors.add(renderRequest, "errorDesconocido" );
		}finally {
			SessionMessages.add(renderRequest, PortalUtil.getPortletId(renderRequest) + SessionMessages.KEY_SUFFIX_HIDE_DEFAULT_ERROR_MESSAGE);
		}
		
		renderRequest.setAttribute("ano", year);
		renderRequest.setAttribute("mes", month+1);
		renderRequest.setAttribute("meses", meses);
		
		super.doView(renderRequest, renderResponse);	
	}
}