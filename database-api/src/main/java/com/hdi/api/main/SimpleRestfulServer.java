package com.hdi.api.main;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.server.RestfulServer;
import com.hdi.api.provider.PatientResourceProvider;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;

@WebServlet("/*")
public class SimpleRestfulServer extends RestfulServer{
    //Initialize
    @Override
    protected void initialize()throws ServletException{
        //create a context for the appropriate version
        setFhirContext(FhirContext.forDstu3());

        //Register Resource Providers
        registerProvider(new PatientResourceProvider());

    }
}