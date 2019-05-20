var Hawk = {};

Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

    hash: window.location.hash,
    anchorSufix: '-anchor',
}

Hawk.Validator = {};

Hawk.Validator.isEmail = function(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {  
        return true;  
    } else {
        return false;
    }
}

Hawk.Validator.isPhoneNumber = function(number) {
    if (/^\+?[0-9\s]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isNumber = function(number) {
    if (/^[0-9]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isNotEmpty = function(value) {
    if (value.length > 0) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.longerThan = function(str, length) {
    if (str.length > length) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.greaterThan = function(number, bound) {
    if (number > bound) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isSomethingChecked = function(field) {
    if (field.is(':checked')) {
        return true;
    } else {
        return false;
    }
}

Hawk.createBundleFromString = function(str) {
    var parts = str.split('&');

    var result = {};

    var current;
    var data;
    var key;
    var value;

    for (var i in parts) {
        current = parts[i];

        data = current.split('=');

        key = data[0];
        value = data[1];

        result[key] = value;
    }

    return result;
}

Hawk.isInObject = function(value, obj) {
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }

        if (obj[k] === value) {
            return true;
        }
    }

    return false;
}

Hawk.mergeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = (object.hasOwnProperty(property)) ? object[property] : mainObject[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.mergeWholeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = mainObject[property];
        }
        

        //console.log("object." + property + ": " + result[property]);
    }

    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            result[property] = object[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.createJQueryObject = function(text) {
    var result = $(text);

    result = result.filter(function() {
        return this.nodeType == 1; // Node.NODE
    });

    return result;
}

Hawk.scrollToElement = function(options) {
    var defaultOptions = {
        container: window,
        anchor: '#top' + Hawk.anchorSufix,
        callback: function() {},
        delay: 0,
        duration: 800,
        offset: 0
    };

    options = Hawk.mergeObjects(defaultOptions, options);

    setTimeout(function(){
        $(options.container).scrollTo(options.anchor, options.duration, {'axis': 'y', 'offset': options.offset, onAfter: function() { options.callback(); } });
    }, options.delay);

    return this;
}

Hawk.DropdownConstants = {
    modes: {
        PLAIN: 0,
        CHOOSABLE: 1
    },

    types: {
        OVERLAYER: 0,
        EXPANDING: 1
    },

    directions: {
        DOWNWARDS: 0,
        UPWARDS: 1
    }
}

Hawk.Dropdown = function(container, options) {
    this.container = $(container).first();

    this.header;
    this.title;
    this.list;
    this.listContainer;

    this.fields;

    this.states = {
        CLOSED: 0,
        OPEN: 1
    }

    this.defaultOptions = {
        slideSpeed: 200,

        mode: Hawk.DropdownConstants.modes.PLAIN,
        type: Hawk.DropdownConstants.types.OVERLAYER,
        direction: Hawk.DropdownConstants.directions.DOWNWARDS,

        containerClass: 'dropdown',
        expandingTypeClass: 'dropdown--expanding',
        choosableModeClass: 'dropdown--choosable',
        upwardsDirectionClass: 'dropdown--upwards',
        openClass: 'dropdown--open',
        headerClass: 'dropdown__header',
        titleClass: 'dropdown__title',
        listClass: 'dropdown__list',
        listContainerClass: 'dropdown__list-container',

        onShow: function(dropdown) {},
        onHide: function(dropdown) {},
        onRadioSelected: function(dropdown, radio) {
            var description = radio.parent().find('.dropdown-item__description').html();

            dropdown.title.html(description);

            dropdown.hide();
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.state = this.states.CLOSED;

    this.mode = this.options.mode;
    this.type = this.options.type;

    this.setOpen = function() {
        this.state = this.states.OPEN;

        return this;
    }

    this.setClosed = function() {
        this.state = this.states.CLOSED;

        return this;
    }

    this.isOpen = function() {
        return this.state == this.states.OPEN;
    }

    this.show = function() {
        var that = this;

        this.container.addClass(that.options.openClass);

        this.listContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onShow === 'function') {
                    that.options.onShow(that);
                }
            }
        });

        this.setOpen();

        return this;
    }

    this.hide = function() {
        var that = this;

        this.container.removeClass(that.options.openClass);

        this.listContainer.velocity("slideUp", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onHide === 'function') {
                    that.options.onHide(that);
                }
            }
        });

        this.setClosed();

        return this;
    }

    this.run = function() {
        var that = this;

        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);

        this.fields = this.list.find('input[type="radio"]');

        if (this.options.type == Hawk.DropdownConstants.types.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }

        if (this.options.mode == Hawk.DropdownConstants.modes.CHOOSABLE) {
            this.container.addClass(this.options.choosableModeClass);
        }

        if (this.options.direction == Hawk.DropdownConstants.directions.UPWARDS) {
            this.container.addClass(this.options.upwardsDirectionClass);
        }

        this.hide();

        this.container.click(function(e) {
            e.stopPropagation();
        });

        this.header.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (that.isOpen()) {
                that.hide();
            } else {
                that.show();
            }
        });

        $('body').click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        if (this.fields.length > 0) {
            this.fields.change(function() {
                if (typeof that.options.onRadioSelected == 'function') {
                    that.options.onRadioSelected(that, $(this));
                }
            });
        }

        return true;
    }
}

Hawk.AjaxOverlayerManager = function(id, options) {
    var that = this;

    this.container = $('#' + id);
    this.overlayerId = parseInt(this.container.attr('data-overlayer-id'));

    this.buttons = $('.ajax-overlayer-button[data-overlayer-id=' + this.overlayerId + ']');

    this.inner;
    this.contentWrapper;
    this.contentContainer;
    this.closeButton;
    this.loadingLayer;

    this.currentButton;

    this.open = false;

    this.ajaxRequest;
    this.ajaxRequestWorking = false;

    this.defaultOptions = {
        fadeSpeed: 400,
        slideSpeed: 400,

        ajaxFilePath: "/ajax.php",
        loadActionName: "load-overlayer",

        innerClass: 'overlayer__inner',
        contentWrapperClass: 'overlayer__content-wrapper',
        contentContainerClass: 'overlayer__content',
        closeButtonClass: 'ajax-overlayer-close',
        loadingLayerClass: 'overlayer__loading-layer',

        onShow: function(overlayerManager) {},
        onHide: function(overlayerManager) {},
        onLoad: function(overlayerManager, id) {},
        onInitialize: function(overlayerManager, hash) {
            var pattern = /[0-9]+\/[0-9]+\/([a-zA-Z0-9\-]+)/

            if (pattern.test(hash)) {
                var parts = hash.split('/');

                var overlayerId = parseInt(parts[0]);
                var id = parseInt(parts[1]);

                if (overlayerId == overlayerManager.getId()) {
                    overlayerManager.loadContent(id);
                }
            }
        },
        createAnchor: function(overlayerManager, id, hash) {
            return overlayerManager.getId() + "/" + id + "/" + hash;
        }
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.popstateDefaultCallback = function() {
        that.hide();
    };

    this.getId = function() {
        return this.overlayerId;
    }

    this.hide = function() {
        var that = this;

        if (this.ajaxRequestWorking) {
            if (typeof this.ajaxRequest != 'undefined') {
                this.ajaxRequest.abort();
            }
        }

        try {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        } catch(e) {
            window.location.hash = "";
        }

        this.container.velocity("fadeOut", {
            duration: this.options.fadeSpeed,
            complete: function() {
                $('body').css({ 'overflow': 'auto' });

                that.contentContainer.html('').hide();
                that.contentWrapper.css({ opacity: 0 });

                if (typeof that.options.onHide == 'function') {
                    that.options.onHide(that);
                }

                that.currentButton = undefined;

                that.open = false;

                $(window).unbind('popstate', that.popstateDefaultCallback);
            }
        });

        return this;
    }

    this.changeContent = function(content) {
        var that = this;

        this.contentWrapper.css({ opacity: 0 });
        this.contentContainer.html(content);
        this.contentContainer.show();
        that.contentWrapper.velocity({ opacity: 1 } , {
            duration: 400
        });

        /**this.contentContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                that.contentWrapper.velocity({ opacity: 1 } , {
                    duration: 200
                });
            }
        });**/

        return this;
    }

    this.loadContent = function(id, bundle) {
        var that = this;
        var lang = $('html').attr('lang');

        that.show();
        that.loadingLayer.show();

        this.ajaxRequestWorking = true;

        if (typeof bundle == 'undefined') {
            bundle = {};
        }

        this.ajaxRequest = $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: { 'action': that.options.loadActionName, 'id': id, 'lang': lang, 'bundle': bundle },
            success: function(result) {
                if (result.error > 0) {
                    // here should appear error layer
                    return;
                }

                that.changeContent(result.html);

                that.changeHash(id, result.anchor);

                if (typeof that.options.onLoad == 'function') {
                    that.options.onLoad(that, id);
                }

                $(window).on('popstate', that.popstateDefaultCallback);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer
                //alert(errorThrown);

                console.log(jqXHR.responseText);
            },
            complete: function() {
                that.loadingLayer.hide();

                that.ajaxRequestWorking = false;
            }
        });

        return this;
    }

    this.parseIntoBundle = function(str) {
        var items = str.split(';');

        var data;

        var result = {};

        for (var i in items) {
            data = items[i].split('=');

            result[data[0]] = data[1];
        }

        return result;
    }

    this.getButtonsSelector = function() {
        return '.ajax-overlayer-button[data-overlayer-id=' + this.overlayerId + ']';
    }

    this.run = function() {
        var that = this;

        this.inner = this.container.find('.' + this.options.innerClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.closeButton = $(this.container.find('.' + this.options.closeButtonClass));
        this.loadingLayer = $(this.container.find('.' + this.options.loadingLayerClass));

        $('body').on('click', this.getButtonsSelector(), function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!that.open) {
                that.currentButton = $(this);

                var id = $(this).attr('data-id');

                var bundle = {};

                if (typeof $(this).attr('data-bundle') != 'undefined') {
                    bundle = Hawk.createBundleFromString($(this).attr('data-bundle'));
                }

                that.loadContent(id, bundle);
            }
        });

        this.container.click(function() {
            that.hide();
        });

        this.container.on('click', '.' + this.options.closeButtonClass, function(e) {
            e.preventDefault();

            that.hide();
        });

        this.initializeClosePreventer();

        var hash = window.location.hash;

        if (typeof this.options.onInitialize == 'function') {
            this.options.onInitialize(this, hash);
        }

        return true;
    };
}
Hawk.AjaxOverlayerManager.prototype.initializeClosePreventer = function() {
    var that = this;

    this.container.on('click', '.' + that.options.innerClass + ', .' + that.options.innerClass + ' :not(.' + that.options.closeButtonClass + ', .' + that.options.closeButtonClass + ' *)', function(e) {
        e.stopPropagation();

        return;
    });

    return this;
}
Hawk.AjaxOverlayerManager.prototype.show = function() {
    var that = this;

    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            $('body').css({ 'overflow': 'hidden' });

            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });

    return this;
}
Hawk.AjaxOverlayerManager.prototype.changeHash = function(id, anchor) {
    var that = this;

    if (typeof anchor != 'undefined' && anchor != null && anchor.length > 0) {
        window.location.hash = that.options.createAnchor(that, id, anchor);
    }

    return this;
}

Hawk.PopUp = function(container, options) {
    Hawk.AjaxOverlayerManager.call(this, container, options);
}
Hawk.PopUp.prototype.show = function() {
    var that = this;

    this.container.velocity("fadeIn", {
        duration: this.options.fadeSpeed,
        complete: function() {
            if (typeof that.options.onShow == 'function') {
                that.options.onShow(that);
            }
        }
    });

    return this;
}
Hawk.PopUp.prototype.initializeClosePreventer = function() {
    return this;
}
Hawk.PopUp.prototype.changeHash = function(id, anchor) {
    return this;
}

Hawk.AjaxMoreContentManager = function(id, options) {
    var that = this;

    this.id = id;
    this.lastItemId = 0;
    this.done = false;

    this.buttons;
    this.contentContainer;

    this.defaultOptions = {
        itemsPerLoading: 8,

        loadActionName: 'load-more-content',
        ajaxFilePath: '/ajax.php',

        buttonClass: 'more-content-button',
        contentContainerClass: 'more-content-container',

        slideSpeed: 400,
        fadeSpeed: 400,

        onLoad: function(buttons, contentContainer) {},
        onDone: function(buttons, contentContainer) {
            buttons.velocity({ opacity: 0 }, {
                duration: 200,
                complete: function() {
                    buttons.css({ visibility: 'hidden' });
                }
            });
        },
        onError: function(buttons, contentContainer) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.load = function(lastItemId) {
        var that = this;
        var lang = $('html').attr('lang');
        var id = this.id;

        $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: { 'action': that.options.loadActionName, 'id': id, 'lang': lang, 'lastItemId': lastItemId },
            success: function(result) {
                console.log(result);

                if (result.error) {
                    if (typeof that.options.onError == 'function') {
                        that.options.onError(that.buttons, that.contentContainer);
                    }

                    return false;
                }

                that.setDone(result['isDone']);

                that.lastItemId = result['lastItemId'];

                that.appendContent(result['html']);

                if (that.isDone() && typeof that.options.onDone == 'function') {
                    that.options.onDone(that.buttons, that.contentContainer);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                if (typeof that.options.onError == 'function') {
                    that.options.onError(that.buttons, that.contentContainer);
                }

                return false;
            },
            complete: function() {
                
            }
        });
    }

    this.appendContent = function(contentToAppend) {
        var content = $(contentToAppend);

        content = content.filter(function() {
            return this.nodeType != 3; // Node.TEXT_NODE
        });

        content.hide();
        content.css({ opacity: 0 });

        this.contentContainer.append(content);

        content.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                content.velocity({ opacity: 1 }, {
                    duration: that.options.fadeSpeed,
                    complete: function() {
                        if (typeof that.options.onLoad == 'function') {
                            that.options.onLoad(that.buttons, that.contentContainer);
                        }
                    }
                });
            }
        });
    }

    this.isDone = function() {
        return this.done;
    }

    this.setDone = function(isDone) {
        this.done = isDone;

        return this;
    }

    this.run = function() {
        this.buttons = $('.' + this.options.buttonClass + '[data-id="' + this.id + '"]');
        this.contentContainer = $('.' + this.options.contentContainerClass + '[data-id="' + this.id + '"]');
    
        this.buttons.click(function(e) {
            e.preventDefault();

            if (!that.isDone()) {
                that.load(that.lastItemId);
            }
        });
    }
}

Hawk.SimpleMoreContentManager = function(type, options) {
    this.type = type;

    this.states = {
        HIDDEN: 0,
        VISIBLE: 1
    };

    this.defaultOptions = {
        slideSpeed: 400,
        fadeSpeed: 400,

        buttonClass: 'simple-more-content-button',
        contentClass: 'simple-more-content',

        onShow: function(manager, button) {},
        onHide: function(manager, button) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function(id) {
        var that = this;

        var currentButton = this.buttons.filter('[data-id="' + id + '"]');
        var currentContent = this.contents.filter('[data-id="' + id + '"]');

        currentContent.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                currentContent.velocity({ opacity: 1 }, {
                    duration: that.options.fadeSpeed,
                    complete: function() {
                        currentContent.attr('data-state', that.states.VISIBLE);
                    }
                });
            }
        });

        if (typeof that.options.onShow == 'function') {
            that.options.onShow(id, currentButton);
        }

        return this;
    }

    this.hide = function(id) {
        var that = this;

        var currentButton = this.buttons.filter('[data-id="' + id + '"');
        var currentContent = this.contents.filter('[data-id="' + id + '"');

        currentContent.velocity({ opacity: 0 }, {
            duration: that.options.fadeSpeed,
            complete: function() {
                currentContent.velocity("slideUp", {
                    duration: that.options.slideSpeed,
                    complete: function() {
                        currentContent.attr('data-state', that.states.HIDDEN);
                    }
                });
            }
        });

        if (typeof that.options.onHide == 'function') {
            that.options.onHide(id, currentButton);
        }
        
        return this;
    }

    this.isHidden = function(id) {
        var currentContent = this.contents.filter('[data-id="' + id + '"');

        return currentContent.attr('data-state') == this.states.HIDDEN;
    }

    this.run = function() {
        var that = this;

        this.buttons = $('.' + that.options.buttonClass + '[data-type="' + this.type + '"]');
        this.contents = $('.' + that.options.contentClass + '[data-type="' + this.type + '"]');

        this.buttons.show();
        this.contents.hide().css({ opacity: 0 });

        this.contents.attr('data-state', this.states.HIDDEN);

        if (typeof this.buttons == 'undefined' || typeof this.contents == 'undefined') {
            return false;
        }

        this.buttons.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            var currentId = $(this).attr('data-id');

            if (that.isHidden(currentId)) {
                that.show(currentId);
            } else {
                that.hide(currentId);
            }
        });

        return true;
    }
}

Hawk.initializeMoreContentManagers = function(callbacks) {
    var contents = $('.more-content');
    var that = this;

    contents.each(function() {
        var id = $(this).attr('data-id');

        var moreContents = new that.MoreContentManager(id, callbacks);

        if(moreContents) {
            moreContents.run();
        }
    });

    return this;
}

Hawk.SlideMenu = function(id, options) {
    this.menu = $('#' + id);
    this.wrapper = this.menu.find('> div');

    this.mode;
    this.direction;
    this.state;

    this.toggler;
    this.close;
    this.directionClassName;
    this.modeClassName;
    this.openClassName;

    this.states = {
        closed: 'closed',
        open: 'open'
    };

    this.modes = {
        slideFade: 'slide-fade',
        slide: 'slide',
        fade: 'fade'
    };

    this.directions = {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left'
    };

    this.defaultOptions = {
        slideDuration: 500,
        fadeDuration: 500,
        direction: 'top',
        mode: 'slide',
        toggler: $('.menu-toggler'),
        close: this.menu.find('.menu-close'),
        mainClass: 'slide-menu',
        showCallback: function(menu) {},
        hideCallback: function(menu, hideCall) {
            hideCall();
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function() {
        var that = this;

        var timeRemaining = this.totalDuration();

        setTimeout(function() {
            that.options.showCallback(that.menu);
        }, timeRemaining);

        if(this.options.mode == this.modes.fade) {
            this.menu.velocity("fadeIn", {
                duration: this.options.fadeDuration
            });
        }

        this.menu.addClass(this.openClassName);
        this.state = this.states.open;

        this.toggler.find('.icon-hamburger').addClass('open');

        return this;
    }

    this.hide = function() {
        var that = this;

        this.options.hideCallback(this.menu, function() {
            if(that.options.mode == that.modes.fade) {
                that.menu.velocity("fadeOut", {
                    duration: that.options.fadeDuration
                });
            }

            that.menu.removeClass(that.openClassName);
        });

        this.state = this.states.closed;

        this.options.toggler.find('.icon-hamburger').removeClass('open');

        return this;
    }

    this.totalDuration = function() {
        if(this.options.mode == this.modes.slide) {
            return this.options.slideDuration;
        } else if(this.options.mode == this.modes.slideFade) {
            return this.options.slideDuration + this.options.fadeDuration;
        } else if(this.options.mode == this.modes.fade) {
            return this.options.fadeDuration;
        } else {
            return 0;
        }
    }

    this.run = function() {
        var that = this;

        this.toggler = this.options.toggler;
        this.close = this.options.close;

        this.modeClassName = this.options.mainClass + "--" + this.options.mode;
        this.directionClassName = this.options.mainClass + "--" + this.options.direction;
        this.openClassName = this.options.mainClass + "--open";

        this.menu.addClass(this.directionClassName);
        this.menu.addClass(this.modeClassName);

        this.hide();

        this.toggler.click(function() {
            if(that.state == that.states.open) {
                that.hide();
            } else {
                that.show();
            }
        });

        this.close.click(function() {
            that.hide();
        });

        return this;
    }
}

Hawk.initializeAnchors = function(options) {
    var that = this;

    var defaultOptions = {
        delay: 100,
        menu: undefined
    }

    options = Hawk.mergeObjects(defaultOptions, options);

    $('a').unbind('click').click(function(e) {
        var regex = /#{1}.+$/;
        var link = this;

        var href = $(this).attr('href');
        var anchor;
        var extraDelay = 0;

        if(anchor = regex.exec(href)) {
            if($(anchor + that.anchorSufix).length) {
                e.preventDefault();

                if(options.menu !== undefined && $(link).parents(options.menu.menu).length) {
                    extraDelay = options.menu.totalDuration();

                    options.menu.hide();   
                }

                var finalDelay = options.delay + extraDelay;

                that.scrollToElement({ anchor: anchor + that.anchorSufix, callback: function() { window.location.hash = anchor; }, delay: finalDelay });
            }
        }
    });

    return this;
}

Hawk.BookmarksManager = function(container, options) {
    this.container = $(container);
    this.content;
    this.contentWrapper;
    this.bookmarks;

    this.current; // current bookmark container
    this.currentHeight = 0;

    this.loading = false;

    var that = this;

    this.defaultOptions = {
        responsive: true,
        activeScroll: false,

        activeScrollWidth: 480,
        slideDuration: 200,
        fadeDuration: 200,

        activeBookmarkClass: 'active',
        bookmarksClass: 'bookmarks-manager__bookmark-container',
        contentClass: 'bookmarks-manager__content',
        contentWrapperClass: 'bookmarks-manager__content-wrapper',

        bookmarkClass: 'bookmarks-manager__bookmark',
        bookmarkContentClass: 'bookmarks-manager__bookmark-content',

        bookmarkActiveCallback: function(bookmarkContainer) {},
        bookmarkUnactiveCallback: function(bookmarkContainer) {},
        changeContentCallback: function(content) {},
        changeBookmarkCallback: function(bookmarkContainer) {}
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.isResponsive = function() {
        return this.options.responsive;
    }

    this.isSmallDevice = function() {
        return (this.isResponsive() && !this.content.is(':visible'));
    }

    this.changeContent = function(content, callback) {
        var container = this.content;

        var showing = function() {
            container.hide();
            container.html(content.show());

            container.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    container.velocity({ opacity: 1 }, {
                        duration: that.options.fadeDuration,
                        complete: function() {
                            var currentHeight = that.content.outerHeight();

                            that.currentHeight = currentHeight;
                            that.contentWrapper.css({ 'min-height': that.currentHeight + "px" });

                            that.options.changeContentCallback(that.content);

                            that.loading = false;
                        }
                    });
                }
            });
        }

        if(container.css('opacity') != 0) {
            container.velocity({ opacity: 0 }, {
                duration: that.options.fadeDuration,
                complete: function() {
                    container.html('');
                    showing();
                }
            });
        } else {
            showing();
        }

        if(this.options.activeScroll && Hawk.w < this.options.activeScrollWidth) {
            var id = this.content.attr('id');

            if(id !== undefined) {
                Hawk.scrollToElement({ anchor: '#' + id });
            }
        }
        
        return this;
    }

    this.changeBookmark = function(bookmarkContainer) {
        this.unsetBookmarkActive();

        this.current = bookmarkContainer;

        var bookmark = this.current.find('.' + this.options.bookmarkClass);
        var content = this.current.find('.' + this.options.bookmarkContentClass);

        this.setBookmarkActive(this.current);

        if(this.isSmallDevice()) {
            content.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    that.options.changeContentCallback(content);

                    that.loading = false;
                }
            });
        } else {
            this.changeContent(content.clone(true));
        }

        return this;
    }

    this.unsetBookmarkActive = function() {
        if(this.current !== undefined) {
            var current = this.current;
            current.find('.' + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);

            current.find('.' + this.options.bookmarkContentClass).velocity("slideUp", {
                duration: that.options.slideDuration
            });

            this.current = undefined;

            this.options.bookmarkUnactiveCallback(current);
        }

        return this;
    }

    this.setBookmarkActive = function(bookmarkContainer) {
        var bookmark = bookmarkContainer.find('.' + this.options.bookmarkClass);

        bookmark.addClass(this.options.activeBookmarkClass);

        this.options.bookmarkActiveCallback(bookmarkContainer);

        return this;
    }

    this.launchBookmark = function(n) {
        this.changeBookmark(this.bookmarks.eq(n));

        return this;
    }

    this.updateOptions = function(options) {
        this.options = Hawk.mergeObjects(this.options, options);

        return this;
    }

    this.clear = function(callback) {
        //this.current = undefined;

        this.unsetBookmarkActive();
        this.content.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                if(callback !== undefined) {
                    callback();
                }
            }
        });

        return this;
    }

    this.remindActiveBookmark = function() {
        if(this.isSmallDevice()) {

        }

        return this;
    }

    this.refresh = function() {
        var current = this.current;

        if(current !== undefined) {
            this.clear(function() {
                that.changeBookmark(current);
            });
        }
        
        return this;
    }

    this.run = function() {
        this.bookmarks = this.container.find('.' + this.options.bookmarksClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentWrapper = this.container.find('.' + this.options.contentWrapperClass);

        var refresh;

        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });

        this.bookmarks.click(function() {
            if(that.loading == true) {
                return;
            }

            if(that.current !== undefined && that.current.is($(this))) {
                that.remindActiveBookmark();
            } else {
                that.changeBookmark($(this));
                that.loading = true;
            }
        });

        return this;
    }
}

Hawk.DetailsList = function(container, options) {
    this.container = $(container);
    this.titles;
    this.contents;

    this.current;

    this.states = {
        open: 'open',
        closed: 'closed'
    }

    this.defaultOptions = {
        itemClass: 'details-list__item',
        titleClass: 'details-list__title',
        contentClass: 'details-list__content',
        activeClass: 'active',
        hideOther: true,
        duration: 200,
        showCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--down').addClass('icon-arrow--up');
        },
        hideCallback: function(current) {
            var arrow = current.find('.details-list__arrow');
            arrow.removeClass('icon-arrow--up').addClass('icon-arrow--down');
        }
    }

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function(title) {
        if(this.options.hideOther && this.current !== undefined) {
            var recent = this.current;
            this.hide(recent);
        }

        this.current = title;

        var that = this;

        var container = this.current.parents('.' + that.options.itemClass).first();
        container.addClass(this.options.activeClass);

        var content = container.find('.' + this.options.contentClass);

        this.options.showCallback(container);

        content.velocity("slideDown", {
            duration: that.options.duration,
            complete: function() {
                that.current.attr('data-state', that.states.open);
            }
        });

        return this;
    }

    this.hide = function(title) {
        var that = this;

        var container = title.parents('.' + that.options.itemClass).first();
        container.removeClass(this.options.activeClass);

        this.options.hideCallback(container);

        var content = container.find('.' + this.options.contentClass);
        content.velocity("slideUp", {
            duration: that.options.duration,
            complete: function() {
                title.attr('data-state', that.states.closed);
            }
        });

        return this;
    }

    this.run = function() {
        var that = this;

        this.titles = this.container.find('.' + this.options.titleClass);
        this.contents = this.container.find('.' + this.options.contentClass);

        this.contents.hide();

        this.container.on('click', '.' + this.options.titleClass, function() {
            if($(this).attr('data-state') == that.states.open) {
                that.hide($(this));
            } else {
                that.show($(this));
            }
        });

        return this;
    }
}

Hawk.CategorizedItems = function(container, options) {
    this.container = $(container);
    this.categories = this.container.find('[data-category-id]');
    this.items;
    this.noItems;
    this.contentContainer;
    this.content;

    this.selectedItems;
    this.recentItems;
    this.currentCategory;
    this.currentBookmark;

    this.defaultOptions = {
        allId: 'all',
        prefix: "cat-",
        amountInRow: {
            0: 1,
            550: 2,
            768: 3,
            1100: 4
        },
        itemClass: "categorized-items__item",
        noItemsClass: "categorized-items__no-items",
        contentContainerClass: "categorized-items__contents-container",
        contentClass: "categorized-items__contents",
        activeBookmarkClass: "active",
        slideSpeed: 500,
        fadeSpeed: 200,
        smallDeviceWidth: 480,
        scrollOnSmallDevice: true
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.loadCategory = function(id) {
        var that = this;

        this.currentCategory = id;
        this.recentItems = this.selectedItems;

        if(this.currentCategory == this.options.allId) {
            this.selectedItems = this.items;
        } else {
            this.selectedItems = this.items.filter('.cat-' + this.currentCategory);
        }

        this.activateBookmark(this.currentCategory);

        if(that.selectedItems.length > 0) {
            var itemsPerRow = this.countItemsPerRow();

            var rowAmount = Math.ceil(this.selectedItems.length/itemsPerRow);
            var itemHeight = this.selectedItems.first().outerHeight();

            var necessaryHeight = rowAmount * itemHeight;

            if(necessaryHeight < this.contentContainer.outerHeight()) {
                this.contentContainer.css({ 'min-height': necessaryHeight + "px" });
            }

            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.noItems.hide();
                    that.items.hide();
                    that.selectedItems.show();

                    if(that.options.scrollOnSmallDevice && Hawk.w < that.options.smallDeviceWidth) {
                        var containerId = that.contentContainer.attr('id');

                        if(containerId !== undefined) {
                            console.log(containerId);

                            Hawk.scrollToElement({ anchor: '#' + containerId });
                        }                        
                    }

                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed,
                        complete: function() {
                            that.contentContainer.css({ 'min-height': necessaryHeight + "px" });
                        }
                    });
                }
            });
        } else {
            var containerMinHeight = that.noItems.outerHeight();
            this.contentContainer.css( { 'min-height': containerMinHeight + "px" });

            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.items.hide();
                    that.noItems.show();

                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed
                    });
                }
            });
        }

        return this;
    }

    this.activateBookmark = function(id) {
        if(this.currentBookmark !== undefined) {
            this.currentBookmark.removeClass(this.options.activeBookmarkClass);
        }
        
        this.currentBookmark = this.categories.filter('[data-category-id="' + id + '"]');
        this.currentBookmark.addClass(this.options.activeBookmarkClass);

        return this;
    }

    this.countItemsPerRow = function() {
        var amount = 0;

        var object = this.options.amountInRow;

        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                if(property > Hawk.w) {
                    return amount;
                }

                amount = object[property];
            }
        }

        return amount;
    }

    this.refresh = function() {
        var itemsPerRow = this.countItemsPerRow();
        var itemWidth = 1/itemsPerRow * 100;

        this.items.css({ width: itemWidth + "%" });

        return this;
    }

    this.run = function() {
        var that = this;

        this.items = this.container.find('.' + this.options.itemClass);
        this.noItems = this.container.find('.' + this.options.noItemsClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);

        this.selectedItems = this.items;
        this.noItems.hide();

        this.refresh();

        var refresh;

        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });

        this.categories.click(function() {
            var id = $(this).attr('data-category-id');

            that.loadCategory(id);
        });

        this.loadCategory(this.options.allId);

        return this;
    }
}

Hawk.formFieldTypes = {
    TEXT: 'text',
    PASSWORD: 'password',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    FILE: 'file'
};

Hawk.FormField = function(name, type, wrapperClass, required, callback) {
    var that = this;

    this.name = name;
    this.type = type;
    this.wrapperClass = wrapperClass;
    this.required = required;
    this.callback = callback;

    this.wrapper;
    this.field;

    this.errorClass = "error";

    this.bind = function(form) {
        if (this.type == Hawk.formFieldTypes.TEXTAREA) {
            this.field = $(form).find('textarea[name="' + this.name + '"]');
        } else if (this.type == Hawk.formFieldTypes.CHECKBOX) {
            this.field = $(form).find('input[name="' + this.name + '"]');

            if(this.field.length == 0) {
                this.field = $(form).find('input[name="' + this.name + '[]"]');
            }
        } else if (this.type == Hawk.formFieldTypes.SELECT) {
            this.field = $(form).find('select[name="' + this.name + '"]');
        } else {
            this.field = $(form).find('input[name="' + this.name + '"]');
        }
        
        if (this.field.length > 0) {
            if (typeof this.wrapperClass == 'function') {
                this.wrapper = this.wrapperClass(this.field);

                console.log(this.wrapper);
            } else {
                this.wrapper = this.field.parents('.' + this.wrapperClass);
            }
        }
    }

    this.isBinded = function() {
        return (this.wrapper !== undefined && this.field !== undefined);
    }

    this.disable = function() {
        if (this.isBinded()) {
            this.field.attr('disabled', 'disabled');
        }

        return this;
    }

    this.validate = function() {
        if (callback !== undefined) {
            if(that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO || that.type == Hawk.formFieldTypes.FILE) {
                return callback(that.field, that.wrapper);
            } else {
                return callback(that.field.val());
            }
        }

        return true;
    }

    this.markIncorrect = function() {
        this.wrapper.addClass(this.errorClass);

        return this;
    }

    this.clear = function() {
        this.wrapper.removeClass(this.errorClass);

        return this;
    }

    this.clearField = function() {
        if(that.type == Hawk.formFieldTypes.CHECKBOX || that.type == Hawk.formFieldTypes.RADIO) {
            this.field.attr('checked', false);
        } else if (that.type == Hawk.formFieldTypes.SELECT) {
            this.field.val(0);
        } else {
            this.field.val('');
        }

        return this;
    }

    this.bindOuter = function(form, name, id) {
        var finalName = name + "[" + id + "][" + this.name + "]";

        var formField = new Hawk.FormField(finalName, this.type, this.wrapperClass, this.required, this.callback);
        formField.bind(form);

        return formField;
    }

    this.run = function(form) {
        this.bind(form);

        this.field.change(function() {
            if (that.validate()) {
                that.clear();
            } else {
                that.markIncorrect();
            }
        });
    }
}

Hawk.FormMultiField = function(form, name, fields) {
    var that = this;

    this.form = form;
    this.name = name;
    this.fields = fields;

    this.wrappers = {};

    this.createWrappers = function(form, name) {
        var wrappers = form.find('[data-form-multifield="' + name + '"]');

        var result = {};

        var current;

        var that = this;

        wrappers.each(function() {
            var currentWrapper = $(this);
            var id = currentWrapper.attr('data-form-multifield-id');

            result[id] = {};

            for (var i in that.fields) {
                current = that.fields[i];

                var formField = current.bindOuter(form, that.name, id);

                result[id][current.name] = formField;
            }
        });

        return result;
    }

    this.disable = function() {
        this.wrappers = this.createWrappers(this.form, this.name);

        var current;

        for (var i in this.wrappers) {
            current = this.wrappers[i];

            current.disable();
        }

        return this;
    }

    this.validate = function(errorGroups) {
        this.refresh();

        var wrappers = this.createWrappers(this.form, this.name);
        var errorGroup;
        var errorField;

        var field;

        this.walkWrappers(wrappers, function(field) {
            field.clear();
        });

        for (var i in errorGroups) {
            errorGroup = errorGroups[i];

            for (var j in errorGroup) {
                errorField = errorGroup[j];

                field = wrappers[i][errorField];

                field.markIncorrect();

                /**if (field.validate()) {
                    field.clear();
                } else {
                    field.markIncorrect();
                }**/
            }
        }
    }

    this.walkWrappers = function(wrappers, callback) {
        var currentGroup;
        var current;

        for (var i in wrappers) {
            currentGroup = wrappers[i];

            for (var j in currentGroup) {
                current = currentGroup[j];

                callback(current);
            }
        }
    }

    this.clear = function() {
        this.walkWrappers(this.createWrappers(this.form, this.name), function(field) {
            field.clear();
        });
    }

    this.refresh = function() {
        this.walkWrappers(this.createWrappers(this.form, this.name), function(field) {
            field.field.unbind('change');

            field.field.change(function() {
                if (field.validate()) {
                    field.clear();
                } else {
                    field.markIncorrect();
                }
            });
        });
    }

    this.run = function() {
        this.refresh();
    }
}

Hawk.FormSender = function(id, fields, options) {
    var that = this;

    this.id = id;
    this.rawForm = document.getElementById(this.id);
    this.form = $(this.rawForm);

    this.fields = fields;
    this.multifields = {};

    this.defaultOptions = {
        ajaxPath: '/ajax.php',
        extraData: {},
        incorrectFieldClass: 'error',
        button: that.form.find('button[type="submit"]'),
        cancelButton: that.form.find('button.form__cancel'),
        infoContainerClass: 'form__info-container',
        infoWrapperClass: 'form__info-wrapper',
        infoClass: 'form__info',
        spinnerClass: 'form__spinner',
        correctCallback: function() {},
        errorCallback: function() {},
        exceptionCallback: function() {},
        callback: function() {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.infoContainer = this.form.find('.' + this.options.infoContainerClass);
    this.infoWrapper = this.form.find('.' + this.options.infoWrapperClass);
    this.info = this.form.find('.' + this.options.infoClass);
    this.spinner = this.form.find('.' + this.options.spinnerClass);
    this.button = this.options.button;
    this.cancelButton = this.options.cancelButton;

    this.validate = function() {
        var result = true;

        for (var i in this.fields) {
            var current = this.fields[i];

            if (!current.validate()) {
                current.markIncorrect();

                result = false;
            } else {
                current.clear();
            }
        }

        return result;
    }

    this.clear = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.clear();
        }

        return this;
    }

    this.clearFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.clearField();
        }

        return this;
    }

    this.checkFields = function(incorrectFields) {
        for (var i in this.fields) {
            var current = this.fields[i];

            if (Hawk.isInObject(current.name, incorrectFields)) {
                current.markIncorrect();
            } else {
                current.clear();
            }
        }

        return this;
    }

    this.checkMultifields = function(incorrectFields) {
        for (var i in this.multifields) {
            var current = this.multifields[i];

            if (incorrectFields.hasOwnProperty(current.name)) {
                current.validate(incorrectFields[current.name]);
            } else {
                current.clear();
            }
        }

        return this;
    }

    this.changeMessage = function(message) {
        var showing = function() {
            that.info.html(message);

            that.infoWrapper.velocity("slideDown", {
                duration: 200,
                complete: function() {
                    that.infoContainer.css({ 'min-height': that.infoContainer.outerHeight() + "px" });

                    that.showMessage();
                }
            });
        }

        if (this.infoWrapper.is(':hidden')) {
            showing();
        } else {
            that.hideMessage(showing);
        }

        return this;
    }

    this.showMessage = function(message) {
        that.info.velocity({ opacity: 1 }, {
            duration: 200
        });

        return this;
    }

    this.hideMessage = function(callback) {
        this.info.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                if (callback !== undefined) {
                    callback();
                }
            }
        });

        return this;
    }

    this.clearMessage = function(callback) {
        this.info.velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                that.infoWrapper.velocity("slideUp", {
                    duration: 200,
                    complete: function() {
                        that.infoContainer.css({ 'min-height': 0 });

                        if (callback !== undefined) {
                            callback();
                        }
                    }
                });
            }
        });

        return this;
    }

    this.hideButton = function() {
        this.button.add(this.cancelButton).velocity({ opacity: 0 }, {
            duration: 200,
            complete: function() {
                that.button.css({ visibility: 'hidden' });
            }
        });
    }

    this.disable = function() {
        this.form.attr('disabled', 'disabled');

        this.form.find('input, textarea').attr('disabled', 'disabled');

        return this;
    }

    this.send = function() {
        this.spinner.show();

        var data = new FormData(that.rawForm);

        for (var key in that.options.extraData) {
            data.append(key, that.options.extraData[key]);
        }

        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }

        $.ajax({
            url: that.options.ajaxPath,
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: function(result) {
                console.log(result);

                if (!result.error) {
                    that.clear();

                    that.hideButton();

                    that.disable();

                    if (typeof that.options.correctCallback == 'function') {
                        that.clearMessage();
                        that.options.correctCallback(result);
                    } else {
                        that.changeMessage(result.message);
                    }
                } else {
                    that.checkFields(result.errorFields);

                    if (typeof result.multifieldsErrors != 'undefined') {
                        that.checkMultifields(result.multifieldsErrors);
                    }

                    that.changeMessage(result.message);

                    if (typeof that.options.errorCallback == 'function') {
                        that.options.errorCallback(result);
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                that.changeMessage("Wystąpił nieoczekiwany problem podczas wysyłania wiadomości. Proszę spróbować ponownie później.");

                if (typeof that.options.exceptionCallback == 'function') {
                    that.options.exceptionCallback();
                }

                console.log(errorThrown);
            },
            complete: function(jqXHR) {
                that.spinner.hide();
            }
        });  
    }

    this.bindFields = function() {
        for (var i in this.fields) {
            var current = this.fields[i];

            current.run(that.form);
        }

        return this;
    }

    this.bindMultifields = function(multifields) {
        this.multifields = multifields;

        for (var i in this.multifields) {
            this.multifields[i].run();
        }

        return this;
    }

    this.run = function() {
        this.bindFields();

        this.form.submit(function(e) {
            e.preventDefault();

            that.send();
        });

        this.cancelButton.click(function() {
            that.clearFields();
        });
    }
}

Hawk.Pager = function(container, options) {
    var that = this;

    this.container = $(container);

    this.pagesNumber;
    this.pages;

    this.defaultOptions = {
        limitValue: 10,

        activeClass: 'active',

        createItem: function(nr) {
            return $("<li class=\"pager-item pager__item\" data-page-id=\"" + nr +"\"><div class=\"pager-item__wrapper\">" + nr + "</div></li>");
        },
        createSeparator: function() {
            return $("<li class=\"pager-item pager-item--separator pager__item pager-item pager__separator\"><div class=\"pager-item__wrapper\">...</div></li>");
        },
        onClick: function(nr) {

        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.build = function(amount) {
        var pages = $();

        if (amount < this.options.limitValue) {
            for (var i = 0; i < amount; i++) {
                pages = pages.add(this.options.createItem(i + 1));
            }
        } else {
            for (var i = 0; i < 3; i++) {
                pages = pages.add(this.options.createItem(i + 1));
            }

            pages = pages.add(this.options.createSeparator());

            for (var i = amount - 3; i < amount; i++) {
                pages = pages.add(this.options.createItem(i + 1));
            }
        }

        return pages;
    }

    this.isInEdge = function(current) {
        console.log(this.pagesNumber);

        if (this.pagesNumber < this.options.limitValue) {
            return true;
        } else if (current <= 3 || current > this.pagesNumber - 3) {
            return true;
        } else {
            return false;
        }
    }

    this.update = function(pagesNumber) {
        this.pagesNumber = pagesNumber;

        if (typeof this.pages != 'undefined') {
            this.pages.unbind('click');
        }

        this.pages = this.build(pagesNumber);

        this.container.html('');
        this.container.append(this.pages);

        console.log(this.pages);

        //this.pages = this.pages.filter('[data-page-id]');

        this.pages.click(function() {
            if (typeof $(this).attr('data-page-id') != 'undefined') {
                that.options.onClick($(this).attr('data-page-id'));
            }

        });
    }

    this.markActive = function(nr) {
        var currentInnerPage = that.pages.filter('.pager__inner-page');
        var currentExtraSeparator = that.pages.filter('.pager__extra-separator');

        if (!this.isInEdge(nr)) {
            console.log("NR: " + nr);

            if (currentInnerPage.length > 0) {
                currentInnerPage.attr('data-page-id', nr);
                currentInnerPage.find('.pager-item__wrapper').html(nr);
            } else {
                var innerPage = this.options.createItem(nr);
                innerPage.addClass('pager__inner-page');

                var currentSeparator = this.pages.filter('.pager__separator');
                var separator = this.options.createSeparator();
                separator.addClass('pager__extra-separator');

                console.log("Current separator: ");
                console.log(currentSeparator);

                innerPage.insertAfter(currentSeparator);
                separator.insertAfter(innerPage);

                this.pages = this.pages.add(separator).add(innerPage);
            }

        } else {
            if (currentInnerPage.length > 0) {
                currentInnerPage.detach();

                if (currentExtraSeparator.length > 0) {
                    currentExtraSeparator.detach();
                }

                this.pages = this.pages.not('.pager__inner-page, .pager__extra-separator');
                console.log(this.pages);
            }
        }

        that.pages.removeClass(this.options.activeClass);
        this.pages.filter('[data-page-id="' + nr + '"]').addClass(this.options.activeClass);
    }

    this.run = function(pagesNumber) {
        this.update(pagesNumber);

        return this;
    }
}

Hawk.AjaxItemsManager = function(container, options) {
    var that = this;

    this.container = $(container);
    this.contentContainer;
    this.content;
    this.controls = {

    };

    this.defaultOptions = {
        ajaxPath: 'ajax',
        loadActionName: 'load-page',

        allCategoriesID: 'all',
        itemsPerPage: 20,

        previousClass: 'ajax-categorized-items__previous',
        nextClass: 'ajax-categorized-items__next',
        previousDisableClass: 'ajax-categorized-items__previous--disabled',
        nextDisableClass: 'ajax-categorized-items__next--disabled',

        contentContainerClass: 'ajax-items-manager__content-container',
        contentClass: 'ajax-items-manager__content',
        pagerClass: 'ajax-items-manager__pager',

        onLoad: function(ajaxItemsManager, contentContainer) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.categoryID = this.options.allCategoriesID;
    this.itemsPerPage = this.options.itemsPerPage;
    this.page = 1;
    this.itemsAmount = 0;
    this.orderBy = "";
    this.filters = {};

    this.pagers = [];

    this.clearFilters = function() {
        this.filters = {};

        return this;
    }

    this.setFilter = function(key, value) {
        this.filters[key] = value;

        return this;
    }

    this.removeFilter = function(key) {
        if (typeof this.filters[key] != 'undefined') {
            delete this.filters[key];
        }

        return this;
    }

    this.setItemsPerPage = function(amount) {
        this.itemsPerPage = amount;

        return this;
    }

    this.setItemsAmount = function(amount) {
        this.itemsAmount = amount;

        return this;
    }

    this.setOrderBy = function(orderBy) {
        this.orderBy = orderBy;

        return this;
    }

    this.isFirstPage = function() {
        return this.page == 1;
    }

    this.isLastPage = function() {
        return this.page == this.calculatePagesAmount();
    }

    this.calculatePagesAmount = function() {
        return Math.ceil(this.itemsAmount / this.itemsPerPage);
    }

    this.previous = function() {
        if (!this.isFirstPage()) {
            this.load(this.page - 1);

            return true;
        } else {
            return false;
        }
    }

    this.next = function() {
        if (!this.isLastPage()) {
            this.load(this.page + 1);

            return true;
        } else {
            return false;
        }
    }

    this.setCategory = function(id) {
        this.categoryID = id;

        return this;
    }

    this.getPage = function() {
        return this.page;
    }

    this.makePageActive = function(page) {
        this.makePagerAction(function(pager) {
           pager.markActive(page);
        });
    }

    this.makePagerAction = function(action) {
        for (var i in this.pagers) {
            action(this.pagers[i]);
        }
    }

    this.refreshPagers = function() {
        this.makePagerAction(function(pager) {
            console.log(that.calculatePagesAmount());
            pager.update(that.calculatePagesAmount());
        });
    }

    this.checkControls = function() {
        if (that.isFirstPage()) {
            that.controls.previous.addClass(that.options.previousDisableClass);
        } else {
            that.controls.previous.removeClass(that.options.previousDisableClass);
        }

        if (that.isLastPage()) {
            that.controls.next.addClass(that.options.nextDisableClass);
        } else {
            that.controls.next.removeClass(that.options.nextDisableClass);
        }
    }

    this.reload = function() {
        this.load(this.getPage());
    }

    this.load = function(page) {
        this.page = parseInt(page);

        //this.loadingLayer.show();
        //that.content.css({ opacity: .3 });

        this.checkControls();

        $.ajax({
            type: "POST",
            url: that.options.ajaxPath,
            dataType: "json",
            data: { 'action': that.options.loadActionName,
                'category': that.categoryID,
                'amount': that.itemsPerPage,
                'page': that.page,
                'orderBy': that.orderBy,
                'filters': that.filters
            },
            success: function(result) {
                console.log(result);

                if (result.error) {
                    // here should appear error layer
                    return;
                }

                //that.itemsAmount = result.itemsAmount;

                that.refreshPagers();

                that.makePageActive(that.getPage());

                that.content.velocity({ opacity: 0 }, {
                    duration: 400,
                    complete: function() {
                        that.content.hide();
                        that.content.html(result.html);
                        that.content.velocity("slideDown", {
                            duration: 400,
                            complete: function() {
                                //console.log(that.content.height());
                                that.contentContainer.css({ 'min-height': that.content.height() + "px" });
                                that.content.velocity({ opacity: 1 }, {
                                    duration: 400
                                });

                                //that.loadingLayer.hide();

                                if (typeof that.contentContainer.attr('id') != 'undefined') {
                                    Hawk.scrollToElement({ anchor: '#' + that.contentContainer.attr('id') });
                                }

                                if (typeof that.options.onLoad == 'function') {
                                    that.options.onLoad(that, that.content);
                                }
                            }
                        });
                    }
                });

                if (typeof callback != 'undefined') {
                    callback(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer

                console.warn(jqXHR.responseText);
                //that.loadingLayer.hide();
            },
            complete: function() {

            }
        });
    }

    this.setPager = function(pager) {
        this.pagers = [];

        this.pagers.push(pager);

        return this;
    }

    this.addPager = function(pager) {
        this.pagers.push(pager);

        return this;
    }

    this.refresh = function() {
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.content = this.container.find('.' + this.options.contentClass);

        this.controls.previous = this.container.find('.' + this.options.previousClass);
        this.controls.next = this.container.find('.' + this.options.nextClass);

        this.controls.previous.unbind('click').click(function() {
            that.previous();
        });

        this.controls.next.unbind('click').click(function() {
            that.next();
        });
    }

    this.run = function(itemsAmount) {
        this.itemsAmount = itemsAmount;

        this.refresh();

        this.pagers.push(new Hawk.Pager(this.container.find('.' + this.options.pagerClass), {
            onClick: function(nr) {
                that.load(nr);
            }
        }));

        this.checkControls();
    }
}

Hawk.OldAjaxCategorizedItems = function(container, options) {
    var that = this;

    this.container = $(container);
    this.categories = this.container.find('[data-category-id]');
    this.items;
    this.noItems;
    this.contentContainer;
    this.content;
    this.pagerContainer;
    this.pager;

    this.controls = {

    };

    this.selectedItems;
    this.recentItems;
    this.currentCategory;
    this.currentPage;
    this.currentBookmark;
    this.currentPage = 1;

    this.itemsAmount = 0;

    this.loadingLayer;

    this.lang;

    this.defaultOptions = {
        ajaxFilePath: 'ajax.php',
        loadActionName: 'load-category',

        allId: 'all',
        prefix: "",

        itemsPerPage: 5,
        itemsType: 2,

        itemClass: "ajax-categorized-items__item",
        noItemsClass: "ajax-categorized-items__no-items",
        contentContainerClass: "ajax-categorized-items__contents-container",
        contentClass: "ajax-categorized-items__content",
        loadingLayerClass: "ajax-categorized-items__loading-layer",
        pagerClass: 'ajax-categorized-items__pager',
        previousClass: 'ajax-categorized-items__previous',
        nextClass: 'ajax-categorized-items__next',
        activeCategoryClass: "active",
        disabledControlClass: "disabled",

        slideSpeed: 500,
        fadeSpeed: 200,

        smallDeviceWidth: 480,
        scrollOnSmallDevice: false,

        showItems: function(that, necessaryHeight) {
            that.content.velocity("slideUp", {
                duration: that.options.slideSpeed,
                complete: function() {
                    that.noItems.hide();
                    that.items.hide();
                    that.selectedItems.show();

                    if(that.options.scrollOnSmallDevice && that.isSmallDevice()) {
                        var containerId = that.contentContainer.attr('id');

                        if(containerId !== undefined) {
                            //console.log(containerId);

                            Hawk.scrollToElement({ anchor: '#' + containerId });
                        }
                    }

                    that.content.velocity("slideDown", {
                        duration: that.options.slideSpeed,
                        complete: function() {
                            that.contentContainer.css({ 'min-height': necessaryHeight + "px" });
                        }
                    });
                }
            });
        },
        onLoad: function(thisthat) {

        },
        onResize: function(thisthat) {

        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.getCurrentCategory = function() {
        return this.categories.filter('[data-category-id="' + this.currentCategory + '"]');
    }

    this.getCurrentPage = function() {
        return this.currentPage;
    }

    this.markCurrentPageActive = function() {
        this.pager.markActive(this.currentPage);
    }

    this.markCurrentCategoryActive = function() {
        this.categories.removeClass(this.options.activeCategoryClass);
        this.getCurrentCategory().addClass(this.options.activeCategoryClass);
    }

    this.loadCategoryByIndex = function(index) {
        var category = this.categories.eq(index);

        this.loadCategory(parseInt(category.attr('data-category-id')));
    }

    this.loadAllCategories = function(page) {
        this.loadCategory(this.options.allId, page);
    }

    this.getItemsAmount = function() {
        return this.itemsAmount;
    }

    this.getPagesNumber = function(amount) {
        if (typeof amount == 'undefined') {
            var amount = this.itemsAmount;
        }

        return Math.ceil(amount / this.options.itemsPerPage);
    }

    this.isFirstPage = function() {
        return this.currentPage == 1;
    }

    this.isLastPage = function() {
        console.log("isLastPage pagesNumber: " + this.getPagesNumber(this.itemsAmount));

        return this.currentPage == this.getPagesNumber(this.itemsAmount);
    }

    this.loadCategory = function(id) {
        this.currentCategory = id;

        that.markCurrentCategoryActive();

        this.loadPage(id, 1, function(result) {
            that.pager.update(that.getPagesNumber(result.itemsAmount));

            that.markCurrentPageActive();
        });

        return this;
    }

    this.adjust = function() {
        this.contentContainer.css({ 'min-height': that.content.height() + "px" });
    }

    this.previous = function() {
        console.log("Page: " + this.currentPage);

        if (!this.isFirstPage()) {
            this.loadPage(this.currentCategory, this.currentPage - 1);

            return true;
        } else {
            return fasle;
        }
    }

    this.next = function() {
        console.log("Page: " + this.currentPage);

        if (!this.isLastPage()) {
            this.loadPage(this.currentCategory, this.currentPage + 1);

            return true;
        } else {
            return false;
        }
    }

    this.loadPage = function(id, page, callback) {
        var that = this;

        this.currentCategory = id;
        this.currentPage = parseInt(page);

        this.loadingLayer.show();
        that.content.css({ opacity: .3 });

        console.log("currentPage: " + this.currentPage);

        $.ajax({
            type: "POST",
            url: that.options.ajaxFilePath,
            dataType: "json",
            data: { 'action': that.options.loadActionName,
                'id': that.currentCategory,
                'lang': that.lang,
                'amount': that.options.itemsPerPage,
                'page': that.currentPage,
                'type': that.options.itemsType
            },
            success: function(result) {
                console.log(result);

                if (result.error > 0) {
                    // here should appear error layer
                    return;
                }

                that.itemsAmount = result.itemsAmount;

                that.markCurrentPageActive();

                that.content.velocity({ opacity: 0 }, {
                    duration: 400,
                    complete: function() {
                        that.content.hide();
                        that.content.html(result.html);
                        that.content.velocity("slideDown", {
                            duration: 400,
                            complete: function() {
                                //console.log(that.content.height());
                                that.contentContainer.css({ 'min-height': that.content.height() + "px" });
                                that.content.velocity({ opacity: 1 }, {
                                    duration: 400
                                });

                                that.loadingLayer.hide();

                                if (typeof that.contentContainer.attr('id') != 'undefined') {
                                    Hawk.scrollToElement({ anchor: '#' + that.contentContainer.attr('id') });
                                }

                                if (typeof that.options.onLoad == 'function') {
                                    that.options.onLoad(that);
                                }
                            }
                        });
                    }
                });

                if (typeof callback != 'undefined') {
                    callback(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // here should appear error layer

                console.warn(jqXHR.responseText);
                that.loadingLayer.hide();
            },
            complete: function() {
                if (that.isFirstPage()) {
                    that.controls.previous.addClass(that.options.disabledControlClass);
                } else {
                    that.controls.previous.removeClass(that.options.disabledControlClass);
                }

                if (that.isLastPage()) {
                    that.controls.next.addClass(that.options.disabledControlClass);
                } else {
                    that.controls.next.removeClass(that.options.disabledControlClass);
                }
            }
        });

        return this;
    }

    this.isSmallDevice = function() {
        return false; // Hawk.w < this.options.smallDeviceWidth;
    }

    this.update = function(options) {
        this.options = Hawk.mergeObjects(this.options, options);
    }

    this.refresh = function() {
        if (typeof this.options.onResize == 'function') {
            this.options.onResize(this);
        }

        return this;
    }

    this.run = function() {
        var that = this;

        if (typeof $('html').attr('lang') != 'undefined') {
            this.lang = $('html').attr('lang');
        } else {
            this.lang = "en";
        }

        this.currentPage = 1;

        this.items = this.container.find('.' + this.options.itemClass);
        this.noItems = this.container.find('.' + this.options.noItemsClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);
        this.pagerContainer = this.container.find('.' + this.options.pagerClass);

        this.controls = {
            previous: this.container.find('.' + this.options.previousClass),
            next: this.container.find('.' + this.options.nextClass)
        };

        this.selectedItems = this.items;
        this.noItems.hide();

        var refresh;

        $(window).resize(function() {
            clearTimeout(refresh);
            refresh = setTimeout(function() {
                that.refresh();
            }, 100);
        });

        this.pager = new Hawk.Pager(this.pagerContainer, {
            onClick: function(nr) {
                that.loadPage(that.currentCategory, nr);
            }
        });
        this.pager.run(0);

        this.categories.click(function() {
            var id = $(this).attr('data-category-id');

            that.loadCategory(id);
        });

        this.controls.previous.click(function() {
            that.previous();
        });

        this.controls.next.click(function() {
            that.next();
        });

        this.refresh();

        return this;
    }
}

Hawk.Invoker = function(options) {
    this.callbacks = {};
    this.refreshing;

    this.defaultOptions = {
        timeSpace: 100
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.register = function(name, callback) {
        this.callbacks[name] = callback;

        return this;
    }

    this.cancel = function(name) {
        if (typeof this.callbacks[name] != 'undefined') {
            delete this.callbacks[name];

            return true;
        } else {
            return false;
        }
    }

    this.invoke = function() {
        for (var i in this.callbacks) {
            this.callbacks[i]();
        }

        return this;
    }

    this.run = function() {
        var that = this;

        this.invoke();

        $(window).resize(function() {
            clearTimeout(that.refreshing);

            that.refreshing = setTimeout(function() {
                that.invoke();
            }, that.options.timeSpace);
        });
    }
}

Hawk.refresh = function() {
    this.w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeigh;

    return this;
}

Hawk.run = function() {
    var that = this;

    var pageLoadingLayer = $('#page-loading-layer');
    pageLoadingLayer.velocity("fadeOut", {
        duration: 1000
    });

    if(this.hash.length != 0) {
        this.scrollToElement({ anchor: this.hash + this.anchorSufix, delay: 200 });
    }

    $(window).resize(function() {
        that.refresh();
    });

    /***
    
    make here initializing of maybe everything
    ***/


    /**this.initializeMoreContentManagers({
        showButtonCallback: function(button) {
            button.velocity({ opacity: 0 }, {
                duration: 400,
                complete: function() {
                    button.find('.simple-button__inner').html("See less");
                    button.find('.simple-button__icon-top').css({ opacity: 1 });
                    button.find('.simple-button__icon-bottom').css({ opacity: 0 });
                    button.delay(100).velocity({ opacity: 1 });
                }
            });
        },
        hideButtonCallback: function(button) {
            button.velocity({ opacity: 0 }, {
                duration: 400,
                complete: function() {
                    button.find('.simple-button__inner').html("See more");
                    button.find('.simple-button__icon-top').css({ opacity: 0 });
                    button.find('.simple-button__icon-bottom').css({ opacity: 1 });
                    button.delay(100).velocity({ opacity: 1 });
                }
            });
        }
    });**/

    /**var moreContentManager = new this.MoreContentManager(1);
    moreContentManager.run();
    **/

    /**var ajaxOverlayer = new this.AjaxOverlayerManager('overlayer', {
        onLoad: function(om) {
            console.log("onload");
        },
        onShow: function(om) {
            console.log("onshow");
        },
        onHide: function(om) {
            console.log("onhide");
        }
    });
    ajaxOverlayer.run();
    var popup = new this.PopUp('popup', {
        onLoad: function(om) {
            console.log("onload");
        },
        onShow: function(om) {
            console.log("onshow");
        },
        onHide: function(om) {
            console.log("onhide");
        }
    });
    popup.run();**/

    var moreContentManager = new this.AjaxMoreContentManager(1, {
        onLoad: function(button, contentContainer) {
            baguetteBox.run('.baguette-box');
        },
        onError: function(b, c) {
            console.log("AjaxMoreContentManager - error occured.");
        }
    });
    moreContentManager.run();

    var mainmenu = new this.SlideMenu('main-menu', { mode: 'slide-fade', direction: 'right' });
    mainmenu.run();

    this.initializeAnchors({ menu: mainmenu, delay: 100 });



    var categorizedItems = new this.CategorizedItems($('.categorized-items').first());
    categorizedItems.run();

    

    return this;
}