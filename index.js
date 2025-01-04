const inputSearchElement = document.querySelector('#searchRepository');
const boxElement = document.querySelector('.autocom-box');
const clickElement = document.querySelector('.person-container');

const debounce = (fn, debounceTime) => {
    let timeoutId;
    return function (...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
        }, debounceTime);
    };
};

async function inputKey(e) {
    const inputValue = e.target.value;

    if (!inputValue.trim()) {
        boxElement.innerHTML = '';
        return;
    }
    const dataGet = await fetch(`https://api.github.com/search/repositories?q=${inputValue}`);
    const dataResult = await dataGet.json();

    boxElement.innerHTML = '';

    for (let i = 0; i < Math.min(5, dataResult.items.length); i++) {
        const { name } = dataResult.items[i];
        const listElement = document.createElement('button');
        listElement.textContent = name;
        listElement.classList.add('repo-button');
        listElement.dataset.index = i;
        boxElement.appendChild(listElement);
    }
}

boxElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('repo-button')) {
        const index = e.target.dataset.index;
        const inputValue = inputSearchElement.value;

        fetch(`https://api.github.com/search/repositories?q=${inputValue}`)
            .then((response) => response.json())
            .then((dataResult) => {
                const { name, stargazers_count, owner } = dataResult.items[index];
                clickElement.insertAdjacentHTML("afterbegin", `
                    <div class="person">
                    <p>Name: ${name} </p>
                    <p>Stars: ${stargazers_count} </p>
                    <p>Owner: ${owner.login} </p>
                    <div>
                    <button class="button-close">❌</button>
                    </div>
                    </div>
                `);
                inputSearchElement.value = '';
                boxElement.innerHTML = '';
            });
    }
});

document.onclick = (e) => {
    if (e.target.className === 'button-close') {
        const card = e.target.closest('.person');
        if (card) {
            card.remove();
        }
    }
};

inputSearchElement.onkeyup = debounce(inputKey, 400);