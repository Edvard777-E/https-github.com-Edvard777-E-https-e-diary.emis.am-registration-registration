!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.i18nextBrowserLanguageDetector = t()
}(this, function() {
    "use strict";
    function e(e) {
        return a.call(i.call(arguments, 1), function(t) {
            if (t)
                for (var o in t)
                    void 0 === e[o] && (e[o] = t[o])
        }),
        e
    }
    function t() {
        return {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
            lookupQuerystring: "lng",
            lookupCookie: "i18next",
            lookupLocalStorage: "i18nextLng",
            caches: ["localStorage"]
        }
    }
    var o = {};
    o.classCallCheck = function(e, t) {
        if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function")
    }
    ,
    o.createClass = function() {
        function e(e, t) {
            for (var o = 0; o < t.length; o++) {
                var n = t[o];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(e, n.key, n)
            }
        }
        return function(t, o, n) {
            return o && e(t.prototype, o),
            n && e(t, n),
            t
        }
    }();
    var n = []
      , a = n.forEach
      , i = n.slice
      , r = {
        create: function(e, t, o, n) {
            var a = void 0;
            if (o) {
                var i = new Date;
                i.setTime(i.getTime() + 60 * o * 1e3),
                a = "; expires=" + i.toGMTString()
            } else
                a = "";
            n = n ? "domain=" + n + ";" : "",
            document.cookie = e + "=" + t + a + ";" + n + "path=/"
        },
        read: function(e) {
            for (var t = e + "=", o = document.cookie.split(";"), n = 0; n < o.length; n++) {
                for (var a = o[n]; " " === a.charAt(0); )
                    a = a.substring(1, a.length);
                if (0 === a.indexOf(t))
                    return a.substring(t.length, a.length)
            }
            return null
        },
        remove: function(e) {
            this.create(e, "", -1)
        }
    }
      , u = {
        name: "cookie",
        lookup: function(e) {
            var t = void 0;
            if (e.lookupCookie && "undefined" != typeof document) {
                var o = r.read(e.lookupCookie);
                o && (t = o)
            }
            return t
        },
        cacheUserLanguage: function(e, t) {
            t.lookupCookie && "undefined" != typeof document && r.create(t.lookupCookie, e, t.cookieMinutes, t.cookieDomain)
        }
    }
      , c = {
        name: "querystring",
        lookup: function(e) {
            var t = void 0;
            if ("undefined" != typeof window)
                for (var o = window.location.search.substring(1), n = o.split("&"), a = 0; a < n.length; a++) {
                    var i = n[a].indexOf("=");
                    if (i > 0) {
                        var r = n[a].substring(0, i);
                        r === e.lookupQuerystring && (t = n[a].substring(i + 1))
                    }
                }
            return t
        }
    }
      , l = void 0;
    try {
        l = "undefined" !== window && null !== window.localStorage;
        var s = "i18next.translate.boo";
        window.localStorage.setItem(s, "foo"),
        window.localStorage.removeItem(s)
    } catch (g) {
        l = !1
    }
    var f = {
        name: "localStorage",
        lookup: function(e) {
            var t = void 0;
            if (e.lookupLocalStorage && l) {
                var o = window.localStorage.getItem(e.lookupLocalStorage);
                o && (t = o)
            }
            return t
        },
        cacheUserLanguage: function(e, t) {
            t.lookupLocalStorage && l && window.localStorage.setItem(t.lookupLocalStorage, e)
        }
    }
      , d = {
        name: "navigator",
        lookup: function(e) {
            var t = [];
            if ("undefined" != typeof navigator) {
                if (navigator.languages)
                    for (var o = 0; o < navigator.languages.length; o++)
                        t.push(navigator.languages[o]);
                navigator.userLanguage && t.push(navigator.userLanguage),
                navigator.language && t.push(navigator.language)
            }
            return t.length > 0 ? t : void 0
        }
    }
      , v = {
        name: "htmlTag",
        lookup: function(e) {
            var t = void 0
              , o = e.htmlTag || ("undefined" != typeof document ? document.documentElement : null);
            return o && "function" == typeof o.getAttribute && (t = o.getAttribute("lang")),
            t
        }
    }
      , h = function() {
        function n(e) {
            var t = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];
            o.classCallCheck(this, n),
            this.type = "languageDetector",
            this.detectors = {},
            this.init(e, t)
        }
        return o.createClass(n, [{
            key: "init",
            value: function(o) {
                var n = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1]
                  , a = arguments.length <= 2 || void 0 === arguments[2] ? {} : arguments[2];
                this.services = o,
                this.options = e(n, this.options || {}, t()),
                this.i18nOptions = a,
                this.addDetector(u),
                this.addDetector(c),
                this.addDetector(f),
                this.addDetector(d),
                this.addDetector(v)
            }
        }, {
            key: "addDetector",
            value: function(e) {
                this.detectors[e.name] = e
            }
        }, {
            key: "detect",
            value: function(e) {
                var t = this;
                e || (e = this.options.order);
                var o = [];
                e.forEach(function(e) {
                    if (t.detectors[e]) {
                        var n = t.detectors[e].lookup(t.options);
                        n && "string" == typeof n && (n = [n]),
                        n && (o = o.concat(n))
                    }
                });
                var n = void 0;
                return o.forEach(function(e) {
                    if (!n) {
                        var o = t.services.languageUtils.formatLanguageCode(e);
                        t.services.languageUtils.isWhitelisted(o) && (n = o)
                    }
                }),
                n || this.i18nOptions.fallbackLng[0]
            }
        }, {
            key: "cacheUserLanguage",
            value: function(e, t) {
                var o = this;
                t || (t = this.options.caches),
                t && t.forEach(function(t) {
                    o.detectors[t] && o.detectors[t].cacheUserLanguage(e, o.options)
                })
            }
        }]),
        n
    }();
    return h.type = "languageDetector",
    h
});
