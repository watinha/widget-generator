var fs = require('fs'),
    mu = require('mu2'),
    App = {},
    seed = 20;

fs.readFile('themes.txt', (err, data) => {
    var themes = data.toString().split('\n')
                     .filter((el) => el.length !== 0);
    App._render(themes);
});

App = {
    _render: function (themes) {
        for (var i = 0; i < themes.length; i++) {
            (function () {
                for (var j = 0; j < seed; j++) {
                    var index = i, index2 = j, content, content2, html_stream;
                    content = App._generate_word(seed);
                    content2 = App._generate_content();
                    html_stream = mu.compileAndRender(
                        'templates/tooltip.html',
                        {theme: themes[i], content: content, content2: content2});
                    html_stream.pipe(
                        fs.createWriteStream(
                            `results/tooltip${index}-${index2}.html`));

                    html_stream = mu.compileAndRender(
                        'templates/menu.html',
                        {theme: themes[i], menu1: App._generate_menus(), menu2: App._generate_menus()});
                    html_stream.pipe(
                        fs.createWriteStream(
                            `results/menus${index}-${index2}.html`));
                };
            })();
        };
    },

    _generate_word: function (seed) {
        var str = "", words = Math.random() * seed,
            chars = "ABCDEFGHIJKLMNOPQRSTUVXWYZabcdefghijklmnopqrstuvxwyz0123456789 -+*&$%#@!";
        for (var i = 0; i < words; i++) {
            size = Math.random() * seed;
            for (var i = 0; i < size; i++) {
                str +=  chars.charAt(Math.round(Math.random() * chars.length));
            };
            str += " ";
        };
        return str;
    },

    _generate_menus: function () {
        var menus = Math.random() * seed,
            prior = false, aux = [];
        for (var i = 0; i < menus; i++) {
            var submenus = Math.max(Math.random() * seed, 2);
            if (Math.random() > 0.7)
                submenus = Math.random() * 40;
            aux.push({
                content: App._generate_word(10),
                submenu: [],
                multi: (submenus > 20),
                columns: (Math.floor(Math.random() * 10) * 2)
            });
            for (var j = 0; j < submenus; j++) {
                if (!prior || aux[i].multi || Math.random() > 0.5) {
                    aux[i].submenu.push({
                        content: App._generate_word(10)
                    });
                    prior = true;
                } else {
                    aux[i].submenu.push({
                        content: '-'
                    });
                    prior = false;
                }
            };
        };
        return aux;
    },

    _generate_content: function () {
        var width = Math.floor(Math.random() * 100 + 25),
            height = Math.floor(Math.random() * 100 + 25),
            width2 = Math.floor(Math.random() * width + 25),
            height2 = Math.floor(Math.random() * height + 25),
            padding_top = Math.floor(Math.random() * 100),
            padding_left = Math.floor(Math.random() * 100),
            padding_right = Math.floor(Math.random() * 100),
            padding_bottom = Math.floor(Math.random() * 100),
            red = Math.floor(Math.random() * 255),
            blue = Math.floor(Math.random() * 255),
            green = Math.floor(Math.random() * 255),
            css = "", css2 = "";
        css += `width: ${width}px;`;
        css += `height: ${height}px;`;
        css += `padding: ${padding_top}px ${padding_right}px ${padding_bottom}px ${padding_left}px;`;
        css2 += `width: ${width2}px;`;
        css2 += `height: ${height2}px;`;
        css2 += `background-color: rgb(${red},${green},${blue});`;
        return `<div style="${css}"><div style="${css2}"></div></div>`;
    }
};
