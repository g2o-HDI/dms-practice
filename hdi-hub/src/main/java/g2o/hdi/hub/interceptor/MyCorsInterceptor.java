package g2o.hdi.hub.interceptor;

import java.util.Arrays;

import org.springframework.web.cors.CorsConfiguration;

import ca.uhn.fhir.rest.server.interceptor.CorsInterceptor;

public class MyCorsInterceptor extends CorsInterceptor {

	public MyCorsInterceptor() {
		super(setupConfig());
	}

	private static CorsConfiguration setupConfig() {
		// Define your CORS configuration. This is an example
	      // showing a typical setup. You should customize this
	      // to your specific needs
	      CorsConfiguration config = new CorsConfiguration();
	      config.addAllowedHeader("x-fhir-starter");
	      config.addAllowedHeader("Origin");
	      config.addAllowedHeader("Accept");
	      config.addAllowedHeader("Authorization");
	      config.addAllowedHeader("X-Requested-With");
	      config.addAllowedHeader("Content-Type");

	      config.addAllowedOrigin("*");

	      config.addExposedHeader("Location");
	      config.addExposedHeader("Content-Location");
	      config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

	      return config;
	}

}
