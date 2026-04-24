package Backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		// Load .env variables
		Dotenv dotenv = Dotenv.configure()
				.directory("./Backend") // Look in Backend directory (for root execution)
				.ignoreIfMissing()
				.load();
		
		// If not found in ./Backend, try root (for execution from within Backend)
		if (dotenv.get("MONGODB_URI") == null) {
			dotenv = Dotenv.configure()
					.directory("./")
					.ignoreIfMissing()
					.load();
		}

		// Set system properties for Spring Boot to pick up
		dotenv.entries().forEach(entry -> {
			System.setProperty(entry.getKey(), entry.getValue());
		});

		SpringApplication.run(BackendApplication.class, args);
	}

}
