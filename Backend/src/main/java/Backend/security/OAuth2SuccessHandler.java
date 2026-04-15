package Backend.security;

import Backend.model.User;
import Backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User =
                (OAuth2User) authentication.getPrincipal();
        String googleId = oAuth2User.getAttribute("sub");

        Optional<User> userOpt =
                userRepository.findByGoogleId(googleId);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String redirectUrl = String.format(
                "http://localhost:3000/oauth/callback" +
                "?id=%s&name=%s&email=%s&role=%s",
                user.getId(),
                user.getName().replace(" ", "%20"),
                user.getEmail(),
                user.getRole()
            );
            response.sendRedirect(redirectUrl);
        } else {
            response.sendRedirect(
                "http://localhost:3000/login?error=true"
            );
        }
    }
}