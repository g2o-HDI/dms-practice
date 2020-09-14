package com.hdi.api.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    public ServletRegistrationBean ServletRegistrationBean(){
        ServletRegistrationBean registration=new ServletRegistrationBean(new SimpleRestfulServer(),"/*");
        registration.setName("FhirServlet");

        return registration;

    }
}