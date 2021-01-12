// grab the HTML elements we need to manipulate
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const paragraphOne = document.querySelector('#p1');
const paragarphTwo = document.querySelector('#p2');


weatherForm.addEventListener('submit', (e) => {
    /* 
       prevent the page from refreshing when the form is submitted 
       by calling this function on the event object created on form submission
    */
    e.preventDefault();

    // grab the value provided to the input element and concat it into the fetch call
    const location = search.value;

    p1.textContent = 'Loading...';
    p2.textContent = '';

    fetch('/weather?address=' + location).then( response => {
        response.json().then( data => {
            if (data.error) {
                p1.textContent = data.error;
                p2.textContent = '';
            } else {
                p1.textContent = data.location;
                p2.textContent = data.forecast;
            }
        })
    });
});