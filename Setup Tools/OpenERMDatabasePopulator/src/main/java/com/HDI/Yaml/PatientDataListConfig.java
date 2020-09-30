package com.HDI.Yaml;

import com.HDI.Yaml.PatientDataConfiguration;

import java.util.List;

public final class PatientDataListConfig {

    private List<PatientDataConfiguration> patientData;

    public List<PatientDataConfiguration> getPatientData() {
        return patientData;
    }

    public void setPatientData(List<PatientDataConfiguration> patientData) {
        this.patientData = patientData;
    }
}
