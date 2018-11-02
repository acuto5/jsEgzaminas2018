printPeopleFromLt();
createOptions();
printSexCount();

$('#btn_show').on('click', showResult);
$('#country').on('change', function () {
    printPeople($(this).val())
});

function showResult() {
    let vardasObj = $('#vardas');
    let dataObj = $('#data');
    let vardas = vardasObj.val();
    let data = dataObj.val();
    $('#result').text('');
    vardasObj.removeClass('is-invalid');
    dataObj.removeClass('is-invalid');
    if (!vardas && !data) {
        addTagToResults('', 'Neįvestas vardas ir gimimo diena.');
    } else if (!vardas) {
        addTagToResults('', 'Neįvestas vardas.');
        vardasObj.addClass('is-invalid');
    } else if (!data) {
        addTagToResults('', 'Neįvesta data.');
        dataObj.addClass('is-invalid');
    } else if (!compareDates(data, new Date())) {
        addTagToResults('', 'Dar tik gims? Tuomet palauk dar...');
        dataObj.addClass('is-invalid');
    }
    if (vardas && data && compareDates(data, new Date())) {
        addTagToResults(vardas, '', '', '', '', 'h1');
        addTagToResults(data, 'Gimimo data: ');
        addTagToResults(getAge(data), 'Amžius: ', ' m.');
        let dayOfWeek = new Date(data).getDay();
        let daysPassed = dateDiffInDays(data, new Date());
        if (daysPassed > 0) {
            addTagToResults(lithuanianNamesOfWeekDay(dayOfWeek), 'Gimė ', daysPassed, ' prieš ', ' d.');
        } else {
            addTagToResults(lithuanianNamesOfWeekDay(dayOfWeek), 'Gimė šiandien (', '', ').' );
        }
        let dateObj = new Date(data);
        let month = dateObj.getMonth() + 1;
        let day = dateObj.getDate();
        addTagToResults(getZodiacSign(day, month), 'Zodiako ženklas: ');
        let famousPeople = getFamousPeople(day, month);
        if (famousPeople.length > 0) {
            let h = '';
            famousPeople.forEach(function (p) {
                h += `${p.vardas} ${p.pavarde}, `;
            });
            h = 'Žymūs žmonės gimę šią dieną: ' + h.slice(0, h.length - 2) + '.';
            addTagToResults(h);
        } else {
            addTagToResults('', 'Nėra žymių žmonių, gimusių šią dieną.');
        }
    }
}

function addTagToResults(data1, textBefore = '', data2 = '', textMiddle = '', textAfter = '', tag = 'p') {
    $('#result').append(`<${tag}>${textBefore}${data1}${textMiddle}${data2}${textAfter}</${tag}>`);
}

function getPeopleFromSelectedCountry(country = 'Lithuania') {
    return testData.filter(p => p.salis === country);
}

function printPeople(country) {
    let People = getPeopleFromSelectedCountry(country);
    let h = '<p>People from ' + country + ':</p>';
    People.forEach(function (p) {
        h += `${p.vardas} ${p.pavarde}(${p.salis}), `;
    });
    h = h.slice(0, h.length - 2) + '.';
    $('#peopleFromCountry').html(h);
}

function printPeopleFromLt() {
    let lithuanianPeople = getPeopleFromSelectedCountry();
    let h = '';
    lithuanianPeople.forEach(function (p) {
        h += `${p.vardas} ${p.pavarde}(${p.salis}), `;
    });
    h = h.slice(0, h.length - 2) + '.';
    $('#people').text(h);
}

function getFamousPeople(day, month) {
    return testData.filter(function (p) {
        return p.gimimoDiena.indexOf(month + '-' + day) > -1;
    });
}

function getAge(date) {
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }
    return age;
}

function dateDiffInDays(date1, date2) {
    let timeDiff = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}

function lithuanianNamesOfWeekDay(day) {
    let weekdays = [
        'pirmadienį',
        'antradienį',
        'trečiadienį',
        'ketvirtadienį',
        'penktadienį',
        'šeštadienį',
        'sekmadienį'
    ];
    return weekdays[day > 0? day - 1: 6];
}

function compareDates(date1, date2) {
    return new Date(date1) <= new Date(date2);
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}

function getCountries() {
    return testData
        .map(p => p.salis)
        .filter(unique)
        .sort();
}

function createOptions() {
    let countries = getCountries();
    let h = '<option value="" selected disabled>Pasirinkite valstybę</option>';
    countries.forEach(function (c) {
        h += `
            <option value="${c}">${c}</option>
        `;
    });
    $('#country').html(h);
}

function getSexCount(sex = 'male') {
    let sexCount = testData.filter(function (p) {
        return p.lytis === sex;
    });
    return sexCount.length;
}

function printSexCount() {
    $('#sex').html(`<p>Vyr.: ${getSexCount()}, mot.: ${getSexCount('female')}</p>` );
}