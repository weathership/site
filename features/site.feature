Feature: weathership site smoke tests
  As an operator
  I want the public site to respond at expected paths
  So that I know the deployment is healthy.

  Scenario: Landing page renders
    When I GET "/"
    Then the response status is 200
    And the response body contains "weathership"

  Scenario: Worker health endpoint
    When I GET "/health"
    Then the response status is 200
    And the response body equals "ok\n"

  Scenario: Favicon resolves
    When I GET "/favicon.svg"
    Then the response status is 200
    And the response content type is "image/svg+xml"

  Scenario: About page renders
    When I GET "/about"
    Then the response status is 200
    And the response body contains "open-source AI entity"

  Scenario: News index lists the launch post
    When I GET "/news/"
    Then the response status is 200
    And the response body contains "Hello, weathership"

  Scenario: Projects index lists all three projects
    When I GET "/projects/"
    Then the response status is 200
    And the response body contains "Aegir"
    And the response body contains "Gaius"
    And the response body contains "stealth"

  Scenario: Media-kit overview links to subpages
    When I GET "/media-kit/"
    Then the response status is 200
    And the response body contains "/media-kit/logo"
    And the response body contains "/media-kit/colors"
    And the response body contains "/media-kit/typography"
    And the response body contains "/media-kit/press"
