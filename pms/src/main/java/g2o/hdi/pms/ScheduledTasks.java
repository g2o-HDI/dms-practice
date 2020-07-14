package g2o.hdi.pms;

import java.time.LocalDate;

import org.hl7.fhir.instance.model.api.IIdType;
import org.hl7.fhir.r4.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.interceptor.BearerTokenAuthInterceptor;

@Component
public class ScheduledTasks {
	LocalDate ld = LocalDate.now();
	boolean buildHospital = false;
	Organization organization = new Organization();

	@Autowired
	RestTemplate restTemplate;

	private String token;

	@Scheduled(fixedRate = 5000)
	public void createPatient() {
		if (token == null)
			getToken();
		// Create a patient
		if(buildHospital == false){
			registerHospital();
		}
		Patient newPatient = buildPatient();

		// Create a client
		FhirContext ctx = FhirContext.forR4();
		IGenericClient client = ctx.newRestfulGenericClient("http://localhost:8080");

		//Registers the client interceptor taking in the JWT bearer token
		client.registerInterceptor(new BearerTokenAuthInterceptor(token));
		// Create the resource on the server
		
		MethodOutcome outcome = client.create().resource(newPatient).execute();

		// Log the ID that the server assigned
		IIdType id = outcome.getId();

		System.out.println("created is: " + id.getValue());

	}

	private Patient buildPatient() {
		Patient newPatient = new Patient();
		ld = ld.plusDays(1);
		// Populate the patient with fake information
		newPatient.addName().setFamily("DevDays" + ld.getDayOfMonth()).addGiven("John")
				.addGiven("Q" + ld.getDayOfWeek());
		newPatient.addIdentifier().setSystem("http://acme.org/mrn").setValue("1234567");
		newPatient.setGender(ld.getDayOfMonth() % 2 == 0 ? Enumerations.AdministrativeGender.MALE
				: Enumerations.AdministrativeGender.FEMALE);
		newPatient.setManagingOrganizationTarget(organization);
		newPatient.setBirthDateElement(new DateType(ld.toString()));
		return newPatient;
	}
	
	private void getToken() {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.add("Content-type", "application/x-www-form-urlencoded; charset=utf-8");

		MultiValueMap<String, String> map = new LinkedMultiValueMap();
		map.add("grant_type","password");
		map.add("client_id","EMR");
		map.add("username","mike@other.com");
		map.add("password","pass");
		map.add("scope","email profile openid");
		map.add("client_secret","EMRSecret");
	

		HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
		ResponseEntity<AuthServerResponseModel> m=restTemplate.postForEntity("http://localhost:8083/auth/realms/EMR/protocol/openid-connect/token",
				entity, AuthServerResponseModel.class);
		
		this.token="Bearer "+m.getBody().getAccess_token();
	}
	public void registerHospital(){

		organization.setName("Ohio Health");
		organization.addAddress()
				.addLine("123 Olentangy Street")
				.setCity("Columbus")
				.setState("OH")
				.setPostalCode("43215");
		buildHospital = true;
		// Create a client
		FhirContext ctx = FhirContext.forR4();
		IGenericClient client = ctx.newRestfulGenericClient("http://localhost:8080");

		//Registers the client interceptor taking in the JWT bearer token
		client.registerInterceptor(new BearerTokenAuthInterceptor(token));
		// Create the resource on the server

		MethodOutcome outcome = client.create().resource(organization).execute();

		// Log the ID that the server assigned
		IIdType id = outcome.getId();

		System.out.println("created is: " + id.getValue());

	}

}
