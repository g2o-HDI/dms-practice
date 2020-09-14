package com.hdi.api.database;

import org.hl7.fhir.dstu3.model.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OpenERMDatabase {
    Connection con;

    public OpenERMDatabase(){
        connectDB();

    }

    public Patient retrievePatientByID(String id) {
        try {
            //Build SQL query and call Database
            final String sqlPatientFields = "id, title, language, financial, fname, lname, mname, DOB, street, postal_code, city, state, country_code, drivers_license, ss, occupation, phone_home, phone_biz, phone_contact, phone_cell";
            String sql = String.format("SELECT %s FROM openemr.patient_data WHERE id = %s",sqlPatientFields,id);
            ResultSet result = DBSelect(sql);

            //Add query results to the Patient object
            Patient patient = new Patient();
            while (result.next()) {
                //ID
                Identifier ident = new Identifier();
                ident.setId(result.getString("id"));
                patient.addIdentifier(ident);

                //Name
                patient.addName().setFamily(result.getString("lName"))
                        .addGiven(result.getString("fname"))
                        .addGiven(result.getString("mName"))
                        .addPrefix(result.getString("title"));

                //Language
                //TODO: Fix this later. Data isn't being added to the database and need to add more coding elements depending on what the langauge is
                CodeableConcept langague = new CodeableConcept();
                langague.setText(result.getString("language"));
                patient.addCommunication().setLanguage(langague);

                //Date of Birth

                //Address
                //patient.addAddress().setCity(result.getString("city")).addLine(result.getString("street")).setPostalCode(result.getString("postal_code"))
                //        .setState(result.getString("state")).setCountry(result.getString("country_code"))

            }

            //return Patient data
            return patient;

        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
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
}
