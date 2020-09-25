package com.hdi.api.database;

import org.hl7.fhir.dstu3.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class OpenERMDatabase {
    Connection con;


    final String sqlPatientFields = "id, title, language, financial, fname, lname, mname, DOB, street, postal_code, city, state, country_code, drivers_license, ss, phone_home, phone_biz,phone_cell";
    final String sqlObservationFields = "pResult.procedure_result_id, pResult.result, pResult.units, pResult.result_code, pReport.date_collected, pOrder.encounter_id, pOrder.date_ordered, pOrder.specimen_location, patient.id";
    HashMap<String, String[]> SystemDictonary = new HashMap<String,String[]>(); //Key = Code, value 1 = Display Text, value 2 = system
    public OpenERMDatabase(){
        connectDB();
        SystemDictonary.put("mg_dl", new String[]{"mg/dL", "http://unitsofmeasure.org"});
        SystemDictonary.put("2339-0", new String[]{"Glucose","http://loinc.org"});
    }


    public Patient retrievePatientByID(String id) {

        //Build SQL query and call Database
        String sql = String.format("SELECT %s FROM openemr.patient_data WHERE id = %s",sqlPatientFields,id);
        ResultSet result = DBSelect(sql);

        //Add query results to the Patient object
        Patient patient = buildPatient(result);

        //return Patient data
        return patient;

    }

    private Patient buildPatient(ResultSet result) {
        try{
            Patient patient = new Patient();
            while (result.next()) {
                //ID
                buildPatientID(patient, result);

                //Name
                buildPatientName(patient, result);

                //Language
                buildPatientLanguage(patient, result);

                //Date of Birth
                patient.setBirthDate(result.getDate("DOB"));

                //Address
                buildPatientAddress(patient, result);

                //Identifiers
                buildPatientIdentifiers(patient, result);

                //Phones
                buildPatientPhones(patient, result);
            }

            return patient;
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            return null;
        }
    }
    public void buildPatientID(Patient patient, ResultSet result) throws SQLException {
        Identifier ident = new Identifier();
        ident.setId(result.getString("id"));
        patient.addIdentifier(ident);
    }

    public void buildPatientName(Patient patient, ResultSet result) throws SQLException {
        patient.addName().setFamily(result.getString("lName"))
                .addGiven(result.getString("fname"))
                .addGiven(result.getString("mName"))
                .addPrefix(result.getString("title"));
    }

    public void buildPatientLanguage(Patient patient, ResultSet result) throws SQLException {
        //TODO: Fix this later. Data isn't being added to the database and need to add more coding elements depending on what the langauge is
        CodeableConcept langague = new CodeableConcept();
        langague.setText(result.getString("language"));
        patient.addCommunication().setLanguage(langague);
    }


    public void buildPatientAddress(Patient patient, ResultSet result) throws SQLException {
        patient.addAddress().setCity(result.getString("city")).addLine(result.getString("street")).setPostalCode(result.getString("postal_code"))
                .setState(result.getString("state")).setCountry(result.getString("country_code"));
    }
    public void buildPatientIdentifiers(Patient patient, ResultSet result) throws SQLException {
        CodeableConcept codeableConcept = new CodeableConcept();
        codeableConcept.setText("Social Security Number");
        codeableConcept.addCoding().setCode("SB").setDisplay("Social Security Number").setSystem("http://hl7.org/fhir/identifier-type");
        patient.addIdentifier().setSystem("http://hl7.org/fhir/sid/us-ssn").setType(codeableConcept).setValue(result.getString("ss"));

        codeableConcept = new CodeableConcept();
        codeableConcept.setText("Driver's License");
        codeableConcept.addCoding().setCode("DL").setDisplay("Driver's License").setSystem("http://hl7.org/fhir/v2/0203");
        patient.addIdentifier().setSystem("urn:oid:2.16.840.1.113883.4.3.25").setType(codeableConcept).setValue(result.getString("ss"));
    }
    public void buildPatientPhones(Patient patient, ResultSet result) throws SQLException {
        String phoneHome = result.getString("phone_home");
        String phoneBiz = result.getString("phone_biz");
        String phoneCell = result.getString("phone_cell");
        if (stringDoesExist(phoneHome)) {
            patient.addTelecom().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.HOME).setValue(phoneHome);
        }
        if (stringDoesExist(phoneBiz)) {
            patient.addTelecom().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.WORK).setValue(phoneHome);
        }
        if (stringDoesExist(phoneCell)) {
            patient.addTelecom().setSystem(ContactPoint.ContactPointSystem.PHONE).setUse(ContactPoint.ContactPointUse.MOBILE).setValue(phoneHome);
        }
    }

    private boolean stringDoesExist(String string) {
        return string != null && !string.equals("");
    }

    private void DBInsert(String sql) {
        Statement stt = null;
        try {
            stt = con.createStatement();
            stt.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private ResultSet DBSelect(String sql) {
        Statement stt = null;
        try {
            stt = con.createStatement();
            return stt.executeQuery(sql);

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void connectDB(){
        String url = "jdbc:mysql://localhost:3306/";

        String user = "openemr";
        String password = "openemr";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            con = DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Observation> retrieveObservationsByCode(String patientId, String code) {
        //Build SQL query and call Database
        String sql = String.format("SELECT %s FROM openemr.procedure_result pResult " +
                "JOIN openemr.procedure_report pReport on pReport.procedure_report_id = pResult.procedure_report_id " +
                "JOIN openemr.procedure_order pOrder ON pOrder.procedure_order_id = pReport.procedure_order_id " +
                "JOIN openemr.patient_data patient ON patient.pid = pOrder.patient_id WHERE patient.id = %s AND pResult.result_code = \"%s\"",sqlObservationFields,patientId,code);
        ResultSet result = DBSelect(sql);

        //Add query results to the Observation object
        List<Observation> observationList = buildObservations(result);

        //return Observation data
        return observationList;
    }

    public Observation retrieveObservationByID(String id) {
        //Build SQL query and call Database
        String sql = String.format("SELECT %s FROM openemr.procedure_result pResult " +
                "JOIN openemr.procedure_report pReport on pReport.procedure_report_id = pResult.procedure_report_id " +
                "JOIN openemr.procedure_order pOrder ON pOrder.procedure_order_id = pReport.procedure_order_id " +
                "JOIN openemr.patient_data patient ON patient.pid = pOrder.patient_id WHERE pResult.procedure_result_id = %s",sqlObservationFields,id);
        ResultSet result = DBSelect(sql);

        //Add query results to the Observation object
        try {
            result.next();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        Observation observation = buildObservation(result);

        //return Observation data
        return observation;
    }

    private List<Observation> buildObservations(ResultSet result) {
        try{
            List<Observation> observationList = new ArrayList<Observation>();

            while (result.next()) {
                observationList.add(buildObservation(result));
            }

            return observationList;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    private Observation buildObservation(ResultSet result) {
        try {
            Observation observation = new Observation();

            //Set the observation type
            String resultCode = result.getString("pResult.result_code");
            observation.addCategory().addCoding().setCode("laboratory").setDisplay("laboratory").setSystem("http://hl7.org/fhir/observation-category");
            CodeableConcept cc = new CodeableConcept();
            cc.setText(SystemDictonary.get(resultCode)[0]).addCoding().setCode(resultCode).setDisplay(SystemDictonary.get(resultCode)[0]).setSystem(SystemDictonary.get(resultCode)[1]);
            observation.setCode(cc);

            //Set Encounter ID
            Reference reference = new Reference();
            reference.setReference("Encounter/" + result.getString("pOrder.encounter_id"));
            observation.setContext(reference);

            //Set Patient ID
            reference = new Reference();
            reference.setReference("Patient/" + result.getString("patient.id"));
            observation.setSubject(reference);


            //Set Dates
            DateTimeType dateTimeType = new DateTimeType();
            observation.setEffective(dateTimeType.setValue(result.getDate("date_collected")));
            observation.setIssued(result.getDate("date_ordered"));

            //Set ID
            observation.setId(result.getString("pResult.procedure_result_id"));

            //Set Results
            Quantity quantity = new Quantity();
            String units = result.getString("pResult.units");
            String[] test = SystemDictonary.get(units);
            quantity.setCode(SystemDictonary.get(units)[0]).setSystem(SystemDictonary.get(units)[1]).setUnit(SystemDictonary.get(units)[0]).setValue(result.getLong("pResult.result"));
            observation.setValue(quantity);

            return observation;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }



}
