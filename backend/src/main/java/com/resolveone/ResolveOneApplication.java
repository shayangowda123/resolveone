package com.resolveone;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ResolveOneApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResolveOneApplication.class, args);
	}

}
