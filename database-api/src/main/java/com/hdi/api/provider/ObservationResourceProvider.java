package com.hdi.api.provider;

import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.RequiredParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import com.hdi.api.database.OpenERMDatabase;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.instance.model.api.IBaseResource;

import java.util.List;

public class ObservationResourceProvider implements IResourceProvider {

    public ObservationResourceProvider() {    }

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return Observation.class;
    }

    //To call: http://<host>:<port>/Observation/<ID>
    @Read()
    public Observation read(@IdParam IdType theId) {

        OpenERMDatabase db = new OpenERMDatabase();
        return db.retrieveObservationByID(theId.getIdPart());
    }
    //To call: <HOST>:<PORT>>/Observation?code=<CodeSystem>~<Code>&Patient=<PatientId>
    @Search()
    public List<Observation> searchByCode(@RequiredParam(name = "Patient") IdType patientId, @RequiredParam(name=Observation.SP_CODE) StringParam observationCode) {

        OpenERMDatabase db = new OpenERMDatabase();
        String[] code =  observationCode.getValue().split("~");
        return db.retrieveObservationsByCode(patientId.getIdPart(),code[1]);
    }


}
