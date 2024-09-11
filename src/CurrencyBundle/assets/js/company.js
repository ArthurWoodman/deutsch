window.onload = function() {
    const backdrop = document.getElementById('backdrop');
    const currencyList =  document.querySelector('.currency_list');
    const addCurrencyButton = document.getElementById('add_currency');
    const addModal = document.getElementById('add-modal');
    const successAddCurrencyButtonClick = addModal.querySelector('.btn--success');
    const closeAddCurrencyButtonClick = addModal.querySelector('.btn--passive');
    const userInputs = addModal.querySelectorAll('input'); // there can be several inputs
    const deleteModal = document.getElementById('delete-modal');

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
        const title = userInputs[0].value;

        if (
            title.trim() === ''
        ) {
            return null;
        }

        fetch('https://iss.moex.com/iss/statistics/engines/currency/markets/selt/rates.json?iss.meta=off')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error, status = ' + response.status);
                }
                return response.json();
            })
            .then((json) => {
                const currency = {
                    id: Math.random(),
                    name: title,
                    value: json.cbrf.data[0][json.cbrf.columns.indexOf(`CBRF_${title}_LAST`)],
                    image: title.toLowerCase() == 'usd' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQZGZSkki8yc-W_oEbNrCmP0PwjedH6yNj9w&s' : 'https://www.shutterstock.com/image-illustration/euro-currency-sign-wireframe-digital-260nw-1349736422.jpg'
                }

                renderNewCurrencyElement(currency);
            })
            .catch((error) => {
                console.error(error);
            });


        addModalHideHandler();
        clearUserInputs();
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
        buttons[0].addEventListener('click', saveCurrencyProcedure.bind(null, currency, buttons[0]));
        buttons[1].addEventListener('click', updateCurrencyProcedure.bind(null, currency, buttons[1]));
        buttons[2].addEventListener('click', deleteCurrencyProcedure.bind(null, currency, buttons[2]));
        currencyList.append(newEl);
    }

    const saveCurrencyProcedure = async (currency, button) => {
        
    }

    const updateCurrencyProcedure = (currency, button) => {

    }

    const deleteCurrencyProcedure = async (currency, button) => {

    }

    addCurrencyButton.addEventListener('click', addCurrencyButtonClickHandler);
    closeAddCurrencyButtonClick.addEventListener('click', addModalHideHandler);
    successAddCurrencyButtonClick.addEventListener('click', successAddCurrencyButtonClickHandler);
    backdrop.addEventListener('click', backdropClickHandler);
}
