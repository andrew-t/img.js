img.js
======

Make your Javascript look like an image.

The image must be a PNG. The output is a Javascript file that does the same thing as your code, but if an ASCII version of the image you provide. The image should be black and white.

Usage:

    node img.js [sourcefn] [imagefn]

Eg:

    node img.js example.js img/logo.png

How it Works
============

Javascript supports 'type coercion'. That is, a variable is treated as whatever kind of thing makes most sense. A few examples:

    // create a variable 'a'
    var a;
    
    if (a) {
        // this will not happen
    }
    
    // put an array in a
    a = [ 1, 2, 3 ];
    
    if (a) {
        // this will happen
    }
    
    var b = a[0] + a[1]; // b = 3 (a number)
    var c = a[0] + ' cat'; // c = '1 cat' (a string)

This is often really useful, but it means weird things can happen. If you forget to turn the string `'3'` into the number `3`, then adding one to it will produce `'31'`. Of course you can't subtract strings, so...

    var a = '1', b = 2;
    
    a + b; // returns '12'
    b + a; // returns '21'
    b - a; // returns '1'

You can see how this might cause confusion if you aren't careful.

So if instead of writing `'hello'`, we can create it in a more insane way. Let's start with the 'o'.

`{}` creates an 'empty object'. It can't be added, and doesn't like being turned into a number, so if you add an empty array, it turns both into strings and returns the result. The empty array becomes an empty string, so `{}+[]` results in `'[object Object]'` The second letter of this string is 'o', and we can pull it out by saying

    var a = {} + [];
    return a[1];

Of course that uses a lot of letters, so we can shorten it to `({}+[])[1]`. To get rid of the `1`, we get an object or array, and bitwise NOT it: `~{}`. Only numbers can bitwise NOT, so it takes the value of zero. Bitwise NOT of zero is a row of all ones, which happens to equal -1, so `-~{}` is the same as `1`. Therefore `'o'` can be written:

    ({}+[])[-~{}]

The 'l's are similarly easy to make:

    !{} // NOT object = false
    !{}+[] // plus array = 'false'
    !!{}-~[] // NOT NOT object minus bitwise NOT array = 2
    (!{}+[])[!!{}-~[]] // gives 'l'

And so on,

    -~[]<<!!{}-~[] // 4
    ({}+[])[-~[]<<!!{}-~[]] // 'false'[4] = 'e'

Unfortunately, there's not a simple Javascript object with an 'h' in its string representation. To get one, we need to turn the number 17 into a base-18 string:

    (17).toString(18) == 'h'

We're good at making numbers:

    -~{}|!![]<<(-~[]<<!!{}-~[]) == 17
    !!{}-~[]|!![]<<(-~[]<<!!{}-~[]) == 18

And it happens that Javascript lets us write `['property']` instead of `.property`, so we can write this as

    (17)['toString'](18)

and all we need to do is make 'toString', which doesn't have an 'h' in it, so how hard can that be?

    !!{}+[] == 'true'
    (!!{}+[]) == 't'

We've done 'o', but 'S' is tricky. To do that, we have to get a string constructor, whose string representation is `'function String() { [native code] }'`. We do that by saying `'some string'.constructor'`. That's

    ({}+[])['constructor']

for us, and now we have to write 'constructor', which doesn't have an 'h' or an 'S' in it, so is pleasingly easy to make:

    ({}+[])[!![]-(~[]<<!!{}-~[])] // the 'c' in 'object'
    ({}+[])[-~[]] // the 'o' from before
    ({}[{}]+[])[-~{}] // the 'n' from 'undefined', a Javascript keywork
    (!{}+[])[!!{}-~[]-~[]] // the 's' from 'false'
    (!![]+[])[+[]] // the 't' from 'true' again
    (!![]+[])[-~[]] // the 'r' from 'true'
    ({}[{}]+[])[+!{}] // the 'u' from 'undefined'
    // ...and so on.

So we can write 'constructor' as

    ({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]

and we can write 'S' as

    (([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[-~{}|!![]<<!!{}-~[]-~[]]

So let's finish 'toString'. We've done every letter except 'i' and 'g' already. There's an 'i' in undefined, so we can write that `({}[{}]+[])[!![]-(~[]<<!!{}-~[])]`. 'g' has to come out of `'function String() { [native code] }'` again, though, so it's written

    (([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[(!![]<<!!{}-~[]-~[])+~[]<<!!{}]

Meaning 'toString' is written

    ({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+({}+[])[-~[]]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[-~{}|!![]<<!!{}-~[]-~[]]+({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+(!![]+[])[-~[]]+({}[{}]+[])[!![]-(~[]<<!!{}-~[])]+({}[{}]+[])[-~{}]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[(!![]<<!!{}-~[]-~[])+~[]<<!!{}]

and 'h' is written

    (-~{}|!![]<<(-~[]<<!!{}-~[]))[({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+({}+[])[-~[]]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[-~{}|!![]<<!!{}-~[]-~[]]+({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+(!![]+[])[-~[]]+({}[{}]+[])[!![]-(~[]<<!!{}-~[])]+({}[{}]+[])[-~{}]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[(!![]<<!!{}-~[]-~[])+~[]<<!!{}]](!!{}-~[]|!![]<<(-~[]<<!!{}-~[]))

Finally we are ready to write 'hello':

    (-~{}|!![]<<(-~[]<<!!{}-~[]))[({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+({}+[])[-~[]]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[-~{}|!![]<<!!{}-~[]-~[]]+({}+[])[!!{}-~[]|-~[]<<!!{}-~[]]+(!![]+[])[-~[]]+({}[{}]+[])[!![]-(~[]<<!!{}-~[])]+({}[{}]+[])[-~{}]+(([]+[])[({}+[])[!![]-(~[]<<!!{}-~[])]+({}+[])[-~[]]+({}[{}]+[])[-~{}]+(!{}+[])[!!{}-~[]-~[]]+(!![]+[])[+[]]+(!![]+[])[-~[]]+({}[{}]+[])[+!{}]+({}+[])[!![]-(~[]<<!!{}-~[])]+(!![]+[])[+[]]+({}+[])[-~[]]+(!![]+[])[-~[]]]+[])[(!![]<<!!{}-~[]-~[])+~[]<<!!{}]](!!{}-~[]|!![]<<(-~[]<<!!{}-~[]))+({}+[])[-~[]<<!!{}-~[]]+(!{}+[])[!!{}-~[]]+(!{}+[])[!!{}-~[]]+({}+[])[-~[]]

## JSFuck

[JSFuck](https://github.com/aemkei/jsfuck) takes this a step further and uses only six symbols: `!`, `[`, `]`, `+`, `(` and `)` to write all strings. (I also used `-`, `~`, `{`, `}`, `<` and `>` but the principle is identical.) It happens that these symbols don't care if you put whitespace and linebreaks around them, meaning I can space them out to form pictures with no ill effects.

All of which means I can do [this](https://github.com/andrew-t/FallingBlocks/blob/face/js/main.js) and still have it run fine.
