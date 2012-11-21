/*
 * jModal.js (a simple image and video modal)
 * version 0.3
 * (c) 2012 Jeremy Fields [jeremy.fields@viget.com]
 * released under the MIT license
 *
 * # usage
 *
 * text image:
 * <a href="#readmore" class="jmodal">Read More</a></p>
 *
 * single image:
 * <a href="http://placekitten.com/800/800" class="jmodal" data-type="image">Single Image</a></p>
 *
 * image gallery:
 * <a href="http://placekitten.com/800/600" class="jmodal" data-type="image" rel="set1">Image 1</a>
 * <a href="http://placekitten.com/600/800" class="jmodal" data-type="image" rel="set1">Image 2</a>
 * <a href="http://placekitten.com/500/500" class="jmodal" data-type="image" rel="set1">Image 3</a>
 *
 * youtube video:
 * <a href="http://www.youtube.com/watch?v=TnWDiXHYFUg&list=UUV5MN13xFPXwJX3lzbCc6gQ&index=2&feature=plpp_video" class="jmodal" data-type="video">Video</a>
 */

(function(win,doc,undefined) {
	
	'use strict';
	
	win.jModal = function() {
		
		
		/* variables
		========================================================================== */
		var $jmodal, $jUI, $sel;
		
		
		/* init
		========================================================================== */
		var init = function() {
			
			$('.jmodal').on('click',function(e) {
				e.preventDefault();
				
				if (!$jmodal) {
					addModal();
				}
				
				handleClick($(this));
			});
			
		};
		
		
		/* image
		========================================================================== */
		var loadImage = function(img) {
			$jmodal.find('.jmodal-content').html(img);
			
			showModal();
		};
		
		
		/* youtube video
		========================================================================== */
		var loadVideo = function(src) {
			var video = '<iframe width="640" height="390" src="http://www.youtube.com/embed/' + videoID(src) + '" frameborder="0" allowfullscreen></iframe>';
			
			$jmodal.find('.jmodal-content').html(video);
			
			showModal();
		};
		
		var videoID = function(url) {
			var queryString = url.split('?');
			var params = queryString[1].split('&');
			var v = '';
		
			for (var i = 0; i < params.length; i++) {
				if (params.indexOf('v=')) {
					var videoParam = params[i].split('=');
					v = videoParam[1];
		
					break;
				}
			}
		
			return v;
		};
		
		
		/* text
		========================================================================== */
		var loadText = function(src) {
			var text = $(src).html();
			
			$jmodal.find('.jmodal-content').addClass('jmodal-text').html(text);
			showModal();
		};
		
		
		/* gallery
		========================================================================== */
		var addGalleryLinks = function(elm) {
			var links = '';
			var i = 1;
			$('[rel=' + elm.attr('rel') + ']').each(function() {
				var selectedLink = ($(this).attr('href') === elm.attr('href')) ? 'selected' : '';
				links += '<a href="' + $(this).attr('href') + '" class="jmodal-gallery-link ' + selectedLink + '">' + i + '</a>';
				i++;
			});
			
			$jmodal
				.addClass('jmodal-modal-gallery')
				.append('<p class="jmodal-gallery-links"><a href="#" class="jmodal-gallery-prev">Prev</a>' + links + '<a href="#" class="jmodal-gallery-next">Next</a></p>');
	
			$sel = $jmodal.find('.selected');
			bindGalleryLinks();
		};
		
		var bindGalleryLinks = function() {
			$('.jmodal-gallery-link, .jmodal-gallery-prev, .jmodal-gallery-next').on('click',function(e) {
				e.preventDefault();
				
				advanceGallery($(this));
			});
		};
		
		var advanceGallery = function(elm) {
			if (elm.hasClass('jmodal-gallery-prev')) {
				var $prev = $sel.prev().not(elm);
				if ($prev.length !== 0) {
					handleGalleryClick($prev);
				}
			} else if (elm.hasClass('jmodal-gallery-next')) {
				var $next = $sel.next().not(elm);
				if ($next.length !== 0) {
					handleGalleryClick($next);
				}
			} else {
				if (!elm.hasClass('selected')) {
					handleGalleryClick(elm);
				}
			}
		};
		
		var handleGalleryClick = function(elm) {
			updateSelected(elm);
			
			$jmodal
				.find('.jmodal-content').addClass('loading')
				.find('img').animate({
					'opacity': 0
				},100);
			
			preloadImage(elm.attr('href'),dispGalleryImg);
		};
		
		var updateSelected = function(elm) {
			$sel.removeClass('selected');
			$sel = elm.addClass('selected');
		};
		
		var dispGalleryImg = function(img) {
			var $content = $jmodal.find('.jmodal-content').removeClass('loading').empty();
		
			var $img = $(img);
			$img
				.appendTo($content)
				.css({
					'opacity': 0
				});
			
			var w = $jmodal.outerWidth();
			var h = $jmodal.outerHeight();
		
			$jmodal.css({
				'margin-top': marginOffset(h),
				'margin-left': marginOffset(w)
			});
				
			$img.animate({
				'opacity': 1
			},300);
		};
		
		
		/* show/hide modal
		========================================================================== */
		var handleClick = function(elm) {
			if (elm.data('type') === 'image') {
				
				if (elm.attr('rel')) {
					addGalleryLinks(elm);
				}
				
				preloadImage(elm.attr('href'),loadImage);
			} else if (elm.data('type') === 'video') {
				loadVideo(elm.attr('href'));
			} else {
				loadText(elm.attr('href'));
			}
		};
		
		var addModal = function() {
			$jmodal = $('<div id="jmodal"><div class="jmodal-content"></div><a href="#" class="jmodal-close">Close</a></div>').appendTo('body');
			
			$('.jmodal-close').on('click',function(e) {
				e.preventDefault();
				
				closeModal();
			});
		};
		
		var showModal = function() {
			var w = $jmodal.outerWidth();
			var h = $jmodal.outerHeight();
			
			$jmodal.css({
				'margin-top': marginOffset(h),
				'margin-left': marginOffset(w)
			}).addClass('show');
			
			blockUI();
		};
		
		var closeModal = function() {
			$jmodal.removeClass('show');
			unBlockUI();
			
			window.setTimeout(function() {
				$jmodal.removeClass('jmodal-modal-gallery').find('.jmodal-content').removeClass('text');
				$jmodal.find('.jmodal-gallery-links').remove();
			},500);
		};
		
		
		/* utility functions
		========================================================================== */
		var preloadImage = function(src,callback) {
			var img = document.createElement('img');
			img.onload = function() {
				callback(img);
			};
			img.src = src;
		};
		
		var marginOffset = function(m) {
			return (m/2) * -1;
		};
		
		var blockUI = function() {
			if (!$jUI) {
				$jUI = $('<div id="UIBlock" />')
					.css({
						'opacity': 0
					})
					.appendTo('body')
					.animate({
						'opacity': 0.6
					},200)
					.on('click',function() {
						closeModal();
					});
			}
		};
		
		var unBlockUI = function() {
			$jUI.fadeOut(200,function() {
				$(this).remove();
				$jUI = '';
			});
		};
		
	
		/* init
		========================================================================== */
		init();

	};

}(this,this.document));