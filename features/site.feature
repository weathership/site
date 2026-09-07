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
    And the response body contains "Signals is the foundation"

  Scenario: News index lists the launch post
    When I GET "/news/"
    Then the response status is 200
    And the response body contains "Hello, weathership"

  Scenario: Projects index lists every project including preview entries
    When I GET "/projects/"
    Then the response status is 200
    And the response body contains "Signals"
    And the response body contains "Nautilus"
    And the response body contains "Aegir"
    And the response body contains "Gaius"
    And the response body contains "Reach"
    And the response body contains "SDG strategy"
    And the response body contains "Kvasir"
    And the response body contains "Vigil"

  Scenario: Kvasir project page renders
    When I GET "/projects/kvasir/"
    Then the response status is 200
    And the response body contains "Fragment-gated OWL reasoner"
    And the response body contains "github.com/zndx/kvasir"

  Scenario: SDG strategy project page renders
    When I GET "/projects/sdg-strategy/"
    Then the response status is 200
    And the response body contains "how it was made"
    And the response body contains "github.com/zndx/sdg-strategy"

  Scenario: Landing page surfaces Nautilus as a featured band and other active projects
    When I GET "/"
    Then the response status is 200
    And the response body contains "Signals"
    And the response body contains "Nautilus"
    And the response body contains "Aegir"
    And the response body contains "Gaius"
    And the response body contains "Reach"
    And the response body does not contain "Vigil"
    And the response body does not contain "SDG strategy"
    And the response body does not contain "Kvasir"

  Scenario: Nautilus project page renders
    When I GET "/projects/nautilus/"
    Then the response status is 200
    And the response body contains "Deterministic supervisor"
    And the response body contains "github.com/weathership/nautilus"

  Scenario: Signals project page covers OpenLineage and impala_fdw
    When I GET "/projects/signals/"
    Then the response status is 200
    And the response body contains "OpenLineage"
    And the response body contains "Marquez"
    And the response body contains "impala_fdw"

  Scenario: Integrations index lists Metabase first and the rest of the set
    When I GET "/integrations/"
    Then the response status is 200
    And the response body contains "Metabase"
    And the response body contains "Metaflow"
    And the response body contains "Marquez"
    And the response body contains "Hermes"
    And the response body contains "Miro"

  Scenario: Metabase integration page renders
    When I GET "/integrations/metabase/"
    Then the response status is 200
    And the response body contains "dashboard"
    And the response body contains "agpl-metabase"

  Scenario: Miro integration page is preview
    When I GET "/integrations/miro/"
    Then the response status is 200
    And the response body contains "mcp.miro.com"
    And the response body contains "preview"

  Scenario: Media-kit overview links to subpages
    When I GET "/media-kit/"
    Then the response status is 200
    And the response body contains "/media-kit/logo"
    And the response body contains "/media-kit/colors"
    And the response body contains "/media-kit/typography"
    And the response body contains "/media-kit/press"
