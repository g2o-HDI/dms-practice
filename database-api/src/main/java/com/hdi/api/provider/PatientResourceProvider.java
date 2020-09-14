package com.hdi.api.provider;

import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import com.hdi.api.database.OpenERMDatabase;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.instance.model.api.IBaseResource;

public class PatientResourceProvider implements IResourceProvider {

    public PatientResourceProvider() {    }

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return Patient.class;
    }

    @Read()
    public Patient read(@IdParam IdType theId) {

        OpenERMDatabase db = new OpenERMDatabase();
        return db.retrievePatientByID(theId.getIdPart());
    }


}
