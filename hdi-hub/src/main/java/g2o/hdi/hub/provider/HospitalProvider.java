package g2o.hdi.hub.provider;

import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.hl7.fhir.r4.model.Address;
import org.hl7.fhir.r4.model.IdType;
import org.hl7.fhir.r4.model.Organization;
import java.util.*;
import java.util.stream.Collectors;

public class HospitalProvider implements IResourceProvider {

    private long myNextId = 1;

    private Map<Long, Organization> myHospitals = new HashMap<Long, Organization>();

    /**
     * Constructor
     */

    public HospitalProvider(){



//        Organization org = new Organization();
//
//        //org.addAddress(address);
//        org.setId("1");
//        org.addIdentifier().setSystem("\"https://www.ohiohealth.com/locations/hospitals/riverside-methodist-hospital/\"").setValue("7000");
//        org.setName("Riverside Methodist");
//
//        //Enumerated value to denote the address is physical as well as the mailing address.
//        //Mailing address is like a post box, use POSTAL for signaling the mailing address
//        //If it has a separate POSTAL enumartor, use PHYSICAL for the actual location
//        org.addAddress().setCountry("United States").setPostalCode("43214").setState("OH").setCity("Columbus")
//                .setType(Address.AddressType.BOTH).addLine("3535 Olentangy River Road").setUse(Address.AddressUse.BILLING);
//        myHospitals.put("1",org);

    }

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return Organization.class;
    }

    /**
     * Simple implementation of the "read" method
     */

    @Create()
    public MethodOutcome createOrg(@ResourceParam Organization org) {

        // Here we are just generating IDs sequentially
        long id = myNextId++;
        IdType newId = new IdType("Organization", Long.toString(id));
        org.setId(newId);

        myHospitals.put(id, org);
        myHospitals = myHospitals.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,(oldValue,newValue)->oldValue, LinkedHashMap::new));

        return new MethodOutcome(new IdType(id));
    }

    @Read()
    public Organization read(@IdParam IdType theId) {
        Organization retVal = myHospitals.get(Long.parseLong(theId.getIdPart()));
        if (retVal == null) {
            throw new ResourceNotFoundException(theId);
        }
        return retVal;
    }
    @Search
    public List<Organization> findOrgsUsingArbitraryCtriteria() {
        return myHospitals
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    @Delete
    public Organization delete(@IdParam IdType theId){
        Organization retVal = myHospitals.get(Long.parseLong(theId.getIdPart()));
        if (retVal == null) {
            throw new ResourceNotFoundException(theId);
        }
        return retVal;
    }
}
