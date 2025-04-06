import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        System.out.println("Configuring security filter chain");

        // Define public paths
        String[] publicPaths = new String[]{"/auth/hello", "/auth/welcome", "/auth/register", "/auth/login", "/eureka/**"};
        System.out.println("Configuring public paths: " + String.join(", ", publicPaths));
        
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.addAllowedOrigin("*");
                    config.addAllowedMethod("*");
                    config.addAllowedHeader("*");
                    return config;
                }))
                .authorizeExchange(exchanges -> {
                    System.out.println("Configuring authorization rules");
                    for (String path : publicPaths) {
                        System.out.println("Permitting all access to: " + path);
                        exchanges.pathMatchers(path).permitAll();
                    }
                    exchanges
                        .pathMatchers("/api/users/profile").authenticated()
                        .pathMatchers("/api/users/**").hasRole("ADMIN")
                        .anyExchange().authenticated();
                    System.out.println("Authorization rules configured");
                })
                .oauth2ResourceServer(oauth2 -> {
                    System.out.println("Configuring JWT authentication");
                    oauth2.jwt(jwt -> jwt
                        .jwkSetUri(issuerUri + "/protocol/openid-connect/certs")
                        .jwtAuthenticationConverter(grantedAuthoritiesExtractor()));
                })
                .build();
    }

    private Converter<Jwt, Mono<AbstractAuthenticationToken>> grantedAuthoritiesExtractor() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return new ReactiveJwtAuthenticationConverterAdapter(jwtAuthenticationConverter);
    }
}
