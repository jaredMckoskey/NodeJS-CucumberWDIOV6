@demo
Feature: tap|QA Navigation Demo Tests

  @tapQA @LV
  Scenario: tap|QA Demo Test
    Given I go to the "Google Home Page" page
    When I enter "tapQA" into the "SEARCH_INPUT"
    And I press the enter key in the "SEARCH_INPUT"
    And I take a screenshot
    And I click the "TAP_QA_LINK" on the page
    Then I am on the "tap QA Home Page" page
    When I click the "ABOUT_BUTTON" on the page
    Then I am on the "About Us Page" page
