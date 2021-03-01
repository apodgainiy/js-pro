class TemplateReplacement {
    constructor() {
    }

    //элемент можно передать через querySelector или querySelectorAll
    //в зависимости от того, как был получен элемент
    //будет выполнятся соответсвующая обработка
    filter(element, regExp){
        //если элемент - получен через querySelector
        //то он не является nodeList, значит проверка длины нодлиста вернет undefined
        //выполняем замену свойства innerText для одного элемента
        if(!element.length){
            this._getFilter(element, regExp);
            return;
        }
        //если элемент - получен через querySelectorAll
        //то он является nodeList, значит имеет длину больше либо равно нулю
        //выполняем замену свойства innerText для каждого элемента
        if(element.length){
            element.forEach(elem =>
                this._getFilter(elem, regExp)
            );
        }
    }

    replace(element, regExp, newSubStr){
        //если элемент - получен через querySelector
        //то он не является nodeList, значит проверка длины нодлиста вернет undefined
        //выполняем замену свойства innerText для одного элемента
        if(element.length === undefined){
            this._getReplace(element, regExp, newSubStr);
            return;
        }
        //если элемент - получен через querySelectorAll
        //то он является nodeList, значит имеет длину больше либо равно нулю
        //выполняем замену свойства innerText для каждого элемента
        if(element.length){
            element.forEach(elem =>
                this._getReplace(elem, regExp, newSubStr)
            );
        }
    }

    //Метод выполняет замену текста на отфильтрованный текст
    _getFilter(element, regExp){
        element.innerText = element.innerText.match(regExp).join(' ');
    }

    _getReplace(element, regExp, newSubStr){
        element.innerText = element.innerText.replace(regExp, newSubStr);
    }
}

const replacement = new TemplateReplacement();
let element = document.querySelectorAll('p');

//replacement.filter(element, /d+/ig); //сначала сделал фильтр (оставляет только разрешенные символы). Просто затупил

/*
  //Можно менять в два захода
  replacement.replace(element, /'/ig, '"'); //43 matches, 86 steps(~1ms)
  replacement.replace(element, /(\b"\b)/ig, "'"); //9 matches, 122 steps(~0ms)
*/

/*
  //Можно использовать "или"
  replacement.replace(element, /(\B')|('\B)/ig, '"'); //34 matches, 215 steps(~1ms)

*/

/*
  //Если символ есть в начале строки 0 или 1 раз и если символ есть в конце строки 0 или 1 раз. Самый долгий способ.
  replacement.replace(element, /(\B')?('\B)?/ig, '"'); //652 matches, 7164 steps(~4ms)
*/

//Получается, что поменять в два захода - самый быстрый способ
document.querySelector('button').addEventListener('click', () => {
    replacement.replace(element, /'/ig, '"'); //43 matches, 86 steps(~1ms)
    replacement.replace(element, /(\b"\b)/ig, "'"); //9 matches, 122 steps(~0ms)
});