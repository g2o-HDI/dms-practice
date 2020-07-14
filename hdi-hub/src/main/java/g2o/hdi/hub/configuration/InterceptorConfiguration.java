package g2o.hdi.hub.configuration;


import g2o.hdi.hub.interceptor.MyAuthorizationInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("bearer.properties")
public class InterceptorConfiguration {

    @Bean
    MyAuthorizationInterceptor myAuthorizationInterceptor(){return new MyAuthorizationInterceptor();}
}
