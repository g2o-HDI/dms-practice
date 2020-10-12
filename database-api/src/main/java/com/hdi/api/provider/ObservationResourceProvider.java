package com.hdi.api.provider;

import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import com.hdi.api.database.OpenERMDatabase;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Observation;
import org.hl7.fhir.dstu3.model.OperationOutcome;
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

    @Create()
    public MethodOutcome createObservation(@ResourceParam Observation observation){
        // Save this patient to the database...
        OpenERMDatabase db = new OpenERMDatabase();
        String newObservationId = db.addNewObservation(observation);

        //return the new Id if success else return an error message
        MethodOutcome retVal = new MethodOutcome();
        if (newObservationId == null) {
            retVal.setId(new IdType("Observation", newObservationId, "1.0"));
            retVal.setCreated(true);
        }else {
            OperationOutcome outcome = new OperationOutcome();
            outcome.addIssue().setDiagnostics("An Error Occurred");
            retVal.setOperationOutcome(outcome);
            retVal.setCreated(true);
        }
        
        return retVal;
    }

}
