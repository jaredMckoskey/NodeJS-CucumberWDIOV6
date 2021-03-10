@demo
Feature: Google Demo Visual Regression Tests

  @imageCompareElement @LV
  Scenario: Google Logo Visual Regression Demo Test
    Given I go to the "Google Home Page" page
    Then I check the image of the "SEARCH_INPUT" on the page against the baseline image
