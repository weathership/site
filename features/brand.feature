Feature: brand assets are served and consistent
  As a press contact, partner, or new visitor
  I want the brand assets surfaced on the public site to match the
  canonical source-of-truth files in brand/
  So that I can use them with confidence.

  Scenario: Mark SVG is reachable
    When I GET "/brand/logo/mark/mark.svg"
    Then the response status is 200
    And the response content type is "image/svg+xml"
    And the response body contains "<svg"

  Scenario: Color tokens are surfaced
    When I GET "/brand/colors/tokens.css"
    Then the response status is 200
    And the response body contains "--ws-ink"
    And the response body contains "--ws-paper"
    And the response body contains "--ws-sea"
    And the response body contains "--ws-storm"
    And the response body contains "--ws-sun"
    And the response body contains "--ws-fog"

  Scenario: Media-kit colors page renders every documented token
    When I GET "/media-kit/colors"
    Then the response status is 200
    And the response body contains "--ws-ink"
    And the response body contains "--ws-sea"
    And the response body contains "#0E1726"
    And the response body contains "#1E5F7A"

  Scenario: Media-kit logo page lists every variant in brand/logo/
    When I GET "/media-kit/logo"
    Then the response status is 200
    And the response body references every logo variant under brand/logo

  Scenario: OG image is reachable
    When I GET "/og.png"
    Then the response status is 200
    And the response content type is "image/png"

  Scenario: Press page exposes boilerplate copy
    When I GET "/media-kit/press"
    Then the response status is 200
    And the response body contains "weathership.org"
    And the response body contains "Founded in 2026"
