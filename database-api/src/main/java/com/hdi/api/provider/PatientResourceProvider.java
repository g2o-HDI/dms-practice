package com.hdi.api.provider;

import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import com.hdi.api.database.OpenERMDatabase;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.instance.model.api.IBaseResource;

import java.util.List;

public class PatientResourceProvider implements IResourceProvider {

    OpenERMDatabase db;
    public PatientResourceProvider() {
        db = new OpenERMDatabase();
    }

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return Patient.class;
    }

    //To call: http://<host>:<port>/Patient/<ID>
    @Read()
    public Patient read(@IdParam IdType theId) {

        return db.retrievePatientByID(theId.getIdPart());
    }

    //To call: http://<host>:<port>/Patient?given=<First Name>&family=<Last Name>
    @Search()
    public List<Patient> searchByFullName(@RequiredParam(name = Patient.SP_GIVEN) StringParam givenName, @RequiredParam(name=Patient.SP_FAMILY) StringParam familyName) {

        return db.retrievePatientsByFullName(givenName.getValue(), familyName.getValue());

    }
    //To call: http://<host>:<port>/Patient?given=<First Name>
    @Search()
    public List<Patient> searchByFirstName(@RequiredParam(name = Patient.SP_GIVEN) StringParam givenName) {

        return db.retrievePatientsByFirstName(givenName.getValue());
    }
    //To call: http://<host>:<port>/Patient?family=<Last Name>
    @Search()
    public List<Patient> searchByFamilyName(@RequiredParam(name=Patient.SP_FAMILY) StringParam familyName) {

        return db.retrievePatientsByLastName(familyName.getValue());
    }
}
