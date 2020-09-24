package com.HDI.Yaml;

import com.HDI.Yaml.PatientDataConfiguration;
import com.HDI.Yaml.PatientDataListConfig;
import org.yaml.snakeyaml.TypeDescription;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.InputStream;


public class PatientDataLoadYAML {
    public PatientDataListConfig config;


    public PatientDataLoadYAML() {

        try (InputStream in = this.getClass().getClassLoader().getResourceAsStream("patient_data.yml")) {
            Constructor constructor = new Constructor(PatientDataListConfig.class);
            TypeDescription configDesc = new TypeDescription(PatientDataListConfig.class);
            configDesc.putListPropertyType("things", PatientDataConfiguration.class);
            constructor.addTypeDescription(configDesc);
            Yaml yaml = new Yaml(constructor);
            config = (PatientDataListConfig) yaml.load(in);

        } catch (Exception ex) {
            ex.printStackTrace();
        }


    }
}