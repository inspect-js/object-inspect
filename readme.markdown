# object-inspect

inspect objects in node and in the browser

# example

## browser

``` js
var inspect = require('object-inspect');

var d = document.createElement('div');
d.setAttribute('id', 'beep');
d.innerHTML = '<b>wooo</b><i>iiiii</i>';

console.log(inspect([ d, { a: 3, b : 4, c: [5,6,[7,[8,[9]]]] } ]));
```

output:

```
[ <div id="beep">...</div>, { a: 3, b: 4, c: [ 5, 6, [ 7, [ 8, [ ... ] ] ] ] } ]
```

## node
