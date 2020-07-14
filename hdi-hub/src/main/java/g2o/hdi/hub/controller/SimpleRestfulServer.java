package g2o.hdi.hub.controller;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.RestfulServer;
import ca.uhn.fhir.rest.server.interceptor.ResponseHighlighterInterceptor;
import g2o.hdi.hub.configuration.InterceptorConfiguration;
import g2o.hdi.hub.interceptor.MyAuthorizationInterceptor;
import g2o.hdi.hub.interceptor.MyCorsInterceptor;
import g2o.hdi.hub.provider.HospitalProvider;
import g2o.hdi.hub.provider.PatientProvider;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

@WebServlet("/*")
public class SimpleRestfulServer extends RestfulServer {

	private MyAuthorizationInterceptor authorizationInterceptor;

	@Override
	protected void initialize() throws ServletException {
		// Create a context for the appropriate version
		setFhirContext(FhirContext.forR4());

		// Register resource providers
		PatientProvider provider = new PatientProvider();
		registerProvider(provider);
		registerProvider(new HospitalProvider());
		AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(InterceptorConfiguration.class);
		authorizationInterceptor = context.getBean("myAuthorizationInterceptor", MyAuthorizationInterceptor.class);
		authorizationInterceptor.setProvider(provider);

		
		// Format the responses in nice HTML
		registerInterceptor(new ResponseHighlighterInterceptor());
		registerInterceptor(authorizationInterceptor);
		
		// enable CORS
		registerInterceptor(new MyCorsInterceptor());
	}
}
