package Backend.service;

import Backend.model.User;
import Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class OAuth2UserService
        extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) {
        OAuth2User oAuth2User = super.loadUser(request);

        String googleId = oAuth2User.getAttribute("sub");
        String name     = oAuth2User.getAttribute("name");
        String email    = oAuth2User.getAttribute("email");
        String picture  = oAuth2User.getAttribute("picture");

        Optional<User> existing =
                userRepository.findByGoogleId(googleId);

        if (existing.isEmpty()) {
            userRepository.save(
                new User(googleId, name, email, picture)
            );
        } else {
            User user = existing.get();
            user.setName(name);
            user.setProfilePicture(picture);
            userRepository.save(user);
        }

        return oAuth2User;
    }
}