//Imports
import {getAllCountries} from "./service/country.js";
import {getRowItem, getTableHeader} from "./markups/index.js";
import {getFilteredData, getVisibleData, loadState, saveState} from "./utils/helper.js";

//Elements
const $table = document.querySelector('table');
const $tableBody = document.createElement('tbody');
let $tableHead = getTableHeader();
$table.appendChild($tableHead);
const $inputValue = document.querySelector('.input');
const $paginationContainer = document.querySelector('.list');
const $loader = document.querySelector('.loader');
const $columns = document.querySelectorAll('.table__title');

//Initial state
let sorter = false;
let activeColumn = null;
const perPageData = 15;
let currentPage = 1;
let isPaginated = false;
let currentElement = null;
const countriesData = loadState('countries') || [];
const setIsPaginated = value => {
    isPaginated = value;

    return isPaginated;
}
const setCurrentPage = pageNumber => {
    currentPage = pageNumber;

    return currentPage;
}


async function getInitialData() {
    $loader.classList.remove('hide');
    const response  = await getAllCountries();
    $loader.classList.add('hide');

    const data  = response.map((item, index) => item?.name?.common ?
        ({
            id: index + 1,
            flag: item?.flags?.png,
            country: item?.name?.common,
            capital: Array.isArray(item?.capital) ? item?.capital[0] : '-',
            region: item?.region,
            population: item?.population,
            area: item?.area,
        }) : {});

    saveState('countries', data);
    render(data, currentPage, perPageData);
    getPages(data);

    return data;
}
function render(data, page, limit) {
    $tableBody.innerHTML = '';
    const visibleData = getVisibleData(data, page, limit);
    $table.append(getListOfTableBody(visibleData));

    return $table;
}

function getListOfTableBody(data) {
    data.map((item) => getRowItem(item))
        .forEach((el) => {
            $tableBody.appendChild(el);
        });

    return $tableBody;
}


function getPages(data) {
    $paginationContainer.innerHTML = '';

    for (let i = 1; i <= Math.ceil(data.length / perPageData); i++) {
        const $li = paginate(i);
        $li.addEventListener('click',  (event) => handlePagination(event, data, perPageData));
        $paginationContainer.appendChild($li);
    }

    return $paginationContainer;
}

//Handle functions
function paginate(page) {
    const $li = document.createElement('li');
    $li.setAttribute('data-page-number', page);
    $li.textContent = page;
    const isActivePage = currentPage === page ? 'list__active' : '';
    $li.className = `list__page ${isActivePage}`;

    if (isActivePage) currentElement = $li;

    return $li;
}


function handleSort(event, data, page, limit) {
    event.stopPropagation();
    const { sortField} = event.target.dataset;

    if (sortField) {
        if (activeColumn === sortField) {
            sorter = !sorter;
        }
        activeColumn = sortField;

        data.sort((a, b) => {
            if (a[activeColumn] > b[activeColumn]) return sorter ? -1 : 1;
            if(a[activeColumn] < b[activeColumn])  return sorter ? 1 : -1;

            return 0;
        });

        render(data, page, limit);

    }
}

function handleSearch(event, data, page, limit) {
    event.preventDefault();
    let searchValue = event.target.value.trim();

    if (searchValue === '' || isPaginated)  currentPage = 1;

    const filteredData = data => !searchValue ? data.map(item => item) : getFilteredData(data, searchValue);
    const filtered = filteredData(data);

    !filtered.length ? $tableHead.innerHTML = '' : $tableHead.innerHTML = getTableHeader().innerHTML;

    getPages(filtered);
    render(filtered, currentPage, limit);

}


function handlePagination(event, data, limit) {
    const pageNumber = Number(event.target.dataset.pageNumber);
    setCurrentPage(pageNumber);
    setIsPaginated(true);
    $tableBody.innerHTML = '';

    if (currentPage === pageNumber) {
        currentElement.classList.remove('list__active');
        event.target.classList.add('list__active');
        currentElement = event.target;
        currentElement.focus();
    }

   render(data, currentPage, limit);
}

//Listeners
document.addEventListener('DOMContentLoaded', getInitialData);

Array.from($columns).forEach($column => {
    $column.addEventListener('click', (event) => handleSort(event, countriesData, currentPage, perPageData));
});

if ($inputValue) {
    $inputValue.addEventListener('input', (event) => handleSearch(event, countriesData, currentPage, perPageData));
}
