@demo
Feature: Google Demo "Hello World" Tests

  @googleTest @LV
  Scenario Outline: Google Demo Test "<Search>"
    Given I go to the "Google Home Page" page
    When I enter "<Search>" into the "<Search Input>"

    Examples:
      | Search                                  | Search Input |
      | Hello World!                            | SEARCH_INPUT |
      | This is a Demo Test!                    | Search Input |
      | This is how a "Scenario Outline" works! | search input |
