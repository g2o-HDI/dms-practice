package com.HDI.main;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.parser.IParser;
import com.HDI.Yaml.PatientDataConfiguration;
import com.HDI.Yaml.PatientDataListConfig;
import com.HDI.Yaml.PatientDataLoadYAML;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.hl7.fhir.dstu3.model.ContactPoint;
import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Patient;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.Scanner;
import java.util.UUID;

import static java.time.format.DateTimeFormatter.ofPattern;

public class PopulateDB {

    static Scanner sc = new Scanner(System.in);

    public static void main(String[] args) {

        new PopulateDB();
    }

    public PopulateDB() {
        System.out.println("Enter '1' to populate the Database with the Yaml file or '2' to populate the Database with Synthea");
        Integer choice = Integer.parseInt(sc.next());
        if (choice == 1){
            PopulateDBWithYaml();
        }
        else if(choice == 2) {
            populateDBWithSynthea();
        }
    }

    private void PopulateDBWithYaml(){
        PatientDataLoadYAML patientDataYaml = new PatientDataLoadYAML();

        Connection con = connectDB();
        DBEmptyTable(con);
        String sql = convertYAMLtoSQL(patientDataYaml.config);
        DBInsert(con,sql);
        try {
            con.close();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    private void populateDBWithSynthea() {

        System.out.println("Enter the number for patients to retrieve:");
        Integer numPatients = Integer.parseInt(sc.next());

        Connection con = connectDB();
        DBEmptyTable(con);
        String response = callSyntheaForPatients(numPatients);
        JSONArray jsonEntryElement = new JSONArray();

        try{
            //convert String response to JSON object
            JSONParser parser = new JSONParser();
            JSONObject json = (JSONObject) parser.parse(response);
            jsonEntryElement = (JSONArray) json.get("entry");
        }catch (ParseException exception){
            exception.printStackTrace();
        }

        ArrayList<Patient> patientList = parsePatientsFromJSON(jsonEntryElement);

        String sql = buildSQLPatientInsert(patientList);

        DBInsert(con,sql);

        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private String buildSQLPatientInsert(ArrayList<Patient> patientList) {
        String sql = "INSERT INTO openemr.patient_data (title, language, fname, lname, DOB, street, postal_code, city, state, country_code, drivers_license, ss, phone_home, phone_biz, phone_cell, " +
                "  date, sex, email,pid)";
        sql +=  "  VALUES ";

        for (Patient record : patientList){
            sql +=  " ( '" + record.getName().get(0).getPrefix() + "','" + record.getLanguage() + "','" +
                    record.getName().get(0).getGiven() + "','" + record.getName().get(0).getFamily() + "','" + convertYAMLDateToDB(record.getBirthDate()) + "','" + record.getAddressFirstRep().getLine().get(0) +
                    "','" + record.getAddressFirstRep().getPostalCode() + "','" + record.getAddressFirstRep().getCity() + "','" + record.getAddressFirstRep().getState() + "','" + record.getAddressFirstRep().getCountry() + "','" +
                    searchForIdentifer(record,"Driver's License") + "','" + searchForIdentifer(record,"Social Security Number")  + "','" + searchForContact(record,"phone","home") + "','" +
                    searchForContact(record,"phone","work") + "','" + searchForContact(record,"phone","cell") + "','" + getCurrentDateTime() + "','" + record.getGender() + "','" +
                    searchForContact(record,"email","home") + "','" + generateUniqueId() + "') ,";
        }

        return sql.substring(0, sql.length() - 1);
    }

    private ArrayList<Patient> parsePatientsFromJSON(JSONArray jsonEntry) {
        ArrayList<Patient> patientList = new ArrayList<>();

        // Create HAPIFhir context and parser
        FhirContext ctx = FhirContext.forDstu3();
        IParser Iparser = ctx.newJsonParser();

        Patient patient;
        JSONObject resource;
        JSONObject jsonResource;
        for (int i =0; i <= jsonEntry.size()-1;i++) {
            resource = (JSONObject) jsonEntry.get(i);
            jsonResource = (JSONObject) resource.get("resource");

            patient = Iparser.parseResource(Patient.class, jsonResource.toJSONString());

            patientList.add(patient);
        }

        return patientList;
    }

    private String callSyntheaForPatients(Integer numPatients) {

        try {
            //Build and call Synthea
            HttpClient client = HttpClientBuilder.create().build();
            HttpGet request = new HttpGet(String.format("https://syntheticmass.mitre.org/v1/fhir/Patient?_count=%d&apikey=Nefg5ThMvGEXQKsfhDTKP6Sj3rPrDzNY",numPatients));
            HttpResponse response = client.execute(request);

            //BuildResponse
            BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
            String line = "";
            StringBuilder textView = new StringBuilder();
            while ((line = rd.readLine()) != null) {
                textView.append(line);
            }
            return textView.toString().replace("'", "\\'");

        } catch (IOException exception) {
            exception.printStackTrace();
            return null;
        }


    }

    private String convertYAMLDateToDB(Date date) {
        DateTimeFormatter formatter = ofPattern("EEE MMM d HH:mm:ss zz yyyy");
        return formatDateTime( LocalDateTime.parse(date.toString(), formatter));

    }

    private String getCurrentDateTime() {
        return formatDateTime(LocalDateTime.now());
    }

    private String formatDateTime(LocalDateTime now) {
        DateTimeFormatter dtf = ofPattern("yyyy/MM/dd HH:mm:ss");
        return now.format(dtf);
    }

    public static int generateUniqueId() {
        UUID idOne = UUID.randomUUID();
        String str=""+idOne;
        int uid=str.hashCode();
        String filterStr=""+uid;
        str=filterStr.replaceAll("-", "");
        return Integer.parseInt(str);
    }

    private String searchForContact(Patient record, String contactSystem, String searchValue) {
        for (ContactPoint contact :record.getTelecom() ) {
            if (contact.getSystem().equals(contactSystem) && contact.getUse().equals(searchValue)){
                return contact.getValue();
            }
        }
        return "";
    }

    private String searchForIdentifer(Patient record,String searchValue) {
        try{
            for (Identifier identifer :record.getIdentifier() ) {
                if (identifer.getType().getText().equals(searchValue)){
                    return identifer.getValue();
                }
            }
        } catch (NullPointerException e) {
            return "";
        }

        return "";
    }


    private void DBInsert(Connection con, String sql) {
        Statement stt = null;
        try {
            stt = con.createStatement();
            stt.execute(sql);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    private String convertYAMLtoSQL(PatientDataListConfig config) {
        String sql = "INSERT INTO openemr.patient_data (id, title, language, financial, fname, lname, mname, DOB, street, postal_code, city, state, country_code, drivers_license, ss, occupation, phone_home, phone_biz, phone_contact, phone_cell, pharmacy_id," +
                "  status, contact_relationship, date, sex, referrer, referrerID, providerID, ref_providerID, email, email_direct, ethnoracial, race, ethnicity, religion, interpretter, migrantseasonal, family_size, monthly_income, billing_note," +
                "  homeless, financial_review, pubpid, pid, genericname1, genericval1, genericname2, genericval2, hipaa_mail, hipaa_voice, hipaa_notice, hipaa_message, hipaa_allowsms, hipaa_allowemail, squad, fitness, referral_source, usertext1," +
                "  usertext2, usertext3, usertext4, usertext5, usertext6, usertext7, usertext8, userlist1, userlist2, userlist3, userlist4, userlist5, userlist6, userlist7, pricelevel, completed_ad, vfc, mothersname, guardiansname, allow_imm_reg_use," +
                "  allow_imm_info_share, allow_health_info_ex, allow_patient_portal, deceased_date, deceased_reason, cmsportal_login, care_team, county, industry, imm_reg_status, imm_reg_stat_effdate, publicity_code, publ_code_eff_date, protect_indicator," +
                "  prot_indi_effdate, guardianrelationship, guardiansex, guardianaddress, guardiancity, guardianstate, guardianpostalcode, guardiancountry, guardianphone, guardianworkphone, guardianemail)";
        sql +=  "  VALUES ";

        for (PatientDataConfiguration record: config.getPatientData()){

            sql +=  " ( " + record.getId() + ",'" + record.getTitle() + "','" + record.getLanguage() + "','" + record.getFinancial() + "','" +
                    record.getFname() + "','" + record.getLname() + "','" + record.getMname() + "','" + record.getDOB() + "','" + record.getStreet() +
                    "','" + record.getPostal_code() + "','" + record.getCity() + "','" + record.getState() + "','" + record.getCountry_code() + "','" +
                    record.getDrivers_license() + "','" + record.getSs() + "','" + record.getOccupation() + "','" + record.getPhone_home() + "','" +
                    record.getPhone_biz() + "','" + record.getPhone_contact() + "','" + record.getPhone_cell() + "'," + record.getPharmacy_id() +
                    ",'" + record.getStatus() + "','" + record.getContact_relationship() + "','" + record.getDate() + "','" + record.getSex() + "','" +
                    record.getReferrer() + "','" + record.getReferrerID() + "'," + record.getProviderID() + "," + record.getRef_providerID() + ",'" +
                    record.getEmail() + "','" + record.getEmail_direct() + "','" + record.getEthnoracial() + "','" + record.getRace() + "','" +
                    record.getEthnicity() + "','" + record.getReligion() + "','" + record.getInterpretter() + "','" + record.getMigrantseasonal() + "','" +
                    record.getFamily_size() + "','" + record.getMonthly_income() + "','" + record.getBilling_note() + "','" + record.getHomeless() + "','" +
                    record.getFinancial_review() + "'," + record.getPubpid() + "," + record.getPid() + ",'" + record.getGenericname1() + "','" +
                    record.getGenericval1() + "','" + record.getGenericname2() + "','" + record.getGenericval2() + "','" + record.getHipaa_mail() + "','" +
                    record.getHipaa_voice() + "','" + record.getHipaa_notice() + "','" + record.getHipaa_message() + "','" + record.getHipaa_allowsms() + "','" +
                    record.getHipaa_allowemail() + "','" + record.getSquad() + "'," + record.getFitness() + ",'" + record.getReferral_source() + "','" +
                    record.getUsertext1() + "','" + record.getUsertext2() + "','" + record.getUsertext3() + "','" + record.getUsertext4() + "','" +
                    record.getUsertext5() + "','" + record.getUsertext6() + "','" + record.getUsertext7() + "','" + record.getUsertext8() + "','" +
                    record.getUserlist1() + "','" + record.getUserlist2() + "','" + record.getUserlist3() + "','" + record.getUserlist4() + "','" +
                    record.getUserlist5() + "','" + record.getUserlist6() + "','" + record.getUserlist7() + "','" + record.getPricelevel() + "','"  +
                    record.getCompleted_ad() + "','"+ record.getVfc() + "','" + record.getMothersname() + "','"+ record.getGuardiansname() + "','" + record.getAllow_imm_reg_use() + "','" +
                    record.getAllow_imm_info_share() + "','" + record.getAllow_health_info_ex() + "','" + record.getAllow_patient_portal() + "','" + record.getDeceased_date() +
                    "','" + record.getDeceased_reason() + "','" + record.getCmsportal_login() + "'," + record.getCare_team() + ",'" + record.getCounty() + "','" +
                    record.getIndustry() + "','" + record.getImm_reg_status() + "','" + record.getImm_reg_stat_effdate() + "','"+ record.getPublicity_code() + "','" +
                    record.getPubl_code_eff_date() + "','"+ record.getProtect_indicator() + "','" + record.getProt_indi_effdate() + "','" + record.getGuardianrelationship() +
                    "','" + record.getGuardiansex() + "','" + record.getGuardianaddress() + "','" + record.getGuardiancity() + "','" + record.getGuardianstate() + "','" +
                    record.getGuardianpostalcode() + "','" + record.getGuardiancountry() + "','" + record.getGuardianphone() + "','" + record.getGuardianworkphone() +
                    "','"+ record.getGuardianemail() +"') ,";
        }
        sql = sql.substring(0, sql.length() - 1);
        return sql;
    }

    private void DBEmptyTable(Connection con) {
        Statement stt = null;
        try {
            stt = con.createStatement();
            stt.execute("DELETE FROM openemr.patient_data");
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
    }

    public Connection connectDB(){
        String url = "jdbc:mysql://localhost:3306/";
        String user = "openemr";
        String password = "openemr";

        try {
            Class.forName("com.mysql.cj.jdbc.Driver").newInstance();
            Connection con = DriverManager.getConnection(url, user, password);
            return con;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
