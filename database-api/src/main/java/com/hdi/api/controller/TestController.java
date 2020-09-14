package com.hdi.api.controller;


import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Patient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/Test")
public class TestController {
    @RequestMapping("/")
    String get(){
        //mapped to hostname:port/home/
        return "Hello from get";
    }
    @RequestMapping("/index")
    String index(){
        //mapped to hostname:port/home/index/
        return "Hello from index";
    }

    @RequestMapping("/patient")
    String patient(){
        //mapped to hostname:port/home/patient/
        Patient patient = new Patient();
        patient.addName().setFamily("Smith").addGiven("Rob").addGiven("Bruce");

        // Instantiate a new JSON parser
        FhirContext ctx = FhirContext.forDstu3();

        // Using XML instead
        String serialized = ctx.newXmlParser().encodeResourceToString(patient);
        System.out.println(serialized);

        return serialized;
    }

}
