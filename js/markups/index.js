//Imports
import {names} from "../utils/constant.js";

export const getRowItem = ({id, flag, country, capital, region, population, area}) => {
    const $row = document.createElement('tr');
    $row.innerHTML = `
        <td>${id}</td>
        <td>
            <img src=${flag} alt="Image"  width="30px">
        </td>
        <td>${country}</td>
        <td>${capital}</td>
        <td>${region}</td>
        <td>${population}</td>
        <td>${area}</td>
    `;

    return $row;
};


export const getTableHeader = () => {
    const $thead = document.createElement('thead');
    const $row = document.createElement('tr');

    names.forEach(name => {
        $row.innerHTML += `<th class="table__title" data-sort-field=${name !== 'flag' ? name : '' }>${name !== 'id' ? name : 'n'}</th>`;
    });
    $thead.appendChild($row);

    return $thead;

};

