# Affirm Takehome Writeup

#### How long did you spend working on the problem? How much time did you spend thinking about the design before writing your code?

I spent roughly three hours. The design was fairly straightforward, so I only had to do 5-10 mins of thinking and prep.

At first, I started making a CreditCardInput -- but then I realized I could use the same validation features for all of the inputs.

#### What are the UI/UX usability features you implemented, or thought about implementing? How do they help validate the user input?

As of right now, most of the UX is aimed at letting the user know quickly if the input is valid or not. Instead of two states, "error" and "ok", there are three states, "error", "ok", and "in progress". Having the green border around "OK" states lets the user know they no longer need to review that information to see if its in a proper format.

With more time, I would have added more features having to do with a11y to better serve users with screen readers.

#### What would a form submission/API payload of this look like? How would you deal with validation errors that may come from that API response?

The payload of the API should look something like...

```
{
  name,
  cardNum,
  cvv,
  month,
  year,
}
```

...and should be POSTed to a server that supports HTTPS, so as to avoid exposing users' credit card info to other computers on the network.

Validation errors are easy to deal with. Just have an intermediate state on the submit button ("Submitting", disabled, with a spinner, etc...) and expose the user to a properly formatted error message (possibly with a toast) if the response is not OK.

#### What are some styling and layout considerations for these types of form inputs?

Ease of use with a touchscreen is the name of the game here, so all of the inputs are nice and big with lots of padding. In addition, the box shadow on the fields gives the UI a modern feel.

#### Additional comments

I ran out of time, but the testing in `CreditCardForm.test.js` would need much expansion before this code is submittable. Also, the a11y of this form is not great (no aria labels, keyboard nav is not obvious, etc), but these are enhancements needed for production code, not a take home interview :)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
