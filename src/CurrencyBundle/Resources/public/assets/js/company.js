window.onload = function() {
    const backdrop = document.getElementById('backdrop');
    const currencyList =  document.querySelector('.currency_list');
    const addCurrencyButton = document.getElementById('add_currency');
    const addModal = document.getElementById('add-modal');
    const successAddCurrencyButtonClick = addModal.querySelector('.btn--success');
    const closeAddCurrencyButtonClick = addModal.querySelector('.btn--passive');
    const userInputs = addModal.querySelectorAll('input'); // there can be several inputs
    const deleteModal = document.getElementById('delete-modal');
    const deleteButtonsOnLoad = document.querySelectorAll('.delete_button');
    const updateButtonsOnLoad = document.querySelectorAll('.update_button');

    const addCurrencyButtonClickHandler = () => {
        addModal.classList.add('visible');
        toggleBackdrop();
    }

    const backdropClickHandler = () => {
        if (addModal.classList.contains('visible')) {
            addModal.classList.remove('visible');
        } else {
            deleteModal.classList.remove('visible');
        }
        toggleBackdrop();
    }

    const toggleBackdrop = () => {
        backdrop.classList.toggle('visible');
    }

    const addModalHideHandler = () => {
        addModal.classList.remove('visible');
        toggleBackdrop();
    }

    const successAddCurrencyButtonClickHandler = async () => {
        const title = userInputs[0].value.toUpperCase();

        if (
            title.trim() === ''
        ) {
            return null;
        }

        const handlerClosure = (json) => {
            const currency = {
                id: Math.random(),
                name: title,
                value: json.cbrf.data[0][json.cbrf.columns.indexOf(`CBRF_${title}_LAST`)],
                image: title.toLowerCase() == 'usd' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQZGZSkki8yc-W_oEbNrCmP0PwjedH6yNj9w&s'
                    : 'https://www.shutterstock.com/image-illustration/euro-currency-sign-wireframe-digital-260nw-1349736422.jpg'
            }

            renderNewCurrencyElement(currency);
        }

        callCurrencyAPI(handlerClosure);
        addModalHideHandler();
        clearUserInputs();
    }

    const callCurrencyAPI = (responseHandlerClosure, ...additionalParams) => {
        fetch('https://iss.moex.com/iss/statistics/engines/currency/markets/selt/rates.json?iss.meta=off')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error, status = ' + response.status);
                }
                return response.json();
            })
            .then((json) => {
                responseHandlerClosure(json, additionalParams);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const clearUserInputs = () => {
        for (const userInput of userInputs) {
            userInput.value = '';
        }
    }

    const renderNewCurrencyElement = (currency) => {
        const newEl = document.createElement('li');
        newEl.className = 'currency_element';
        newEl.innerHTML = `
            <img src="${currency.image}">
            <div class="currency_info">
                <h2>Title: ${currency.name}</h2>
                <h3>Price: ${currency.value}</h3>
            </div>
            <div class="controls">
                <button class="save_button">Save to server</button>
                <button class="update_button">Update Price</button>
                <button class="delete_button">Delete</button>
            </div>
        
        `;

        const buttons = newEl.querySelectorAll('button');
        buttons[0].addEventListener('click', saveCurrencyProcedure.bind(null, { currency: currency, button: buttons[0] }));
        buttons[1].addEventListener('click', updateCurrencyProcedure.bind(null, { currency: currency, button: buttons[1] }));
        buttons[2].addEventListener('click', deleteCurrencyProcedure.bind(null, {currency: currency, button: buttons[2]}));
        currencyList.append(newEl);
    }

    const saveCurrencyProcedure = async ({ currency, button }) => {
        const response = await fetch('http://localhost:8086/', {
            method: currency.update ? 'PATCH' : 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(currency)
        })

        if (response.status === 422 || response.status === 401) {
            return null;
        }

        if (!response.ok) {
            return new Response(
                JSON.stringify(
                    {message: 'Can not save a currency on the server!'},
                    {error: 500}
                ),
            );
        } else {
            if (response.status === 201 || response.status === 204) {
                button.remove();
            }
        }
    }

    const updateCurrencyProcedure = ({currency, button, event}) => {
        // here we need an URL that would be requesting updated data by currency (USD/EUR) but in this test ENV there is NO such API
        // so we make request and if the value is the same I would be adding a random number after a comma for representing purposes
        const responseHandlerClosure = (json, additionalParams) => {
            let [ currency, button, event ] = additionalParams;
            if (event) {
                const dataCurrency = JSON.parse(event.target.getAttribute('data-currency'));
                currency = {
                    name: dataCurrency.name,
                    value: dataCurrency.value
                };

                button = event.target;
            }

            const newValue = json.cbrf.data[0][json.cbrf.columns.indexOf(`CBRF_${currency.name}_LAST`)];
            const priceNode = button.closest('li').querySelector('h3');

            if (currency.value === newValue) {
                const newPrice = Math.ceil(currency.value) + Math.random();
                currency.value = newPrice.toPrecision(6);
                priceNode.innerHTML = `Price: ${currency.value}`;
            } else {
                currency.value = newValue;
                priceNode.innerHTML = `Price: ${newValue}`;
            }

            if (button.parentNode.children.length < 3) {
                const updatedCurrency = {...currency, update: 1};
                const newSaveButton = document.createElement('button');
                const deleteButton = button.parentNode.children[1];
                newSaveButton.className = 'save_button';
                newSaveButton.innerHTML = 'Save to server';
                newSaveButton.addEventListener('click', saveCurrencyProcedure.bind(null, updatedCurrency, newSaveButton));
                button.parentNode.prepend(newSaveButton);
                cloneButton(button, updatedCurrency, updateCurrencyProcedure)
                cloneButton(deleteButton, updatedCurrency, deleteCurrencyProcedure)
            } else {
                cloneButton(button.parentNode.children[0], currency, saveCurrencyProcedure);
            }
        }

        callCurrencyAPI(responseHandlerClosure, currency, button, event);
    }

    const cloneButton = (button, currency, procedure) => {
        const cloneButton = button.cloneNode(true);
        cloneButton.addEventListener('click', procedure.bind(null, { currency: currency, button: cloneButton }));
        button.replaceWith(cloneButton);
    }

    const deleteCurrencyProcedure = async ({ currency, button, event }) => {
        if (button && button.parentNode.children.length === 3 && !currency.update) {
            button.closest('li').remove();

            return;
        }

        let url = 'http://localhost:8086/';
        let body = null;

        if (!event) {
            url += 'currency';
            body = JSON.stringify({
                name: currency.name,
                value: currency.value
            });
        } else {
            url += event.target.getAttribute('data-currency');
            button = event.target;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            body: body
        });

        if (response.status === 422 || response.status === 401) {
            return null;
        }

        if (!response.ok) {
            return new Response(
                JSON.stringify(
                    {message: 'Can not save a currency on the server!'},
                    {error: 500}
                ),
            );
        } else {
            if (response.status === 204) {
                button.closest('li').remove();
            }
        }
    }

    if (deleteButtonsOnLoad) {
        for (const deleteButtonOnLoad of deleteButtonsOnLoad) {
            deleteButtonOnLoad.addEventListener('click', (event) => deleteCurrencyProcedure({ event: event }));
        }
    }

    if (updateButtonsOnLoad) {
        for (const updateButtonOnLoad of updateButtonsOnLoad) {
            updateButtonOnLoad.addEventListener('click', (event) => updateCurrencyProcedure({ event: event }));
        }
    }

    addCurrencyButton.addEventListener('click', addCurrencyButtonClickHandler);
    closeAddCurrencyButtonClick.addEventListener('click', addModalHideHandler);
    successAddCurrencyButtonClick.addEventListener('click', successAddCurrencyButtonClickHandler);
    backdrop.addEventListener('click', backdropClickHandler);
}
