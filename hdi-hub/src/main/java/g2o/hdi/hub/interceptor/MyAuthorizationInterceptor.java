package g2o.hdi.hub.interceptor;

import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.server.exceptions.AuthenticationException;
import ca.uhn.fhir.rest.server.interceptor.auth.IAuthRule;
import ca.uhn.fhir.rest.server.interceptor.auth.RuleBuilder;
import com.auth0.jwt.JWT;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import g2o.hdi.hub.provider.PatientProvider;
import org.hl7.fhir.r4.model.IdType;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;


public class MyAuthorizationInterceptor extends ca.uhn.fhir.rest.server.interceptor.auth.AuthorizationInterceptor {

    //Query the email to a corresponding accessible patient record and tie that to the user

    @Value("#{'${users.admin}'.split(',')}")
    private List<String> admins;

    private PatientProvider provider;

    public MyAuthorizationInterceptor(){

    }

    public MyAuthorizationInterceptor(PatientProvider provider){
        this.provider = provider;
    }

    public void setProvider(PatientProvider provider){this.provider = provider;}

    public List<String> getAdmins() {
        return admins;
    }

    @Override
    public List<IAuthRule> buildRuleList(RequestDetails theRequestDetails) {

        // Process authorization header - The following is a fake
        // implementation. Obviously we'd want something more real
        // for a production scenario.
        //
        // In this basic example we have two hardcoded bearer tokens,
        // one which is for a user that has access to one patient, and
        // another that has full access.
        IdType userIdPatientId = null;
        boolean userIsAdmin = false;
        String e;

        String authHeader = theRequestDetails.getHeader("Authorization");

        String token = authHeader.replace("Bearer ", "");
        try {
            DecodedJWT jwt = JWT.decode(token);
            Claim claim = jwt.getClaim("preferred_username");
            e = claim.asString();
            //sub= jwt.toString();
        } catch (JWTDecodeException exception) {
            throw new AuthenticationException("Missing or invalid Authorization header value");
        }

        if (!admins.contains(e)) {

            Long id = provider.getByEmail(e);
            userIdPatientId = new IdType("Patient", id);

        } else if (admins.contains(e)) {
            // This user has access to everything
            userIsAdmin = true;
        } else {
            // Throw an HTTP 401
            throw new AuthenticationException("Missing or invalid Authorization header value");
        }


        // If the user is a specific patient, we create the following rule chain:
        // Allow the user to read anything in their own patient compartment
        // Allow the user to write anything in their own patient compartment
        // If a client request doesn't pass either of the above, deny it
        if (userIdPatientId != null && !userIdPatientId.equals("Patient/0")) {
            return new RuleBuilder()
                    .allow().read().allResources().inCompartment("Patient", userIdPatientId).andThen()
                    //.allow().read().allResources().inCompartment("Organization", userIdPatientId).andThen()
                    .allow().write().allResources().inCompartment("Patient", userIdPatientId).andThen()
                    .denyAll()
                    .build();
        }

        if(userIdPatientId != null && userIdPatientId.equals("Patient/0")){
            return new RuleBuilder()
                    .denyAll()
                    .build();
        }

        // If the user is an admin, allow everything
        if (userIsAdmin) {
            return new RuleBuilder()
                    .allowAll()
                    .build();
        }

        // By default, deny everything. This should never get hit, but it's
        // good to be defensive
        return new RuleBuilder()
                .denyAll()
                .build();
    }


}

