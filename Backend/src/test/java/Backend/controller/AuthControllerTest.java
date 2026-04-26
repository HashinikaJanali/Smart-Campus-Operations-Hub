package Backend.controller;

import Backend.model.User;
import Backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OAuth2User oauth2User;

    @InjectMocks
    private AuthController authController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("google123", "John Doe", "john@test.com", null);
        testUser.setId("user1");
        testUser.setRole("USER");
    }

    @Test
    void getCurrentUser_returns401WhenPrincipalIsNull() {
        ResponseEntity<?> response = authController.getCurrentUser(null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isEqualTo("Not authenticated");
    }

    @Test
    void getCurrentUser_returnsUserWhenFoundByGoogleId() {
        when(oauth2User.getAttribute("sub")).thenReturn("google123");
        when(userRepository.findByGoogleId("google123")).thenReturn(Optional.of(testUser));

        ResponseEntity<?> response = authController.getCurrentUser(oauth2User);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(testUser);
    }

    @Test
    void getCurrentUser_returns404WhenGoogleIdNotInDatabase() {
        when(oauth2User.getAttribute("sub")).thenReturn("google_unknown");
        when(userRepository.findByGoogleId("google_unknown")).thenReturn(Optional.empty());

        ResponseEntity<?> response = authController.getCurrentUser(oauth2User);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getCurrentUser_returnsAdminUserCorrectly() {
        User adminUser = new User("googleAdmin", "Admin User", "admin@test.com", null);
        adminUser.setId("admin1");
        adminUser.setRole("ADMIN");

        when(oauth2User.getAttribute("sub")).thenReturn("googleAdmin");
        when(userRepository.findByGoogleId("googleAdmin")).thenReturn(Optional.of(adminUser));

        ResponseEntity<?> response = authController.getCurrentUser(oauth2User);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody())
            .isInstanceOf(User.class)
            .extracting(body -> ((User) body).getRole())
            .isEqualTo("ADMIN");
    }

    @Test
    void logout_returnsOkWithLoggedOutMessage() {
        ResponseEntity<?> response = authController.logout();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Logged out");
        verifyNoInteractions(userRepository);
    }
}
